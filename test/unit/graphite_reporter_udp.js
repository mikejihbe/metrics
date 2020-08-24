const { Report, Meter } = require('../../index.js');

var chai = require('chai')
    , debug = require('debug')('metrics')
    , expect = chai.expect
    , assert = chai.assert
    , describe = require('mocha').describe
    , helper = require('./helper.js')
    , it = require('mocha').it
    , net = require('net')
    , util = require('util')
    , os = require('os')
    , udp = require('dgram')
    , GraphiteReporterUdp = require('../../').GraphiteReporterUdp;

chai.use(require('chai-string'));

describe.only('GraphiteReporterUdp', function () {
    //set up UDP server
    var server = udp.createSocket('udp4');

    server.on('message', function (msg, info) {
        console.log('Data received from client : ' + msg.toString());
        console.log('Received %d bytes from %s:%d\n', msg.length, info.address, info.port);
    });

    //emits when socket is ready and listening for datagram msgs
    server.on('listening', function () {
        var address = server.address();
        var port = address.port;
        var family = address.family;
        var ipaddr = address.address;
        console.log('Server is listening at port' + port);
        console.log('Server ip :' + ipaddr);
        console.log('Server is IP4/IP6 : ' + family);
    });

    //emits after the socket is closed using socket.close();
    server.on('close', function () {
        console.log('Socket is closed !');
    });

    server.bind(2222);

    //instantiate GraphiteReporterUdp
    // var registry = new Report
    // reporter = new GraphiteReporterUdp(registry, "host1", "localhost", 2222);
    // meter = new Meter
    // registry.addMetric("myapp.Meter", meter)
    // reporter.start()
    // meter.mark()

    var client = udp.createSocket('udp4');

    //buffer msg
    var buffer = require('buffer');
    var data = Buffer.from('siddheshrane');

    client.on('message', function (msg, info) {
        console.log('Data received from server : ' + msg.toString());
        console.log('Received %d bytes from %s:%d\n', msg.length, info.address, info.port);
    });

    //sending msg
    client.send(data, 2222, 'localhost', function (error) {
        if (error) {
            client.close();
        } else {
            console.log('Data sent !!!');
        }
    });

    var data1 = Buffer.from('hello');
    var data2 = Buffer.from('world');

    //sending multiple msg
    client.send([data1, data2], 2222, 'localhost', function (error) {
        if (error) {
            client.close();
        } else {
            console.log('Data sent !!!');
        }
    });
})