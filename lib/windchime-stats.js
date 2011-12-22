require('./date_ext.js');

var redisLib = require("redis"),
    fs       = require("fs"),
    pubsub   = redisLib.createClient(),
    redis    = redisLib.createClient();

var VERSION, config, configPath;

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

pubsub.on("message", function(channel, message){
  var s = message.split('|'),
      today   = new Date(),
      key     = "shops:" + s[0] + ":stats",
      visitId = s[1],
      visits_total, visits_week, visits_today;

  redis.get("visits:" + visitId, function(error, res){
    if(res == null){
      redis.set("visits:" + visitId, 1, function(error, res){
        // Expire in 24 hours
        redis.expire("visits:" + visitId, 86400 ,function(error, res){
          redis.hincrby(key, "total", 1, function(error, res){
            visits_total = res;
            redis.hincrby(key, "week:"  + today.getFullYear() + ":" + today.getWeek(),  1, function(error, res){
              visits_week = res;
              redis.hincrby(key, "date:"  + today.getFullYear() + (today.getMonth()+1) + today.getDate(), 1, function(error, res){
                visits_today = res;
                // Referer link
                redis.zincrby("shops:" + s[0] + ":stats:referer", "1", s[4], function(error, res){
                  redis.publish(config.processedChannel, s[0] + '|' + visits_total + '|' + visits_week + '|' + visits_today);
                });
              });
            });
          });
        });
      });
    }
  });
  // Shop link
  redis.zincrby("shops:" + s[0] + ":stats:page", "1", s[3]);
});

pubsub.subscribe(config.rawChannel);
console.log("Waiting for visitors...");