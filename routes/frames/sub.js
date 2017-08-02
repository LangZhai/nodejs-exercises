var fs = require('fs'),
    path = require('path'),
    Promise = require('bluebird'),
    PNG = require('pngjs').PNG,
    picName = {
        '180': 'A',
        '135': 'B',
        '90': 'C',
        '45': 'D',
        '0': 'E'
    },
    rootPath,
    outPath,
    isFull,
    list,
    mkdirs = (dirname, mode) => {
        return new Promise(async resolve => {
            try {
                await fs.existsAsync(dirname);
                await mkdirs(path.dirname(dirname), mode);
                await fs.mkdirAsync(dirname, mode);
                resolve();
            } catch (err) {
                resolve();
            }
        });
    },
    deal = (dirIn, dirOut, txtName, offset, center) => {
        return new Promise(async (resolve, reject) => {
            var txt = [[], [], [], [], []];
            try {
                var files = await fs.readdirAsync(dirIn),
                    direction = files.length === 5 ? 8 : files.length;
                if (offset.length < files.length * 2) {
                    offset.push.apply(offset, new Array(files.length * 2 - offset.length).join().split(',').map((item, i) => {
                        return offset[i % 2] || 0;
                    }));
                }
                try {
                    await Promise.all(files.sort((a, b) => {
                        return b - a > 0;
                    }).map((item, index) => {
                        return new Promise(async (resolve, reject) => {
                            var dirPath = path.join(dirIn, item),
                                datas = [],
                                result = [],
                                prop = {width: [0], height: [0], count: [0]},
                                row = 0,
                                width = 0,
                                pic;
                            try {
                                files = await fs.readdirAsync(dirPath);
                                if (!files.length) {
                                    resolve();
                                }
                                try {
                                    await Promise.all(files.map((fileName, i) => {
                                        return new Promise((resolve, reject) => {
                                            pic = fs.createReadStream(path.join(dirPath, fileName)).pipe(new PNG());
                                            pic.on('error', err => {
                                                reject(err);
                                            }).on('parsed', data => {
                                                var arr = Array.from(data),
                                                    alpha = arr.filter((item, i) => {
                                                        return i % 4 === 3;
                                                    }).map(item => {
                                                        return item === 0 ? 0 : 1;
                                                    }),
                                                    x1 = pic.width,
                                                    x2 = 0;
                                                alpha.forEach((item, i) => {
                                                    var val = i % pic.width;
                                                    if (item === 1) {
                                                        x1 = Math.min(val, x1);
                                                        x2 = Math.max(val, x2);
                                                    }
                                                });
                                                if (x1 === pic.width) {
                                                    x1 = 0;
                                                }
                                                datas[i] = {data: arr, x1: x1, y1: Math.ceil(alpha.indexOf(1) / pic.width), x2: x2, y2: Math.ceil(alpha.lastIndexOf(1) / pic.width), width: x2 - x1 + 1};
                                                datas[i].height = datas[i].y2 - datas[i].y1;
                                                txt[index][i] = [(center ? pic.width * .5 : 240) - offset[index * 2] - datas[i].x1, (center ? pic.height * .5 : 300) - offset[index * 2 + 1] - datas[i].y1, datas[i].width, datas[i].height];
                                                resolve();
                                            });
                                        });
                                    }));
                                    if (isFull) {
                                        datas.forEach(sub => {
                                            if (prop.width[row] + sub.width > 4000) {
                                                prop.width[++row] = 0;
                                                prop.height[row] = 0;
                                                prop.count[row] = 0;
                                            }
                                            prop.width[row] += sub.width;
                                            prop.height[row] = Math.max(sub.height, prop.height[row], 1);
                                            prop.count[row]++;
                                        });
                                        width = Math.max.apply(null, prop.width);
                                        prop.height.forEach((height, row) => {
                                            var s = prop.count.slice(0, row).reduce((a, b) => {
                                                return a + b;
                                            }, 0),
                                                arr = datas.slice(s, s + prop.count[row]);
                                            for (var y = 0; y < height; y++) {
                                                arr.forEach((sub, i) => {
                                                    var start = ((y + sub.y1) * pic.width + sub.x1) * 4,
                                                        end = ((y + sub.y1) * pic.width + sub.x2 + 1) * 4,
                                                        line = sub.data.slice(start, end),
                                                        diff = end - start - line.length + (i === arr.length - 1 ? width - prop.width[row] : 0) * 4;
                                                    if (diff) {
                                                        line.push.apply(line, new Array(diff).join().split(',').map(() => {
                                                            return 0;
                                                        }));
                                                    }
                                                    result.push.apply(result, line);
                                                });
                                            }
                                        });
                                        pic = new PNG({
                                            width: width,
                                            height: prop.height.reduce((a, b) => {
                                                return a + b;
                                            })
                                        });
                                        pic.data = Buffer.from(result);
                                    }
                                    txt[index] = txt[index].reduce((a, b) => {
                                        return a.concat(b);
                                    });
                                    process.send({content: `${dirPath} 演算完毕！`});
                                    await mkdirs(path.join(outPath, dirOut), null);
                                    if (isFull) {
                                        pic.pack().pipe(fs.createWriteStream(path.join(outPath, dirOut, `${picName[item]}.png`)).on('close', () => {
                                            process.send({content: `${dirPath} 转换完毕！`});
                                            resolve();
                                        }));
                                    } else {
                                        resolve();
                                    }
                                } catch (err) {
                                    reject(err);
                                }
                            } catch (err) {
                                reject(err);
                            }
                        });
                    }));
                    await fs.writeFileAsync(path.join(outPath, dirOut, `${txtName}.txt`), txt.reduce((a, b) => {
                        return a.concat(b);
                    }, [direction, files.length]).join());
                    resolve();
                } catch (err) {
                    reject(err);
                }
            } catch (err) {
                reject(err);
            }
        });
    },
    loop = obj => {
        return new Promise(async (resolve, reject) => {
            var pathRoot = obj.key.split(path.sep)[0],
                dirIn = path.join(rootPath, obj.key),
                task = [];
            if (pathRoot === 'actor') {
                try {
                    (await fs.readdirAsync(dirIn)).forEach(fileName => {
                        task.push(deal(path.join(dirIn, fileName), path.join(pathRoot, `${obj.item.id}_${fileName}`), `${obj.item.id}_${fileName}`, obj.item.offset, obj.item.isCenter));
                    });
                } catch (err) {
                    reject(err);
                }
            } else {
                task.push(deal(dirIn, path.join(pathRoot, obj.item.id), obj.item.id, obj.item.offset, obj.item.isCenter));
            }
            try {
                await Promise.all(task);
                process.send({
                    percent: true,
                    content: `${dirIn} 生成完毕！`
                });
                if (list.length) {
                    await loop(list.shift());
                }
                resolve();
            } catch (err) {
                reject(err);
            }
        });
    };

Promise.promisifyAll(fs);

process.on('message', async msg => {
    rootPath = msg.rootPath;
    outPath = msg.outPath;
    isFull = msg.isFull;
    list = msg.list;
    if (list.length) {
        try {
            await loop(list.shift());
        } catch (err) {
            process.send({err: {message: err.message}});
        }
    }
    process.send({over: true});
    process.kill(process.pid);
});