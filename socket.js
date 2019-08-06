// socket on it own server.

var socket  = require( 'socket.io' );
var express = require('express');
var app     = express();
var server  = require('http').createServer(app);
var io      = socket.listen( server );
var port    = process.env.PORT || 3001;
const amqp = require("amqplib")
server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

 // connect to Rabbit MQ and create a channel
 listenForResults();
 async function listenForResults() {
    // connect to Rabbit MQ
    let connection = await amqp.connect("amqp://localhost");

    // create a channel and prefetch 1 message at a time
    let channel = await connection.createChannel();
    await channel.prefetch(1);

    // start consuming messages
    await consume({ connection, channel });
  }

  // consume messages from RabbitMQ
  function consume({ connection, channel }) {
    return new Promise((resolve, reject) => {
      channel.consume("processing.results", async function (msg) {
        // parse message
        let msgBody = msg.content.toString();
        let data = JSON.parse(msgBody);
        let requestId = data.requestId;
        let processingResults = data.processingResults;
        console.log("[x]Received requestId:", requestId, "processingResults:", processingResults);


        // acknowledge message as received
        await channel.ack(msg);
        // send notification to browsers
        io.sockets.emit(requestId + '_new message', "SUCESS");

      });

      // handle connection closed
      connection.on("close", (err) => {
        return reject(err);
      });

      // handle errors
      connection.on("error", (err) => {
        return reject(err);
      });
    });
  }
io.on('connection', function (socket) {
   // send message
   console.log("[x]", socket.id);
   
    socket.on('send message', function(data){
        console.log(data);
         app.io.sockets.emit(requestId + '_new message', "SUCESS");
        io.sockets.emit('new message',data);
    });
});