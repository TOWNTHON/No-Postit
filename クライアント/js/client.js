var socket = null;

function bootstrap() {
	// 図形描画
	var c = document.getElementById('mycanvas');
	var ctx = c.getContext('2d');
 	ctx.globalalpha = 0.3;
  	for(var i=0; i<1000; i++) {
    	ctx.beginPath();
    	var r = Math.floor(Math.random() * 256);
    	var g = Math.floor(Math.random() * 256);
    	var b = Math.floor(Math.random() * 256);
    	ctx.strokeStyle = 'rgb(' + r + ',' + g + ',' + b + ')';
    	ctx.moveTo(Math.random()*200, Math.random()*200);
    	ctx.lineTo(Math.random()*200, Math.random()*200);
    	ctx.stroke();
    }

// Socketを初期化
	socket = new WebSocket('ws://localhost:8082');
	socket.binaryType = 'arraybuffer';
	socket.onopen = function() {
		send(ctx);
	}
	socket.onmessage = handleRecieve;
};

function send(ctx) {
	// 生データをそのまま送信
	var data = ctx.getImageData(0, 0, 200, 200).data;
	var byteArray = new Unit8Array(data);
	socket.send(byteArray.buffer);
}

function handleRecieve(message) {
	// 受信した生データをcanvasに
	var c = resultCanvas = document.getElementById('result');
	var ctx = c.getContext('2d');
	var imageData = ctx.createImageData(200, 200);
	var pixels = imageData.data;

	var buffer = new Unit8Array(message.data);
	for (var i=0; i<pixels.length; i++) {
		pixels[i] = buffer[i];
	}
	ctx.putImageData(imageData, 0, 0);
}