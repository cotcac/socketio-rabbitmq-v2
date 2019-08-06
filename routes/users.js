var express = require('express');
var router = express.Router();
var amqp = require("amqplib");
/* GET home page. */
router.post('/users', async function (req, res, next) {
    const data = req.body;
    console.log("[X]", data);
    let requestId = data.session;
    let requestData = req.body;
    // connect to Rabbit MQ and create a channel
    let connection = await amqp.connect("amqp://localhost");
    let channel = await connection.createConfirmChannel();
    publishToChannel(channel, { routingKey: "request", exchangeName: "processing", data: { requestId, requestData } });
    res.json({ status: "async pending", id: requestId });
});

// utility function to publish messages to a channel
function publishToChannel(channel, { routingKey, exchangeName, data }) {
    return new Promise((resolve, reject) => {
        channel.publish(exchangeName, routingKey, Buffer.from(JSON.stringify(data), 'utf-8'), { persistent: true }, function (err, ok) {
            if (err) {
                return reject(err);
            }
            console.log("[x] push to process");
            resolve();
        })
    });
}

module.exports = router;