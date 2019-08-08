var Redis = require("ioredis");
var redis = new Redis();
var pub = new Redis();

redis.subscribe("news","music", function (err, count) {

    pub.publish("news", "baby die in the car");
    pub.publish("music", "JB news album");
    
})
