let mqtt = require('mqtt');
let express = require('express');
let app = express();
let server = require('http').createServer(app);
let io = require('socket.io')(server);

let client = mqtt.connect('mqtt://test.mosquitto.org', 1883);
client.subscribe('Chat/answer',{qos:2})
 
io.on('connection', (socket) => {

    client.on('message', (topic, message) => {
        console.log(topic, ": ", message.toString());
        // Operations to do...
        io.emit('answer',{message: message.toString(), userId: 'Ian'})
    });

    socket.on('publish', (data) => {
        console.log('Publishing to: '+ data.topic);
        client.publish(data.topic, data.payload, {qos:2});
    });

    /*socket.on('disconnect', function(){
        io.emit('users-changed', {user: socket.username, event: 'left'});   
    });
    
    socket.on('set-name', (name) => {
        socket.username = name;
        io.emit('users-changed', {user: name, event: 'joined'});    
    });*/
    
    socket.on('send-message', (msg) => {
        io.emit('message', {message: {message: msg.message, userId: msg.userId, date: msg.date}});    
    });
});
 
var port = process.env.PORT || 3001;
 
server.listen(port, function(){
   console.log('listening in http://localhost:' + port);
});