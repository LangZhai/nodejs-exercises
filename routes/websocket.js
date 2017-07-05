var router = require('express').Router(),
    clone = (...arguments) => {
        var args,
            deep;
        if (typeof arguments[0] === 'boolean') {
            args = [].slice.call(arguments, 1);
            deep = arguments[0];
        } else {
            args = [].slice.call(arguments);
        }
        args.forEach((obj) => {
            if (obj instanceof Object) {
                for (var key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        args[0][key] = deep ? clone(deep, {}, obj[key]) : obj[key];
                    }
                }
            } else {
                args[0] = obj;
            }
        });
        return args[0];
    },
    parseObj = (offset, obj, view) => {
        if (obj instanceof Array) {
            obj.length = view.getUint8(offset++);
            obj.join().split(',').forEach((item, i) => obj[i] = clone(true, {}, obj[0]));
        }
        if (obj instanceof Array && obj[0] instanceof Object) {
            obj.forEach(item => offset = parseObj(offset, item, view));
        } else {
            Object.keys(obj).sort().forEach(item => {
                if (obj[item] instanceof Object) {
                    offset = parseObj(offset, obj[item], view);
                } else if (obj[item] === 'number') {
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
                    obj[item] = String.fromCharCode.apply(null, new Array(view.getUint8(offset++)).join().split(',').map(() => {
                        var code = view.getUint16(offset);
                        offset += 2;
                        return code;
                    }));
                }
            });
        }
        return offset;
    };

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
                    parseObj(1, data, view);
                    ws.send(JSON.stringify(data));
                    break;
                case 2:
                    data = [{
                        index: 'number',
                        name: 'string'
                    }];
                    parseObj(1, data, view);
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
                    parseObj(1, data, view);
                    ws.send(JSON.stringify(data));
                    break;
                case 4:
                    data = ['number'];
                    parseObj(1, data, view);
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