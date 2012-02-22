require('./date_ext.js');

var redisLib = require("redis"),
    fs       = require("fs"),
    pubsub   = redisLib.createClient(),
    redis    = redisLib.createClient(),
    processReferer = require("./referers.js");

var config, configPath;

pubsub.setMaxListeners(0);
redis.setMaxListeners(0);

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
      today   = new Date(s[5]),
      key     = "shops:" + s[0] + ":stats",
      visitId = s[1],
      visits_total, visits_today, referer;

  // Format of a message:
  //   shopId|visitCookieId|IP|s:sectionId or p:productId|referalURL|date
  // Example of message:
  //   1|132552403544617c9b1caf40e9cc7b49187c65af32|127.0.0.1|s:1|http://www.facebook.com|2011-01-30

  // If a key with the identifier of the visitor doesn't
  // exist, store this visit
  redis.get("visits:" + visitId, function(error, res){
    if(res == null){
      // Set a key for the identifier of the visitor
      redis.set("visits:" + visitId, 1, function(error, res){
        // Expire the key of the visitor Id in 24 hours
        redis.expire("visits:" + visitId, 86400 ,function(error, res){
          // Increase the total visits counter
          redis.hincrby(key, "total", 1, function(error, res){
            visits_total = res;
            // Increase the total visits of the day
            redis.hincrby(key, "date:"  + today.getFullYear() + (today.getMonth()+1) + today.getDate(), 1, function(error, res){
              visits_today = res;
              // Referer link
              referer = processReferer.process(s[4]);
              if(referer != null){
                // Increase the counter of the referer
                redis.zincrby("shops:" + s[0] + ":stats:referer", "1", referer, function(error, res){
                  // Publish the new stats in the realtime channel
                  redis.publish(config.processedChannel, s[0] + '|' + visits_total + '|' + visits_today);
                });
              }
            });
          });
        });
      });
    }
  });

  // Increase the counter of the visits of the shop
  redis.zincrby("shops:" + s[0] + ":stats:page", "1", s[3]);
});

pubsub.subscribe(config.rawChannel);
console.log("Waiting for visitors...");