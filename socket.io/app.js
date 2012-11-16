var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')
  , path = require('path');

app.listen(8080);

function handler (req, res) {
  var filePath = '.' + req.url;
  if (filePath == './') {
    filePath = './index.html';
  };

  path.exists(filePath, function(exists){
    if (exists) {
      fs.readFile(filePath, function (err, data) {
        if (err) {
          res.writeHead(500);
          return res.end('Error loading index.html');
        }

        // Should check if javascript and send correct Content-Type
        res.writeHead(200);
        res.end(data);
      });    
    };
  });

  
}

io.sockets.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});