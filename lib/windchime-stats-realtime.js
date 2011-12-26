require('./date_ext.js');

var redisLib = require("redis"),
    http     = require('http'),
    fs       = require("fs"),
    pubsub   = redisLib.createClient();

var VERSION, config, connected_socket, configPath;

VERSION = '0.0.1';

configPath = process.argv[2];
config = JSON.parse(fs.readFileSync(configPath).toString());

process.on('SIGUSR1', function() {
  console.log('Got SIGUSR1. Exiting...');
  return 1;
});

process.on('uncaughtException', function(err) {
  return console.error("Uncaught Exception: " + (err));
});

var io = require('socket.io').listen(parseInt(config.port));

io.sockets.on("connection", function (socket) {
  pubsub.on("message", function (channel, message) {
    var s = message.split('|'),
        json = {'visits_total': s[1], 'visits_week': s[2], 'visits_today': s[3]};
    socket.emit(config.processedChannel + ':' + s[0], json);
  });
});

pubsub.subscribe(config.processedChannel);
console.log("Waiting for visitors...");