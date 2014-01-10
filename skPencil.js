var Pencil = function (opts) {
    var defaults = {
        'canvasId' : "canvas",
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
            'canvasId': (opts.canvasId) || defaults.canvasId,
            "brushStyle": opts.brushStyle || defaults.brushStyle        
        }
    }
    
    this.canvas = document.getElementById( options.canvasId );
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

    this.path = null;
    this.mPt = "";
    this.lPts = [];

    this.boardStyle = {
        width: this.canvas.style.width,
        height: this.canvas.style.height
    };
    
    this.pencilStyle = {
        'fill': 'none',
        'stroke': 'black',
        'stroke-width': '4px'
    };
    
    this.svg.setAttribute("style", "width: " + this.canvas.style.width + "; height: " + this.canvas.style.height + ";");

}

var pencil = new Pencil();

var onMouseDown = function (ev) {
    pencil.path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    
    
    var pencilStyle_arr = new Array();    
    for( var key in pencil.pencilStyle){
        pencilStyle_arr.push ( key + ":" + pencil.pencilStyle[key] );
    }
    
    pencil.path.setAttribute("style", pencilStyle_arr.join(";") + ";" );

    pencil.lPts = [];                             
    pencil.mPt = "M" + ev.clientX + " " + ev.clientY;
                             

    console.log("onMouseDown: ", ev.clientX, ev.clientY);
    pencil.svg.appendChild(pencil.path);

}
var onMouseMove = function (ev) {
    if (pencil.path == null)
        return;
    pencil.lPts.push("L" + ev.clientX + " " + ev.clientY);
    console.log( "::::::::::" + pencil.mPt);
    pencil.path.setAttribute("d", pencil.mPt + " " + pencil.lPts.join(" ") );
    console.log("onMouseMove: ", ev.clientX, ev.clientY);
}
var onMouseUp = function (ev) {
    if (pencil.lPts.length === 0) {
        pencil.svg.removeChild(pencil.path);
    }
    pencil.path = null;
    pencil.mPt = "";
    pencil.lPts = [];

    console.log("onMouseUp: ", ev.clientX, ev.clientY);
}




document.onreadystatechange = function () {
    if (document.readyState == "complete") {
        initSKPencil();
    }
}


function initSKPencil() {
    console.log("Application init.");
    var canvas = document.getElementById('canvas');

    canvas.appendChild( pencil.svg);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mouseup', onMouseUp);
}
