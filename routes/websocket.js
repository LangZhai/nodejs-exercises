var router = require('express').Router(),
    bufferify = require('json-bufferify');

router.ws('/', (ws) => {
    ws.on('message', (data) => {
        var view,
            opcode,
            template;
        if (data instanceof Buffer) {
            view = new DataView(new Uint8Array(data).buffer);
            opcode = view.getUint8(0);
            switch (opcode) {
                case 1:
                    template = {
                        id: 'string',
                        age: 'number',
                        sex: 'number',
                        name: 'string'
                    };
                    bufferify.decode(1, template, view);
                    ws.send(JSON.stringify(template));
                    break;
                case 2:
                    template = [{
                        index: 'number',
                        name: 'string'
                    }];
                    bufferify.decode(1, template, view);
                    ws.send(JSON.stringify(template));
                    break;
                case 3:
                    template = {
                        arr: ['number'],
                        list: [{
                            index: 'number',
                            name: 'string'
                        }]
                    };
                    bufferify.decode(1, template, view);
                    ws.send(JSON.stringify(template));
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