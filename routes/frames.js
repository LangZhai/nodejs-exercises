var express = require('express'),
    router = express.Router();

router.get('/', function (req, res) {
    res.render('frames/index', {title: 'SpriteFrames编辑器'});
});

router.get('/save', function (req, res) {
    res.setHeader('Content-Type', 'text/json; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename=unnamed.txt');
    res.write(req.query.txt);
    res.end();
});

module.exports = router;