const WebSocket = require('ws');
var express = require('express')
var path = require('path');
var bodyParser = require('body-parser')
var events=require('events'); 


var em =new events.EventEmitter(); 
const wss = new WebSocket.Server({ port: 81 });
var app = express();

const PORT = process.env.PORT || 3000;



app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

wss.on('connection', function connection(ws) {
 // console.log('client connected');
  ws.send('{"status":"start"}');
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
    em.emit('respond',JSON.stringify(message));

  });

  em.on('posted', (data) => {

    ws.send(data);

  });


});


em.on('posted', (data) => {

  console.log('event: %s', data);

});

var listener = app.listen(PORT, function () {
  console.log("app is running on port " + PORT);
})


app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname,'/index.html'));

})



app.post('/set', function (req, res) {   

 
 em.emit('posted',JSON.stringify(req.body));

 
 res.send(JSON.stringify(req.body));
})

/*
var dir = path.join(__dirname, 'public');
app.use(express.static(dir));
*/