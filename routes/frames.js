var router = require('express').Router(),
    fs = require('fs'),
    path = require('path'),
    PNG = require('pngjs').PNG,
    forceWrite = res => {
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.write('‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌');
    };

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

router.post('/list', (req, res) => {
    forceWrite(res);
    var rootPath = req.body.rootPath,
        obj = {},
        count = 0,
        readPath = (dirPath, callback, prevPath, prevName) => {
            count++;
            fs.readdir(dirPath, (err, files) => {
                if (err) {
                    res.write(err.message + '\r\n');
                    if (--count === 0) {
                        callback();
                    }
                } else {
                    var num = files.length,
                        item;
                    if (num) {
                        files.forEach(fileName => {
                            fs.stat(path.join(dirPath, fileName), (err, stats) => {
                                if (stats.isDirectory()) {
                                    if (fileName === '180') {
                                        item = path.relative(rootPath, ['1', '2', '4'].indexOf(prevName) === -1 ? dirPath : prevPath);
                                        if (obj[item] === undefined) {
                                            obj[item] = {id: '', offset: []};
                                            res.write(item + '\r\n');
                                        }
                                    } else {
                                        readPath(path.join(dirPath, fileName), callback, dirPath, fileName);
                                    }
                                }
                                if (--num === 0) {
                                    if (--count === 0) {
                                        callback();
                                    }
                                }
                            });
                        });
                    } else {
                        if (--count === 0) {
                            callback();
                        }
                    }
                }
            });
        };
    readPath(rootPath, () => {
        fs.writeFile(path.join(rootPath, 'list.json'), JSON.stringify(obj, null, 2));
        res.end();
    });
});

router.get('/auto', (req, res) => {
    res.render('frames/auto', {title: 'SpriteFrames生成器'});
});

