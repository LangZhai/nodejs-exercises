var router = require('express').Router(),
    parseObj = (obj, view) => {
        var offset = 1;
        Object.keys(obj).sort().forEach(item => {
            var type = obj[item];
            if (obj[item] instanceof Object) {

            } else if (type === 'number') {
                switch (view.getUint8(offset++)) {
                    case 0:
                        obj[item] = view.getUint8(offset);
                        offset += 1;
                        break;
                    case 1:
                        obj[item] = view.getInt8(offset);
                        offset += 1;
                        break;
                    case 2:
                        obj[item] = view.getUint16(offset);
                        offset += 2;
                        break;
                    case 3:
                        obj[item] = view.getInt16(offset);
                        offset += 2;
                        break;
                    case 4:
                        obj[item] = view.getUint32(offset);
                        offset += 4;
                        break;
                    case 5:
                        obj[item] = view.getInt32(offset);
                        offset += 4;
                        break;
                    case 6:
                        obj[item] = view.getFloat32(offset);
                        offset += 4;
                        break;
                    case 7:
                        obj[item] = view.getFloat64(offset);
                        offset += 8;
                        break;
                }
            } else {
                obj[item] = new Uint8Array(view.buffer.slice(++offset, offset + view.getUint8(offset - 1)));
                offset += obj[item].length;
                obj[item] = decodeURIComponent(String.fromCharCode.apply(null, obj[item]));
            }
        });
        return obj;
    };

router.ws('/', (ws) => {
    ws.on('message', (data) => {
        var view,
            opcode;
        if (data instanceof Buffer) {
            view = new DataView(new Uint8Array(data).buffer);
            opcode = view.getUint8(0);
            switch (opcode) {
                case 1:
                    ws.send(JSON.stringify(parseObj({
                        id: 'string',
                        age: 'number',
                        sex: 'number',
                        name: 'string'
                    }, view)));
                    break;
                case 2:
                    console.log(data);
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