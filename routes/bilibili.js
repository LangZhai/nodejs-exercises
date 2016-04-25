var express = require('express'),
    router = express.Router(),
    request = require('request'),
    mid = 2367398,
    getList = function (req, res, url, callback, key, page, list) {
        if (key === undefined) {
            key = ['count', 'result'];
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
            if (body.status) {
                list = list.concat(body.data[key[1]]);
            }
            if (body.data[key[0]] > list.length) {
                getList(req, res, url, callback, key, page + 1, list);
            }
            else {
                request.get({
                    url: 'http://space.bilibili.com/ajax/member/GetInfo',
                    qs: {
                        mid: req.query.mid === undefined ? mid : req.query.mid
                    },
                    json: true
                }, function (e, r, body) {
                    callback(body.data.name, list);
                });
            }
        });
    };

router.get('/bangumiList', function (req, res) {
    getList(req, res, 'http://space.bilibili.com/ajax/Bangumi/getList', function (name, list) {
        res.render('bilibili_list', {
            title: '哔哩哔哩订阅列表-' + name,
            list: list
        });
    });
});

router.get('/followList', function (req, res) {
    getList(req, res, 'http://space.bilibili.com/ajax/friend/GetAttentionList', function (name, list) {
        res.render('bilibili_list', {
            title: '哔哩哔哩关注列表-' + name,
            list: list.map(function (item) {
                return {title: item.uname};
            })
        });
    }, ['results', 'list']);
});

router.get('/fansList', function (req, res) {
    getList(req, res, 'http://space.bilibili.com/ajax/friend/GetFansList', function (name, list) {
        res.render('bilibili_list', {
            title: '哔哩哔哩粉丝列表-' + name,
            list: list.map(function (item) {
                return {title: item.uname};
            })
        });
    }, ['results', 'list']);
});

router.get('/videoList', function (req, res) {
    getList(req, res, 'http://space.bilibili.com/ajax/member/getSubmitVideos', function (name, list) {
        res.render('bilibili_list', {
            title: '哔哩哔哩视频列表-' + name,
            list: list
        });
    }, ['count', 'vlist']);
});

module.exports = router;
