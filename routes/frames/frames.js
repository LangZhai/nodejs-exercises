var router = require('express').Router(),
    fs = require('fs'),
    path = require('path'),
    Promise = require('bluebird'),
    child_process = require('child_process'),
    cpus = require('os').cpus().length,
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
        old,
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
                                            if (!obj[item]) {
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
        old = JSON.parse(await fs.readFileAsync(path.join(rootPath, 'list.json')));
        if (old.baseOffset) {
            obj.baseOffset = old.baseOffset;
        }
    } catch (err) {
        old = {};
    }
    try {
        await readPath(rootPath);
        Object.keys(obj).forEach(item => {
            if (old[item]) {
                obj[item] = old[item];
            }
        });
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
    var start,
        size,
        obj,
        objKeys,
        percent = 0,
        cps = [],
        busy = false,
        rootPath = req.body.rootPath,
        outPath = req.body.outPath,
        isCenter = req.body.isCenter,
        isFull = req.body.isFull,
        writeln = content => {
            var current = new Date().getTime(),
                diff = current - (start ? start : (start = current)),
                leave = diff % (24 * 3600 * 1000),
                days = Math.floor(diff / (24 * 3600 * 1000)),
                hours = Math.floor(leave / (3600 * 1000)),
                minutes,
                seconds;
            leave = leave % (3600 * 1000);
            minutes = Math.floor(leave / (60 * 1000));
            seconds = Math.round(leave % (60 * 1000) / 1000);
            res.write(`[${days ? `${days}days ` : ''}${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}] ${content}\r\n`);
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
            item.offset.forEach((val, i) => {
                if (!item.isCenter) {
                    item.offset[i] += obj.baseOffset[i % 2 === 0 ? 0 : 1];
                }
            });
            item.isCenter = isCenter || item.isCenter;
        });
        if (objKeys.length) {
            size = Math.round(objKeys.length / cpus);
            try {
                await Promise.all(new Array(cpus).join().split(',').map((item, i) => {
                    return new Promise((resolve, reject) => {
                        var part,
                            cp = child_process.fork(path.join(__dirname, 'sub.js')).on('message', async msg => {
                                if (msg.err) {
                                    reject(msg.err);
                                } else if (msg.percent) {
                                    writeln(`${msg.content} =====${(++percent / objKeys.length * 100).toFixed(2)}%=====`);
                                } else if (msg.content) {
                                    writeln(msg.content);
                                } else if (msg.over) {
                                    if (busy) {
                                        cp.send({busy: busy});
                                    } else {
                                        console.log(`process ${cp.pid} going to over.`);
                                        busy = true;
                                        part = (await Promise.all(cps.filter(item => item !== cp).map(item => {
                                            return new Promise(resolve => {
                                                var partMessage = msg => {
                                                    if (msg.part) {
                                                        item.removeListener('message', partMessage);
                                                        resolve(msg.part);
                                                    }
                                                }
                                                item.on('message', partMessage);
                                                item.send({cps: cps.length});
                                            });
                                        }))).reduce((a, b) => a.concat(b), []).filter(item => !!item);
                                        if (part.length) {
                                            cp.send({part: part});
                                            console.log(`process ${cp.pid} get part:${part.map(item => item.key)}`);
                                        } else {
                                            cp.kill();
                                            cps.splice(cps.indexOf(cp), 1);
                                            busy = false;
                                            resolve();
                                            console.log(`process ${cp.pid} over.`);
                                        }
                                    }
                                } else if (msg.free) {
                                    busy = false;
                                }
                            });
                        cp.send({
                            rootPath: rootPath,
                            outPath: outPath,
                            isFull: isFull,
                            list: objKeys.slice(i * size, i === cpus - 1 ? undefined : (i + 1) * size).map(key => {
                                return {
                                    key: key,
                                    item: obj[key]
                                };
                            })
                        });
                        cps.push(cp);
                    });
                }));
            } catch (err) {
                cps.forEach(item => item.kill());
                cps.splice(0);
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