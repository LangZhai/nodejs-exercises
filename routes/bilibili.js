var express = require('express'),
    request = require('request'),
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
                    var result = deal(body.data.name, list);
                    if (req.query.type === 'json') {
                        if (req.query.download === 'true') {
                            res.setHeader('Content-Type', 'text/json; charset=utf-8');
                            if (req.get('User-Agent').toLowerCase().indexOf('firefox') === -1) {
                                res.setHeader('Content-Disposition', 'attachment; filename=' + encodeURIComponent(result.title + '_' + new Date().getTime() + '.json'));
                            } else {
                                res.setHeader('Content-Disposition', 'attachment; filename*="utf-8\'\'' + encodeURIComponent(result.title + '_' + new Date().getTime() + '.json') + '"');
                            }
                        }
                        res.send({
                            path: req.path,
                            list: list
                        });
                    } else {
                        res.render('bilibili_list', result);
                    }
                });
            }
        });
    };

router.get('/*List', function (req, res) {
    var url, deal, keys;
    switch (req.path) {
    case '/bangumiList':
        url = 'http://space.bilibili.com/ajax/Bangumi/getList';
        deal = function (name, list) {
            return {
                title: '哔哩哔哩订阅列表-' + name,
                list: list
            };
        };
        break;
    case '/followList':
        url = 'http://space.bilibili.com/ajax/friend/GetAttentionList';
        deal = function (name, list) {
            return {
                title: '哔哩哔哩关注列表-' + name,
                list: list.map(function (item) {
                    return {title: item.uname};
                })
            };
        };
        keys = ['results', 'list'];
        break;
    case '/fansList':
        url = 'http://space.bilibili.com/ajax/friend/GetFansList';
        deal = function (name, list) {
            return {
                title: '哔哩哔哩粉丝列表-' + name,
                list: list.map(function (item) {
                    return {title: item.uname};
                })
            };
        };
        keys = ['results', 'list'];
        break;
    case '/videoList':
        url = 'http://space.bilibili.com/ajax/member/getSubmitVideos';
        deal = function (name, list) {
            return {
                title: '哔哩哔哩视频列表-' + name,
                list: list
            };
        };
        keys = ['count', 'vlist'];
        break;
    default:
        var err = new Error();
        err.status = 404;
        throw err;
    }
    getList(req, res, url, deal, keys);
});

router.post('/*List', function (req, res) {
    request.get({
        url: req.get('Referer'),
        qs: {type: 'json'},
        json: true
    }, function (e, r, body) {
        res.send(body);
    });
});

module.exports = router;
