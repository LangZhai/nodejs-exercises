var router = require('express').Router(),
    bufferify = require('json-bufferify');

router.ws('/', (ws) => {
    ws.on('message', (data) => {
        var view,
            opcode,
            obj;
        if (data instanceof Buffer) {
            view = new DataView(new Uint8Array(data).buffer);
            opcode = view.getUint8(0);
            switch (opcode) {
                case 1:
                    obj = {
                        id: 'string',
                        age: 'number',
                        sex: 'number',
                        name: 'string'
                    };
                    bufferify.decode(1, obj, view);
                    ws.send(JSON.stringify(obj));
                    break;
                case 2:
                    obj = [{
                        index: 'number',
                        name: 'string'
                    }];
                    bufferify.decode(1, obj, view);
                    ws.send(JSON.stringify(obj));
                    break;
                case 3:
                    obj = {
                        arr: ['number'],
                        list: [{
                            index: 'number',
                            name: 'string'
                        }]
                    };
                    bufferify.decode(1, obj, view);
                    ws.send(JSON.stringify(obj));
                    break;
                case 4:
                    ws.send(view);
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