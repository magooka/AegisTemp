// const DESTINATION = 'http://localhost:3000';
const DESTINATION = 'http://aegis-server.herokuapp.com';
const PORT = '/dev/tty.usbserial-FTGCJ3BU'; // 0~100 Counter
// const PORT = '/dev/tty.usbserial-A400FSOF'; // Bluetooth?
// const PORT = '/dev/tty.usbserial-AH017LXL'; // ?

var serialport = require('serialport');
var io = require('socket.io-client');

// Serial Port
var sp = new serialport.SerialPort(PORT, {
    baudRate: 9600,
    dataBits: 8,
    parity: 'none',
    stopBits: 1,
    flowControl: false,
    parser: serialport.parsers.readline("\n")
});
console.log('Coonnect to Serial Port: ' + PORT);

// Send
sp.on('data', function(input) {
    var buffer = new Buffer(input, 'utf8'); // expected: '00XX'
    console.log(PORT + ': ' + buffer);

    // hex -> decimal
    var hex = parseInt(buffer, 16);
    var decimal = parseInt(hex, 10);
    deviceValue = decimal;

    // json

    // send value
    socket.emit('change', decimal);
});

// Recieve
var socket = io.connect(DESTINATION);
socket.on('connect', function() {
    console.log('Connect to Server: ' + DESTINATION);

    socket.on('update', function(value) {
        console.log(DESTINATION + ': ' + value);
    });
});

