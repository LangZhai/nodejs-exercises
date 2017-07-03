var router = require('express').Router();

router.ws('/', function (ws) {
    ws.on('message', function (msg) {
        ws.send(msg);
    });
});

module.exports = router;