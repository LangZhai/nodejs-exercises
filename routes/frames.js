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
                        callback(res);
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
                                        callback(res);
                                    }
                                }
                            });
                        });
                    } else {
                        if (--count === 0) {
                            callback(res);
                        }
                    }
                }
            });
        };
    readPath(rootPath, function (res) {
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
        total = 0,
        picName = {
            '180': 'A',
            '135': 'B',
            '90': 'C',
            '45': 'D',
            '0': 'E'
        },
        deal = function (res, dirIn, dirOut, txtName) {
            var count = 0,
                txt = [[], [], [], [], []],
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
                };
            fs.readdir(dirIn, function (err, files) {
                if (err) {
                    res.write(err.message);
                    if (--total === 0) {
                        res.end();
                    }
                } else {
                    var direction = files.length === 5 ? 8 : files.length;
                    files.forEach(function (item, index) {
                        var dirPath = path.join(dirIn, item);
                        count++;
                        fs.readdir(dirPath, function (err, files) {
                            if (err) {
                                res.write(err.message + '\r\n');
                                if (--count === 0) {
                                    if (--total === 0) {
                                        res.end();
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
                                    fs.createReadStream(path.join(dirPath, fileName)).pipe(new PNG()).on('parsed', function (data) {
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
                                                    if (y < height) {
                                                        result.push.apply(result, sub.data.slice(((y + sub.y1) * w + sub.x1) * 4, ((y + sub.y1) * w + sub.x2 + 1) * 4));
                                                    }
                                                });
                                            }
                                            pic.data = Buffer.from(result);
                                            mkdirs(path.join(outPath, dirOut), null, function () {
                                                pic.pack().pipe(fs.createWriteStream(path.join(outPath, dirOut, picName[item] + '.png')));
                                            });
                                            txt[index] = txt[index].reduce(function (a, b) {
                                                return a.concat(b);
                                            });
                                            res.write(dirPath + '\r\n');
                                            if (--count === 0) {
                                                mkdirs(path.join(outPath, dirOut), null, function () {
                                                    fs.writeFile(path.join(outPath, dirOut, txtName + '.txt'), txt.reduce(function (a, b) {
                                                        return a.concat(b);
                                                    }, [direction, files.length]).join());
                                                    if (--total === 0) {
                                                        res.end();
                                                    }
                                                });
                                            }
                                        }
                                    });
                                });
                            }
                        });
                    });
                }
            });
        };
    fs.readFile(path.join(rootPath, 'list.json'), function (err, data) {
        var obj;
        if (err) {
            res.write(err.message);
            res.end();
        } else {
            obj = JSON.parse(data);
            Object.keys(obj).forEach(function (item) {
                var pathRoot = item.split(path.sep)[0],
                    dirIn = path.join(rootPath, item);
                total++;
                if (pathRoot === 'actor') {
                    fs.readdir(dirIn, function (err, files) {
                        if (err) {
                            res.write(err.message + '\r\n');
                            if (--total === 0) {
                                res.end();
                            }
                        } else {
                            files.forEach(function (fileName) {
                                deal(res, path.join(dirIn, fileName), path.join(pathRoot, obj[item] + '_' + fileName), obj[item] + '_' + fileName);
                            });
                        }
                    });
                } else {
                    deal(res, dirIn, path.join(pathRoot, obj[item]), obj[item]);
                }
            });
        }
    });
});

module.exports = router;