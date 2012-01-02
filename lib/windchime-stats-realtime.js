var redisLib = require("redis"),
    http     = require('http'),
    fs       = require("fs"),
    pubsub   = redisLib.createClient();

var config, connected_socket, configPath, visits_week;

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
        json = {'visits_total': s[1], 'visits_today': s[2]};
    socket.emit(config.processedChannel + ':' + s[0], json);
  });
});

pubsub.subscribe(config.processedChannel);
console.log("Waiting for visitors...");