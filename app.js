import process from 'node:process';

import {HaloGateway} from "@arx-research/libhalo/api/web.js";
import QRCode from 'qrcode';
import websocket from 'websocket';

// list of HaLo commands that will be executed
// once the tag is detected by the reader
let commands = [
    {
        "name": "sign",
        "message": "010203",
        "keyNo": 1
    },
    {
        "name": "sign",
        "message": "05050505",
        "keyNo": 1
    }
];

let gate = new HaloGateway('wss://s1.halo-gateway.arx.org', {
    createWebSocket: (url) => new websocket.w3cwebsocket(url)
});

let pairInfo = await gate.startPairing();

QRCode.toString(pairInfo.execURL, {type: 'terminal'}, function (err, qrtext) {
    console.log('Please scan the following QR code using your smartphone:');
    console.log('');
    console.log(qrtext);
    console.log('');
})

console.log('Waiting for smartphone to connect...');
await gate.waitConnected();

for (let cmd of commands) {
    console.log('Executing command:', cmd);
    let res = await gate.execHaloCmd(cmd);
    console.log('Command result:', res);
}

process.exit(0);
