var Redis = require("ioredis");
var redis = new Redis();

redis.subscribe("news", "music", function (err, count) {
    if (err) throw err;
    console.log(count);
})

redis.on("message", function (channel, message) {
    console.log("receive: [%s] [%s]", message, channel);
})
