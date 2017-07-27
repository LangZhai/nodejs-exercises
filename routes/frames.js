var router = require('express').Router(),
    fs = require('fs'),
    path = require('path'),
    PNG = require('pngjs').PNG,
    Promise = require('bluebird'),
    forceWrite = res => {
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.write('‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌');
    };

Promise.promisifyAll(fs);

router.get('/', (req, res) => {
    res.render('frames/index', {title: 'SpriteFrames编辑器'});
});

router.get('/offset', (req, res) => {
    res.render('frames/offset', {title: 'SpriteFrames相对坐标'});
});

router.get('/save', (req, res) => {
    res.setHeader('Content-Type', 'text/json; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename=unnamed.txt');
    res.write(req.query.txt);
    res.end();
});

router.get('/list', (req, res) => {
    res.render('frames/list', {title: 'SpriteFrames列表'});
});

router.post('/list', async (req, res) => {
    forceWrite(res);
    var rootPath = req.body.rootPath,
        obj = {},
        readPath = (dirPath, prevPath, prevName) => {
            return new Promise(async (resolve, reject) => {
                try {
                    var files = await fs.readdirAsync(dirPath),
                        item;
                    if (!files.length) {
                        resolve();
                    }
                    try {
                        await Promise.all(files.map(fileName => {
                            return new Promise(async (resolve, reject) => {
                                try {
                                    if ((await fs.statAsync(path.join(dirPath, fileName))).isDirectory()) {
                                        if (fileName === '180') {
                                            item = path.relative(rootPath, ['1', '2', '4'].indexOf(prevName) === -1 ? dirPath : prevPath);
                                            if (obj[item] === undefined) {
                                                obj[item] = {id: '', offset: []};
                                                res.write(`${item}\r\n`);
                                            }
                                        } else {
                                            await readPath(path.join(dirPath, fileName), dirPath, fileName);
                                        }
                                    }
                                    resolve();
                                } catch (err) {
                                    reject(err);
                                }
                            });
                        }));
                        resolve();
                    } catch (err) {
                        reject(err);
                    }
                } catch (err) {
                    reject(err);
                }
            });
        };
    try {
        await readPath(rootPath);
        await fs.writeFileAsync(path.join(rootPath, 'list.json'), JSON.stringify(obj, null, 2));
    } catch (err) {
        res.write(`${err.message}\r\n`);
    }
    res.write('结束');
    res.end();
});

router.get('/auto', (req, res) => {
    res.render('frames/auto', {title: 'SpriteFrames生成器'});
});

router.post('/auto', async (req, res) => {
    forceWrite(res);
    var obj,
        objKeys,
        rootPath = req.body.rootPath,
        outPath = req.body.outPath,
        isCenter = req.body.isCenter,
        isFull = req.body.isFull,
        picName = {
            '180': 'A',
            '135': 'B',
            '90': 'C',
            '45': 'D',
            '0': 'E'
        },
        start,
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
        writeln = content => {
            var current = new Date().getTime(),
                diff = current - (start ? start : (start = current)),
                leave = diff % (24 * 3600 * 1000),
                days = Math.floor(diff / (24 * 3600 * 1000)),
                hours,
                minutes,
                seconds;
            hours = Math.floor(leave / (3600 * 1000));
            leave = leave % (3600 * 1000);
            minutes = Math.floor(leave / (60 * 1000));
            seconds = Math.round(leave % (60 * 1000) / 1000);
            res.write(`[${days ? `${days}days ` : ''}${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}] ${content}\r\n`);
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
                                        writeln(`${dirPath} 演算完毕！`);
                                        await mkdirs(path.join(outPath, dirOut), null);
                                        if (isFull) {
                                            pic.pack().pipe(fs.createWriteStream(path.join(outPath, dirOut, `${picName[item]}.png`)).on('close', () => {
                                                writeln(`${dirPath} 转换完毕！`);
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
                        writeln(`${dirIn} 生成完毕！`);
                        resolve();
                    } catch (err) {
                        reject(err);
                    }
                } catch (err) {
                    reject(err);
                }
            });
        },
        loop = (key) => {
            return new Promise(async (resolve, reject) => {
                var item = obj[key],
                    pathRoot = key.split(path.sep)[0],
                    dirIn = path.join(rootPath, key),
                    task = [];
                if (pathRoot === 'actor') {
                    try {
                        (await fs.readdirAsync(dirIn)).forEach(fileName => {
                            task.push(deal(path.join(dirIn, fileName), path.join(pathRoot, `${item.id}_${fileName}`), `${item.id}_${fileName}`, item.offset, item.isCenter));
                        });
                    } catch (err) {
                        reject(err);
                    }
                } else {
                    task.push(deal(dirIn, path.join(pathRoot, item.id), item.id, item.offset, item.isCenter));
                }
                try {
                    await Promise.all(task);
                    if (objKeys.length) {
                        await loop(objKeys.shift());
                    }
                    resolve();
                } catch (err) {
                    reject(err);
                }
            });
        };
    writeln('SpriteFrames生成开始！');
    try {
        obj = JSON.parse(await fs.readFileAsync(path.join(rootPath, 'list.json')));
        Object.defineProperty(obj, 'baseOffset', {
            enumerable: false
        });
        objKeys = Object.keys(obj);
        objKeys.forEach(key => {
            var item = obj[key];
            item.offset.forEach((val, i) => item.offset[i] += obj.baseOffset[i % 2 === 0 ? 0 : 1]);
            item.isCenter = isCenter || item.isCenter;
        });
        if (objKeys.length) {
            try {
                await loop(objKeys.shift());
            } catch (err) {
                writeln(err.message);
            }
        }
    } catch (err) {
        writeln(err.message);
    }
    writeln('SpriteFrames生成结束！');
    res.end();
});

module.exports = router;