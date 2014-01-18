var 
	Pencil = require("./skPencil"),
	randomColor = require('random-color')
	;

var onConnection = function(primus){
	primus.on("charlie", function(data){
		console.log(data);
	});
}

document.onreadystatechange = function () {	
	var url = "/"
	var primus = new  Primus(url, {
					reconnect: {
						maxDelay: Infinity // Number: The max delay for a reconnect retry.
						, minDelay: 500 // Number: The minimum delay before we reconnect.
						, retries: 10 // Number: How many times should we attempt to reconnect.
					}
				});
	
	primus.on("open", function(){  onConnection(primus)} );
	
	if (document.readyState == "complete") {
        initSKPencil(primus);
    }
}

function initSKPencil(primus) {
	window.Pencil = Pencil;
	var pencil = new Pencil();
	pencil.setWhiteboard( "canvas" );
	pencil.draw();
	pencil.brushStyle = {
        'fill': 'none',
        'stroke': 'black',
        'stroke-width': '1px'
    };
	
	pencil.on("path", function(path){
		console.log("pixel emitted" );
		primus.send("path", path);
	});
	pencil.on("started", function(pos){
		console.log("client started at ", pos );
		primus.send("started", pos);
	});
	pencil.on("stopped", function(pos){
		console.log("client stopped at ", pos );
		pencil.brushStyle.stroke = randomColor();	
		primus.send("stopped", pos);
	});	
	primus.on("cPath", function(cPath){
		pencil.addPath(cPath);
		console.log("cPath : '%j'", cPath);
	});
	
	window.pencil = pencil;

}
