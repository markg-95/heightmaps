// draw.js
var draw_scale=1;
var CANVAS_W = 500;
var CANVAS_H = 500;
var canvas_padding = 50;

var should_draw_vectors = true;
var should_draw_grid = true;
var should_draw_im = false;
var should_draw_final = false;

function show_hide(arg){
	let elt = document.getElementById("show_hide_"+arg);
	if(arg=="Grid"){
		should_draw_grid = !should_draw_grid;
		if(should_draw_grid){
			elt.innerHTML = 'Hide '+arg;
		}
		else{
			elt.innerHTML = 'Show '+arg;
		}
	}
	if(arg=="Vectors"){
		should_draw_vectors = !should_draw_vectors;
		if(should_draw_vectors){
			elt.innerHTML = 'Hide '+arg;
		}
		else{
			elt.innerHTML = 'Show '+arg;
		}
	}
	if(arg=="Image"){
		should_draw_im = !should_draw_im;
		if(should_draw_im){
			elt.innerHTML = 'Hide '+arg;
		}
		else{
			elt.innerHTML = 'Show '+arg;
		}
	}
	if(arg=="Final"){
		should_draw_final = !should_draw_final;
		if(should_draw_final){
			elt.innerHTML = 'Hide '+arg;
		}
		else{
			elt.innerHTML = 'Show '+arg;
		}
	}
	draw_all();
}

function set_padding(){
	canvas_padding = document.getElementById("padding_slider").value;
	resize_canvas();
	draw_all();
}


function resize_canvas(){
	draw_scale = (CANVAS_W-2*canvas_padding)/(lw*luw);
	// canvas.width = 2*canvas_padding+lw*luw;
	// canvas.height = 2*canvas_padding+lw*luw;
	return;
}

function draw_all(){
	resize_canvas();
	let canvas = document.getElementById("my_canvas");
	let ctx = canvas.getContext("2d");
	ctx.clearRect(0,0,CANVAS_W,CANVAS_H);
	
	let canvasF = document.getElementById("final_canvas");
	let ctxF = canvasF.getContext("2d");
	
	if(should_draw_im){
		draw_im(canvas,ctx);
	}
	if(should_draw_grid){
		draw_grid(canvas,ctx);	
	}
	if(should_draw_vectors){
		draw_vectors(canvas,ctx);	
	}
	if(should_draw_final){
		draw_final(canvasF,ctxF);
	}
	else{
		ctxF.clearRect(0,0,canvasF.width,canvasF.height);
	}
	
}

function draw_final(canvas, ctx){
	
	canvas.width = lw*luw;
	canvas.height = lw*luw;
	
	ctx.clearRect(0,0,canvas.width,canvas.height);
	
	for(i in im){
		let v = im[i]['value'];
		v*=255;
		ctx.fillStyle = `rgb(${v},${v},${v})`;
		// console.log(ctx.fillStyle);
		ctx.fillRect(canvas_padding+im[i]['x']*1,canvas_padding+im[i]['y']*1,1,1);
	}
}

function draw_im(canvas, ctx){
	
	for(i in im){
		let v = im[i]['value'];
		v*=255;
		ctx.fillStyle = `rgb(${v},${v},${v})`;
		// console.log(ctx.fillStyle);
		ctx.fillRect(canvas_padding+im[i]['x']*draw_scale,canvas_padding+im[i]['y']*draw_scale,draw_scale,draw_scale);
	}
	return;
}

function draw_grid(canvas, ctx){
	
	
	
	
	
	if(lw > 1){
		// ctx.fillStyle = "black";
		for(let i = 0; i < lw; i++){
			for(let j = 0; j < lw; j++){
				ctx.strokeRect((canvas_padding+i*luw*draw_scale),(canvas_padding+j*luw*draw_scale),luw*draw_scale,luw*draw_scale);
				// console.log('rect at .' + i + ", " + j);
			}	
		}
	}
	
	
	return; 
}