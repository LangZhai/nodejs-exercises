var express = require('express'),
    path = require('path'),
    fs = require('fs'),
    PNG = require('pngjs').PNG,
    router = express.Router(),
    forceWrite = function (res) {
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.write('‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌');
    };

router.get('/', function (req, res) {
    res.render('frames/index', {title: 'SpriteFrames编辑器'});
});

router.get('/save', function (req, res) {
    res.setHeader('Content-Type', 'text/json; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename=unnamed.txt');
    res.write(req.query.txt);
    res.end();
});

router.get('/list', function (req, res) {
    res.render('frames/list', {title: 'SpriteFrames列表'});
});

router.post('/list', function (req, res) {
    forceWrite(res);
    var rootPath = req.body.rootPath,
        obj = {},
        count = 0,
        readPath = function (dirPath, callback, prevPath, prevName) {
            count++;
            fs.readdir(dirPath, function (err, files) {
                if (err) {
                    res.write(err.message + '\r\n');
                    if (--count === 0) {
                        callback();
                    }
                } else {
                    var num = files.length,
                        item;
                    if (num) {
                        files.forEach(function (fileName) {
                            fs.stat(path.join(dirPath, fileName), function (err, stats) {
                                if (stats.isDirectory()) {
                                    if (fileName === '180') {
                                        item = path.relative(rootPath, ['1', '2', '4'].indexOf(prevName) === -1 ? dirPath : prevPath);
                                        if (obj[item] === undefined) {
                                            obj[item] = '';
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
    readPath(rootPath, function () {
        fs.writeFile(path.join(rootPath, 'list.json'), JSON.stringify(obj, null, 2));
        res.end();
    });
});

router.get('/auto', function (req, res) {
    res.render('frames/auto', {title: 'SpriteFrames生成器'});
});

router.post('/auto', function (req, res) {
    forceWrite(res);
    var rootPath = req.body.rootPath,
        outPath = req.body.outPath,
        picName = {
            '180': 'A',
            '135': 'B',
            '90': 'C',
            '45': 'D',
            '0': 'E'
        },
        start = new Date(),
        mkdirs = function (dirname, mode, callback) {
            fs.exists(dirname, function (exists) {
                if (exists) {
                    callback();
                } else {
                    mkdirs(path.dirname(dirname), mode, function () {
                        fs.mkdir(dirname, mode, callback);
                    });
                }
            });
        },
        timeDiff = function (start, end) {
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
        writeln = function (content) {
            res.write('[' + timeDiff(start, new Date()) + '] ' + content + '\r\n');
        };
    res.write('[00:00:00] SpriteFrames生成开始！\r\n');
    fs.readFile(path.join(rootPath, 'list.json'), function (err, data) {
        var obj,
            objKeys = [],
            index = -1,
            total = 0,
            deal = function (dirIn, dirOut, txtName, callback) {
                var count = 0,
                    txt = [[], [], [], [], []];
                total++;
                fs.readdir(dirIn, function (err, files) {
                    if (err) {
                        writeln(err.message);
                        if (--total === 0) {
                            callback();
                        }
                    } else {
                        var direction = files.length === 5 ? 8 : files.length;
                        files.sort(function (a, b) {
                            return b - a > 0;
                        }).forEach(function (item, index) {
                            var dirPath = path.join(dirIn, item);
                            count++;
                            fs.readdir(dirPath, function (err, files) {
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
                                        width = 0,
                                        height = 0,
                                        pic;
                                    files.forEach(function (fileName, i) {
                                        fs.createReadStream(path.join(dirPath, fileName)).pipe(new PNG()).on('error', function (err) {
                                            writeln(err.message);
                                            if (--num === 0) {
                                                if (--count === 0) {
                                                    if (--total === 0) {
                                                        callback();
                                                    }
                                                }
                                            }
                                        }).on('parsed', function (data) {
                                            var arr = Array.from(data),
                                                alpha = arr.filter(function (item, i) {
                                                    return i % 4 === 3;
                                                }).map(function (item) {
                                                    return item === 0 ? 0 : 1;
                                                }),
                                                w = this.width,
                                                x1 = w,
                                                x2 = 0;
                                            alpha.forEach(function (item, i) {
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
                                            width += datas[i].width;
                                            height = Math.max(height, datas[i].height);
                                            txt[index][i] = [400 - datas[i].x1, 535 - datas[i].y1, datas[i].width, datas[i].height];
                                            if (--num === 0) {
                                                pic = new PNG({width: width, height: height});
                                                for (var y = 0; y < height; y++) {
                                                    datas.forEach(function (sub) {
                                                        var start = ((y + sub.y1) * w + sub.x1) * 4,
                                                            end = ((y + sub.y1) * w + sub.x2 + 1) * 4,
                                                            line = sub.data.slice(start, end),
                                                            diff = end - start - line.length;
                                                        if (diff) {
                                                            line.push.apply(line, new Array(diff).join().split(',').map(function () {
                                                                return 0;
                                                            }));
                                                        }
                                                        result.push.apply(result, line);
                                                    });
                                                }
                                                pic.data = Buffer.from(result);
                                                txt[index] = txt[index].reduce(function (a, b) {
                                                    return a.concat(b);
                                                });
                                                writeln(dirPath + ' 演算完毕！');
                                                mkdirs(path.join(outPath, dirOut), null, function () {
                                                    pic.pack().pipe(fs.createWriteStream(path.join(outPath, dirOut, picName[item] + '.png')).on('close', function () {
                                                        writeln(dirPath + ' 转换完毕！');
                                                        if (--count === 0) {
                                                            fs.writeFile(path.join(outPath, dirOut, txtName + '.txt'), txt.reduce(function (a, b) {
                                                                return a.concat(b);
                                                            }, [direction, files.length]).join(), function () {
                                                                writeln(dirIn + ' 生成完毕！');
                                                                if (--total === 0) {
                                                                    callback();
                                                                }
                                                            });
                                                        }
                                                    }));
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
            loop = function (item) {
                var pathRoot = item.split(path.sep)[0],
                    dirIn = path.join(rootPath, item);
                total = 0;
                if (pathRoot === 'actor') {
                    fs.readdir(dirIn, function (err, files) {
                        if (err) {
                            writeln(err.message);
                            callback();
                        } else {
                            files.forEach(function (fileName) {
                                deal(path.join(dirIn, fileName), path.join(pathRoot, obj[item] + '_' + fileName), obj[item] + '_' + fileName, callback);
                            });
                        }
                    });
                } else {
                    deal(dirIn, path.join(pathRoot, obj[item]), obj[item], callback);
                }
            },
            callback = function () {
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
            objKeys = Object.keys(obj);
            callback();
        }
    });
});

module.exports = router;