router.post('/auto', (req, res) => {
    forceWrite(res);
    var rootPath = req.body.rootPath,
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
        start = new Date(),
        mkdirs = (dirname, mode, callback) => {
            fs.exists(dirname, exists => {
                if (exists) {
                    callback();
                } else {
                    mkdirs(path.dirname(dirname), mode, () => {
                        fs.mkdir(dirname, mode, callback);
                    });
                }
            });
        },
        timeDiff = (start, end) => {
            var diff = end.getTime() - start.getTime(),
                leave = diff % (24 * 3600 * 1000),
                days = Math.floor(diff / (24 * 3600 * 1000)),
                hours,
                minutes,
                seconds;
            hours = Math.floor(leave / (3600 * 1000));
            leave = leave % (3600 * 1000);
            minutes = Math.floor(leave / (60 * 1000));
            seconds = Math.round(leave % (60 * 1000) / 1000);
            return (days ? days + 'days ' : '') + (hours < 10 ? '0' + hours : hours) + ':' + (minutes < 10 ? '0' + minutes : minutes) + ':' + (seconds < 10 ? '0' + seconds : seconds);
        },
        writeln = content => {
            res.write('[' + timeDiff(start, new Date()) + '] ' + content + '\r\n');
        };
    res.write('[00:00:00] SpriteFrames生成开始！\r\n');
    fs.readFile(path.join(rootPath, 'list.json'), (err, data) => {
        var obj,
            objKeys = [],
            index = -1,
            total = 0,
            deal = (dirIn, dirOut, txtName, offset, center) => {
                var count = 0,
                    txt = [[], [], [], [], []];
                total++;
                fs.readdir(dirIn, (err, files) => {
                    if (err) {
                        writeln(err.message);
                        if (--total === 0) {
                            callback();
                        }
                    } else {
                        var direction = files.length === 5 ? 8 : files.length;
                        if (offset.length < files.length * 2) {
                            offset.push.apply(offset, new Array(files.length * 2 - offset.length).join().split(',').map((item, i) => {
                                return offset[i % 2] || 0;
                            }));
                        }
                        files.sort((a, b) => {
                            return b - a > 0;
                        }).forEach((item, index) => {
                            var dirPath = path.join(dirIn, item);
                            count++;
                            fs.readdir(dirPath, (err, files) => {
                                if (err) {
                                    writeln(err.message);
                                    if (--count === 0) {
                                        if (--total === 0) {
                                            callback();
                                        }
                                    }
                                } else {
                                    var num = files.length,
                                        datas = [],
                                        result = [],
                                        prop = {width: [0], height: [0], count: [0]},
                                        row = 0,
                                        width = 0,
                                        pic;
                                    if (num === 0) {
                                        if (--count === 0) {
                                            if (--total === 0) {
                                                callback();
                                            }
                                        }
                                    }
                                    files.forEach((fileName, i) => {
                                        pic = fs.createReadStream(path.join(dirPath, fileName)).pipe(new PNG());
                                        pic.on('error', err => {
                                            writeln(err.message);
                                            if (--num === 0) {
                                                if (--count === 0) {
                                                    if (--total === 0) {
                                                        callback();
                                                    }
                                                }
                                            }
                                        }).on('parsed', data => {
                                            var arr = Array.from(data),
                                                alpha = arr.filter((item, i) => {
                                                    return i % 4 === 3;
                                                }).map(item => {
                                                    return item === 0 ? 0 : 1;
                                                }),
                                                w = pic.width,
                                                h = pic.height,
                                                x1 = w,
                                                x2 = 0;
                                            alpha.forEach((item, i) => {
                                                var val = i % w;
                                                if (item === 1) {
                                                    x1 = Math.min(val, x1);
                                                    x2 = Math.max(val, x2);
                                                }
                                            });
                                            if (x1 === w) {
                                                x1 = 0;
                                            }
                                            datas[i] = {data: arr, x1: x1, y1: Math.ceil(alpha.indexOf(1) / w), x2: x2, y2: Math.ceil(alpha.lastIndexOf(1) / w), width: x2 - x1 + 1};
                                            datas[i].height = datas[i].y2 - datas[i].y1;
                                            txt[index][i] = [(center ? w * .5 : 240) - offset[index * 2] - datas[i].x1, (center ? h * .5 : 300) - offset[index * 2 + 1] - datas[i].y1, datas[i].width, datas[i].height];
                                            if (--num === 0) {
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
                                                                var start = ((y + sub.y1) * w + sub.x1) * 4,
                                                                    end = ((y + sub.y1) * w + sub.x2 + 1) * 4,
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
                                                writeln(dirPath + ' 演算完毕！');
                                                mkdirs(path.join(outPath, dirOut), null, () => {
                                                    var save = () => {
                                                        if (--count === 0) {
                                                            fs.writeFile(path.join(outPath, dirOut, txtName + '.txt'), txt.reduce((a, b) => {
                                                                return a.concat(b);
                                                            }, [direction, files.length]).join(), () => {
                                                                writeln(dirIn + ' 生成完毕！');
                                                                if (--total === 0) {
                                                                    callback();
                                                                }
                                                            });
                                                        }
                                                    };
                                                    if (isFull) {
                                                        pic.pack().pipe(fs.createWriteStream(path.join(outPath, dirOut, picName[item] + '.png')).on('close', () => {
                                                            writeln(dirPath + ' 转换完毕！');
                                                            save();
                                                        }));
                                                    } else {
                                                        save();
                                                    }
                                                });
                                            }
                                        });
                                    });
                                }
                            });
                        });
                    }
                });
            },
            loop = item => {
                var pathRoot = item.split(path.sep)[0],
                    dirIn = path.join(rootPath, item);
                total = 0;
                if (pathRoot === 'actor') {
                    fs.readdir(dirIn, (err, files) => {
                        if (err) {
                            writeln(err.message);
                            callback();
                        } else {
                            files.forEach(fileName => {
                                deal(path.join(dirIn, fileName), path.join(pathRoot, obj[item].id + '_' + fileName), obj[item].id + '_' + fileName, obj[item].offset, obj[item].isCenter);
                            });
                        }
                    });
                } else {
                    deal(dirIn, path.join(pathRoot, obj[item].id), obj[item].id, obj[item].offset, obj[item].isCenter);
                }
            },
            callback = () => {
                if (++index < objKeys.length) {
                    loop(objKeys[index]);
                } else {
                    writeln('SpriteFrames生成结束！');
                    res.end();
                }
            };
        if (err) {
            writeln(err.message);
            callback();
        } else {
            obj = JSON.parse(data);
            Object.defineProperty(obj, 'baseOffset', {
                enumerable: false
            });
            objKeys = Object.keys(obj);
            objKeys.forEach((key) => {
                var item = obj[key];
                item.offset.forEach((val, i) => item.offset[i] += obj.baseOffset[i % 2 === 0 ? 0 : 1]);
                item.isCenter = isCenter || item.isCenter;
            });
            callback();
        }
    });
});

module.exports = router;