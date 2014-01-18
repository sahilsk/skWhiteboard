var util = require("util");
var events = require("events");


var Pencil = function (opts) {
	events.EventEmitter.call(this);
    var defaults = {
        'whiteboardId' : "whiteboard",
        'brushStyle': {
            fill: 'none',
            stroke: 'black',
            "stroke-width": '1px'
        }        
    }    

    var options ={};
    if( typeof opts ==  "undefined" ){
        options = defaults;
    }else{
        options = {
            "brushStyle": opts.brushStyle || defaults.brushStyle        
        }
    }	
    this.whiteboard = null;//document.getElementById( options.whiteboardId );
    this.svg = null;
    this.path = null;
    this.mPt = "";
    this.lPts = [];
  
    this.brushStyle = {
        'fill': 'none',
        'stroke': 'black',
        'stroke-width': '4px'
    };
}
module.exports = Pencil;
util.inherits(Pencil, events.EventEmitter);

Pencil.prototype.setWhiteboard = function( element){
	this.whiteboard =  document.getElementById(element);
	if(this.whiteboard == null){
		console.log("Whiteboard not found: ", element);
		alert("Error: whiteboard not found");
		return;
	}
	this.svg = 	document.createElementNS("http://www.w3.org/2000/svg", "svg");
  //  this.svg.setAttribute("style", "width: " + this.whiteboard.style.width + "; height: " + this.whiteboard.style.height + ";");
    this.whiteboard.appendChild( this.svg);
	console.log("whiteboard initialized successfully");
}

Pencil.prototype.draw = function(){
	if( !this.whiteboard ) return;
	console.log(this);
	var ctxt_pencil = this;

	var onMouseDown = function (ev) {
		ctxt_pencil.path = document.createElementNS("http://www.w3.org/2000/svg", "path");
			
		var brushStyle_arr = new Array();    
		for( var key in ctxt_pencil.brushStyle){
			brushStyle_arr.push ( key + ":" + ctxt_pencil.brushStyle[key] );
		}    
		ctxt_pencil.path.setAttribute("style", brushStyle_arr.join(";") + ";" );
		ctxt_pencil.lPts = [];                             
		ctxt_pencil.mPt = "M " + ev.offsetX + "," + ev.offsetY;                         
		console.log("onMouseDown: ", ev.offsetX, ev.offsetY);
		ctxt_pencil.svg.appendChild(ctxt_pencil.path);
		
		ctxt_pencil.emit("started", ctxt_pencil.mPt);
		
	}
	var onMouseMove = function (ev) {
		if (ctxt_pencil.path == null)
			return;
		ctxt_pencil.lPts.push("L " + ev.offsetX + "," + ev.offsetY);
		console.log( "::::::::::" + ctxt_pencil.mPt);
		ctxt_pencil.path.setAttribute("d", ctxt_pencil.mPt + " " + ctxt_pencil.lPts.join(" ") );
		console.log("onMouseMove: ", ev.offsetX, ev.offsetY);
	}
	var onMouseUp = function (ev) {
		if( !ctxt_pencil.path) return ;
		if (ctxt_pencil.lPts.length === 0) {
			ctxt_pencil.svg.removeChild(ctxt_pencil.path);
		}else{
			ctxt_pencil.emit("path", { mPt : ctxt_pencil.mPt, lPts: ctxt_pencil.lPts, brushStyle : ctxt_pencil.brushStyle} );
		}
		ctxt_pencil.emit("stopped", ctxt_pencil.lPts[ctxt_pencil.lPts.length - 1]);
		ctxt_pencil.path = null;
		ctxt_pencil.mPt = "";
		ctxt_pencil.lPts = [];
		console.log("onMouseUp: ", ev.offsetX, ev.offsetY);
		
	}	
    window.addEventListener('mousemove', onMouseMove);
    this.whiteboard.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);	
	
    console.log("skPencil is ready to go.");
}

Pencil.prototype.addPath = function(path){
	var pathNode = document.createElementNS("http://www.w3.org/2000/svg", "path");
	var brushStyle_arr = new Array(); 	
	for( var key in path.brushStyle){
		brushStyle_arr.push ( key + ":" + path.brushStyle[key] );
	}    
	pathNode.setAttribute("style", brushStyle_arr.join(";") + ";" );  
	pathNode.setAttribute("d", path.mPt + " " + path.lPts.join(" ") );
	
	this.svg.appendChild(pathNode);
}


