var express = require('express'),
    request = require('request'),
    multiparty = require('multiparty'),
    router = express.Router(),
    mid = 2367398,
    getList = function (req, res, url, deal, keys, page, list) {
        if (keys === undefined) {
            keys = ['count', 'result'];
        }
        if (page === undefined) {
            page = 1;
        }
        if (list === undefined) {
            list = [];
        }
        request.get({
            url: url,
            qs: {
                mid: req.query.mid === undefined ? mid : req.query.mid,
                page: page
            },
            json: true
        }, function (e, r, body) {
            if (body.data[keys[1]] !== undefined) {
                list = list.concat(body.data[keys[1]]);
            }
            if (body.data[keys[0]] > list.length) {
                getList(req, res, url, deal, keys, page + 1, list);
            }
            else {
                request.get({
                    url: 'http://space.bilibili.com/ajax/member/GetInfo',
                    qs: {
                        mid: req.query.mid === undefined ? mid : req.query.mid
                    },
                    json: true
                }, function (e, r, body) {
                    var data = deal(body.data.name, list);
                    data.mid = req.query.mid === undefined ? mid : req.query.mid;
                    if (req.query.type === 'json') {
                        if (req.query.download === 'true') {
                            res.setHeader('Content-Type', 'text/json; charset=utf-8');
                            if (req.get('User-Agent').toLowerCase().indexOf('firefox') === -1) {
                                res.setHeader('Content-Disposition', 'attachment; filename=' + encodeURIComponent(data.title + '_' + new Date().getTime() + '.json'));
                            } else {
                                res.setHeader('Content-Disposition', 'attachment; filename*="utf-8\'\'' + encodeURIComponent(data.title + '_' + new Date().getTime() + '.json') + '"');
                            }
                        }
                        res.json({
                            path: req.path,
                            list: data.list
                        });
                    } else {
                        res.render('bilibili/list', data);
                    }
                });
            }
        });
    };

router.get('/bangumiList', function (req, res) {
    getList(req, res, 'http://space.bilibili.com/ajax/Bangumi/getList', function (name, list) {
        return {
            title: '哔哩哔哩订阅列表-' + name,
            list: list.map(function (item) {
                var obj = JSON.parse(JSON.stringify(item));
                obj._title = obj.title;
                obj._id = obj.season_id;
                return obj;
            })
        };
    });
});

router.get('/followList', function (req, res) {
    getList(req, res, 'http://space.bilibili.com/ajax/friend/GetAttentionList', function (name, list) {
        return {
            title: '哔哩哔哩关注列表-' + name,
            list: list.map(function (item) {
                var obj = JSON.parse(JSON.stringify(item));
                obj._title = obj.uname;
                obj._id = obj.fid;
                return obj;
            })
        };
    }, ['results', 'list']);
});

router.get('/fansList', function (req, res) {
    getList(req, res, 'http://space.bilibili.com/ajax/friend/GetFansList', function (name, list) {
        return {
            title: '哔哩哔哩粉丝列表-' + name,
            list: list.map(function (item) {
                var obj = JSON.parse(JSON.stringify(item));
                obj._title = obj.uname;
                obj._id = obj.fid;
                return obj;
            })
        };
    }, ['results', 'list']);
});

router.get('/videoList', function (req, res) {
    getList(req, res, 'http://space.bilibili.com/ajax/member/getSubmitVideos', function (name, list) {
        return {
            title: '哔哩哔哩视频列表-' + name,
            list: list.map(function (item) {
                var obj = JSON.parse(JSON.stringify(item));
                obj._title = obj.title;
                obj._id = obj.aid;
                return obj;
            })
        };
    }, ['count', 'vlist']);
});

router.post('/*List', function (req, res) {
    var data = {},
        formData = {file: []},
        form = new multiparty.Form();
    form.on('field', function (key, val) {
        formData[key] = val;
    });
    form.on('part', function (part) {
        if (part.name !== 'file') {
            return part.resume();
        }
        data.file = part.filename;
        part.on('data', function (buf) {
            formData.file.push(new Buffer(buf).toString());
        });
    });
    form.on('close', function () {
        data.title = formData.title + '-比较';
        if (formData.file.length) {
            formData.file = JSON.parse(formData.file.join(''));
            request.get({
                url: req.get('Referer'),
                qs: {type: 'json'},
                json: true
            }, function (e, r, body) {
                if (body.path === formData.file.path) {
                    data.add = body.list.filter(function (itemA) {
                        return formData.file.list.every(function (itemB) {
                            return itemA._id !== itemB._id;
                        });
                    });
                    data.remove = formData.file.list.filter(function (itemA) {
                        return body.list.every(function (itemB) {
                            return itemA._id !== itemB._id;
                        });
                    });
                    if (data.add.length === 0 && data.remove.length === 0) {
                        data.msg = '条目没有任何区别！';
                    }
                } else {
                    data.msg = '选择的文件不匹配！';
                }
                res.render('bilibili/compare', data);
            });
        } else {
            data.msg = '未选择文件！';
            res.render('bilibili/compare', data);
        }
    });
    form.parse(req);
});

module.exports = router;