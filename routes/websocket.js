var router = require('express').Router(),
    bufferify = require('../modules/json-bufferify');

router.ws('/', (ws) => {
    ws.on('message', (data) => {
        var view,
            opcode,
            data;
        if (data instanceof Buffer) {
            view = new DataView(new Uint8Array(data).buffer);
            opcode = view.getUint8(0);
            switch (opcode) {
                case 1:
                    data = {
                        id: 'string',
                        age: 'number',
                        sex: 'number',
                        name: 'string'
                    };
                    bufferify.decode(1, data, view);
                    ws.send(JSON.stringify(data));
                    break;
                case 2:
                    data = [{
                        index: 'number',
                        name: 'string'
                    }];
                    bufferify.decode(1, data, view);
                    ws.send(JSON.stringify(data));
                    break;
                case 3:
                    data = {
                        arr: ['number'],
                        list: [{
                            index: 'number',
                            name: 'string'
                        }]
                    };
                    bufferify.decode(1, data, view);
                    ws.send(JSON.stringify(data));
                    break;
                case 4:
                    data = ['number'];
                    bufferify.decode(1, data, view);
                    ws.send(JSON.stringify(data));
                    break;
                default:
                    ws.close(1008, `Unknown opcode ${opcode}`);
            }
        } else {
            ws.close(1008, 'Not Buffer');
        }
    });
});

module.exports = router;