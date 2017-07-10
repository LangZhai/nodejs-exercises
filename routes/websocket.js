var router = require('express').Router(),
    bufferify = require('json-bufferify'),
    randRange = (min, max) => {
        return Math.floor(Math.random() * ((max ? max : 0) - min + 1)) + min;
    };

var SystemSendOP;
(function (SystemSendOP) {
    SystemSendOP[SystemSendOP["ENUM_START"] = 0] = "ENUM_START";
    SystemSendOP[SystemSendOP["ENUM_END"] = 1] = "ENUM_END";
})(SystemSendOP || (SystemSendOP = {}));
var TestSendOP;
(function (TestSendOP) {
    TestSendOP[TestSendOP["SEND_JSON"] = 1] = "SEND_JSON";
    TestSendOP[TestSendOP["ENUM_END"] = 2] = "ENUM_END";
})(TestSendOP || (TestSendOP = {}));
var SystemReturnOP;
(function (SystemReturnOP) {
    SystemReturnOP[SystemReturnOP["ENUM_START"] = 0] = "ENUM_START";
    SystemReturnOP[SystemReturnOP["RETURN_TIME"] = 1] = "RETURN_TIME";
    SystemReturnOP[SystemReturnOP["ENUM_END"] = 2] = "ENUM_END";
})(SystemReturnOP || (SystemReturnOP = {}));
var TestReturnOP;
(function (TestReturnOP) {
    TestReturnOP[TestReturnOP["RETURN_JSON"] = 2] = "RETURN_JSON";
    TestReturnOP[TestReturnOP["RETURN_INFO"] = 3] = "RETURN_INFO";
    TestReturnOP[TestReturnOP["ENUM_END"] = 4] = "ENUM_END";
})(TestReturnOP || (TestReturnOP = {}));

router.ws('/', (ws) => {
    var view = bufferify.encode(1, {time: new Date().getTime()}),
        interval;
    view.setUint8(0, SystemReturnOP.RETURN_TIME);
    ws.send(view);
    interval = setInterval(() => {
        var view = bufferify.encode(1, {
            id: '3434',
            arr: [randRange(1, 5), randRange(3, 5), randRange(4, 5), randRange(50, 54), randRange(50, 56)],
            obj: {
                name: 'Lang',
                sex: 0,
                exp: randRange(345544, 67999676),
                lv: randRange(12, 20)
            }
        });
        view.setUint8(0, TestReturnOP.RETURN_INFO);
        ws.send(view);
    }, 500);
    ws.on('message', (data) => {
        var opcode;
        if (data instanceof Buffer) {
            view = new DataView(new Uint8Array(data).buffer);
            opcode = view.getUint8(0);
            if (opcode >= TestSendOP.ENUM_END || opcode <= SystemSendOP.ENUM_START) {
                ws.close(1008, `Unknown opcode ${opcode}`);
            } else {
                switch (opcode) {
                    case TestSendOP.SEND_JSON:
                        view.setUint8(0, TestReturnOP.RETURN_JSON);
                        ws.send(view);
                        break;
                }
            }
        } else {
            ws.close(1008, 'Not Buffer');
        }
    });
    ws.on('close', () => {
        clearInterval(interval);
    });
});

module.exports = router;