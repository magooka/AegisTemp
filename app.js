const DESTINATION = 'http://localhost:3000';
// const DESTINATION = 'http://aegis-server.herokuapp.com';

// const PORT = '/dev/tty.usbserial-FTGCJ3BU'; // 0~100 Counter
// const PORT1 = '/dev/tty.usbserial-FTGCJ3BU'; // left
const PORT1 = '/dev/tty.usbserial-AE017IZI'; // left
const PORT2 = '/dev/tty.usbserial-AH017LXL' // right;

const VALUE_MIN = 0;
const VALUE_MAX = 100;

var serialport = require('serialport');
var io = require('socket.io-client');

/* -------------------------------------------------------------- */

// Serial Port 1
var sp1 = readySerialPort(PORT1);
sp1.on('data', function(input) {
    sendData(input, PORT1, "device1");
});

var sp2 = readySerialPort(PORT2);
sp2.on('data', function(input) {
    sendData(input, PORT2, "device2");
});

function readySerialPort(port) {
    var sp = new serialport.SerialPort(port, {
        baudRate: 9600,
        dataBits: 8,
        parity: 'none',
        stopBits: 1,
        flowControl: false,
        parser: serialport.parsers.readline("\n")
    });
    console.log('Coonnect to Serial Port: ' + port);
    return sp;
}

function sendData(input, port, id) {
    var buffer = String(new Buffer(input, 'utf8')); // expected: '00XX'
    console.log(port + ': ' + buffer);
    if (!buffer.match(/^00[0-9A-Fa-f][0-9A-Fa-f]\s$/)) {
        return;
    }

    // hex -> decimal
    var hex = parseInt(buffer, 16);
    var decimal = parseInt(hex, 10);
    if (decimal < VALUE_MIN || VALUE_MAX < decimal) {
        return ;
    }

    // send
    var message = '{ "id": "' + id + '", "value": ' + decimal + ' }';
    socket.emit('change', message);
}

/* -------------------------------------------------------------- */

// Recieve
var socket = io.connect(DESTINATION);
socket.on('connect', function() {
    console.log('Connect to Server: ' + DESTINATION);

    socket.on('update', function(value) {
        console.log(DESTINATION + ': ' + value);
    });
});

