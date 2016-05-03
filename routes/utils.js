var express = require('express'),
    path = require('path'),
    fs = require('fs'),
    request = require('request'),
    router = express.Router(),
    mkdirs = function (dirPath) {
        if (!fs.existsSync(dirPath)) {
            mkdirs(path.dirname(dirPath));
            fs.mkdirSync(dirPath);
        }
    };

router.get('/saveFiles', function (req, res) {
    res.render('utils/saveFiles');
});

router.post('/saveFiles', function (req, res) {
    var dirPath = req.body.dirPath,
        files = req.body.files,
        length = 0;
    try {
        files = JSON.parse(files);
    } catch (err) {
    }
    if (files instanceof Array) {
        files.forEach(function (item) {
            var savePath = item.replace(/(http|https):\/\/(.(?!\/))*.\//g, '');
            savePath = path.join(dirPath, savePath);
            mkdirs(path.dirname(savePath));
            request.get(item).pipe(fs.createWriteStream(savePath)).on('finish', function () {
                res.write('已保存：' + savePath + ' 进度：' + ++length + '/' + files.length + '\r\n');
                if (length === files.length) {
                    res.write('操作完成！');
                    res.end();
                }
            });
        });
    } else {
        res.send('操作失败！');
    }
});

module.exports = router;