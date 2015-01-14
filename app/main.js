function getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function redraw(ctx, imageData, w, h, step, offsetX, offsetY){
    for(x = 0; x <= w; x++){
        ctx.beginPath();
        if (x % 10 == 0 || x == w){
            ctx.lineWidth = 1;
        }else{
            ctx.lineWidth = 0.5;
        }
        ctx.moveTo(x*step + offsetX, 0 + offsetY);
        ctx.lineTo(x*step + offsetX, h*step + offsetY);
        ctx.stroke();
        ctx.closePath();
    }
    for(y = 0; y <= h; y++){
        ctx.beginPath();
        if(y % 10 == 0 || y == h){
            ctx.lineWidth = 1;
        }else{
            ctx.lineWidth = 0.5;
        }
        ctx.moveTo(0+ offsetX, y*step + offsetY);
        ctx.lineTo(w*step+ offsetX, y*step + offsetY);
        ctx.stroke();
        ctx.closePath()
    }
        
    for (x = 0; x < w; x++){
        for(y = 0; y < h; y++){
            var index = 4 * (w*y + x);
            var red = imageData.data[index];
            var green = imageData.data[index+1];
            var blue = imageData.data[index+2];
            ctx.fillStyle = nearestColor(rgbToHex(red, green, blue)).value;
            ctx.fillRect(x*10 + 1 + offsetX,y*10 + 1 + offsetY,8,8);
        }
    }
}

var colors = {
    white: '#fff',
    red: '#f00',
    green: '#0f0',
    yellow: '#ff0',
    blue: '#00f',
    black: '#000',
    grey: '#ddd',
    purple: '#F32C94',
    darkPurple: '#8A2BB7',
    lightBlue: '#00B3D3'
};

var nearestColor = require('nearest-color').from(colors);

var canvas = null;
var framabuffer = null;
var ctx = null;
var framebufferCtx = null;
var imageData = null;
var w = 0;
var h = 0;
var startX = 0;
var startY = 0;
var drag = false;


window.onload = function(event) {
    
    canvas = document.getElementById('myCanvas');
    framebuffer = document.createElement('canvas');
    ctx = canvas.getContext('2d');
    framebufferCtx = framebuffer.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.imageSmoothingEnabled = false;
    ctx.mozImageSmoothingEnabled = false;
    ctx.webkitImageSmoothingEnabled = false;
    ctx.imageSmoothingEnabled = false;
    ctx.scale(0.5,0.5)

    var imageObj = new Image();

    imageObj.onload = function() {
        var size = 0.4,

        /// cache scaled width and height
        w = imageObj.width * size,
        h = imageObj.height * size;


        window.w = w
        window.h = h
        /// draw original image to the scaled size

        imageData = framebufferCtx.createImageData(w, h);

        framebufferCtx.drawImage(imageObj, 0, 0, w, h);

        imageData = framebufferCtx.getImageData(0, 0, w, h);
        
        framebufferCtx.putImageData(imageData, 0, 0);

        /// then draw that scaled image thumb back to fill canvas
        /// As smoothing is off the result will be pixelated
        //ctx.drawImage(framebuffer, 0, 0, w, h, 100, 0, imageObj.width, imageObj.height);

        var step = 10;

        redraw(ctx, imageData, w, h, step, 0, 0);
    }
 //   imageObj.crossOrigin = 'anonymous';
 //   imageObj.src = 'wario.PNG';
    imageObj.src = 'http://img4.wikia.nocookie.net/__cb20130419233522/epicrapbattlesofhistory/images/8/81/Wario.png'
}

window.onmousedown = function(event) {
    startX = event.x;
    startY = event.y;
    drag = true;
}

window.onmouseup = function(event) {
    drag = false;
}

window.onmousemove = function(event) {
    if (!drag){return}
    //ctx.clearRect(0,0,w*10,h*10)
    //redraw(ctx, imageData, w, h, 10, event.x - startX, event.y - startY);
    canvas.style.transform = 'translate3d('+ (event.x - startX) + 'px, ' + (event.y-startY) + 'px, 0)'
}

