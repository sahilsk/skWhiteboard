var 
	Primus = require("primus"),
	Emitter = require("primus-emitter"),
	http = require("http"),
	fs = require("fs");
	
var 
	server = http.createServer(function(req, res){
		
			switch(req.url){
				case("/bundle.js"):
					fs.readFile("./bundle.js",  function(err, data){
							console.log("done supplying bundle.js ");
							res.end(data);
					});
					break;
				case("/index.html"):
					fs.readFile('./index.html', function (err, data) {
					  res.end(data);
					});
					break;
				
				default:
					res.end("welcome page");
			}
			
			fs.writeFile("./req.html", (req),  function(){
				console.log("done writing ", req.url);
			});
							console.log("done writing ", req.url);


	
			}),
	primus = new Primus(server, {
					transformer: 'sockjs',
					parser: 'JSON', 
					pathname: "/primus"
			});
	primus.use("emitter", Emitter);		
	server.listen( process.env.PORT || 3000, function(){
		console.log("Sever listening on port %d", process.env.PORT || 3000);
	});
	
	
	primus.on("connection", function(spark){
		console.log("client connected: %s", spark.id);
		spark.send("charlie", "Hello from server :D ");
		spark.on("started", function(data){
			console.log("%s: Started drawing",  spark.id);
		});
		spark.on("path", function(path){
			console.log("new path traced: %s", path);
			primus.send("cPath", path);
		});
		
	}).on("disconnection", function(spark){
		console.log("client dis-connected: %s",  spark.id);
	});
	
	