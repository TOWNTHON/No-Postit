var http = require("http");
var socketio = require("socket.io");
var fs = require("fs");

var server = http.createServer(function(req, res) {
     res.writeHead(200, {"Content-Type":"text/html"});
     var output = fs.readFileSync("index.html", "utf-8");
     res.end(output);
}).listen(process.env.VMC_APP_PORT || 3000);

var io = socketio.listen(server);

io.sockets.on("connection", function (socket) {

  // メッセージ送信（送信者にも送られる）
  socket.on("C_to_S_message", function (data) {
    io.sockets.emit("S_to_C_message", {value:data.value});
  });

  // ブロードキャスト（送信者以外の全員に送信）
  socket.on("C_to_S_broadcast", function (data) {
    socket.broadcast.emit("S_to_C_message", {value:data.value});
  });

  // 切断したときに送信
  socket.on("disconnect", function () {
//    io.sockets.emit("S_to_C_message", {value:"user disconnected"});
  });

  //アップロード処理
  socket.on('upload', function(data) {

        var fs = require('fs');
        var writeFile = data.file;
        var writePath = './public/images/test.jpg';//Σ(ﾟдﾟ) ｴｯ!? 

        var writeStream = fs.createWriteStream(writePath);
        writeStream.on('drain', function () {} )
                          .on('error', function (exception) {
                          //エラー処理
                               console.log("exception:"+exception);
                           }) 
                          .on('close', function () {
                          //(☞三☞三☞՞ਊ՞)☞三☞三☞書き込み完了時の処理
                          })  
                          .on('pipe', function (src) {}); 

        writeStream.write(writeFile,'binary');//バイナリでお願いする
        writeStreamend();
        //✌( ◔౪◔)✌<ここに書き込み終了時の処理はかかないで
    }); 
});