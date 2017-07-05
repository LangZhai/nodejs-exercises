# json-bufferify

This is a module can run in both Node.js and browser.

## Feature

* Convert JSON to ArrayBuffer and return the DataView.
* Revert ArrayBuffer to JSON.

## Installation

`npm install json-bufferify`

## Usage

__Require json-bufferify.__

```javascript
var bufferify = require('json-bufferify');
```

__Convert JSON to ArrayBuffer and send by WebSocket.__

```javascript
var view = bufferify.encode(0, { name: 'Bob', sex: 0, age: 25 });
var ws = new WebSocket(url);
ws.send(view);
```

__Revert ArrayBuffer to JSON.__

```javascript
ws.on('message', (data) => {
    //In Node.js the data received is Buffer, not ArrayBuffer.
    var view = new DataView(new Uint8Array(data).buffer);
    var obj = { name: 'string', sex: 'number', age: 'number' };
    bufferify.decode(0, obj, view);
    console.log(obj);
});
```