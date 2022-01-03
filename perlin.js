// perlin.js

function norm(x,y){
	return Math.sqrt(Math.pow(x,2)+Math.pow(y,2));
}

function get_local_gradients(gradients, corners){
	let local_gradients = {};
	let counter = 0;
	for(gradient in gradients){
		for(corner in corners){
			if(gradients[gradient]['x']==corners[corner]['cx'] && gradients[gradient]['y']==corners[corner]['cy']){
				local_gradients[counter]={};
				local_gradients[counter]['x']=gradients[gradient]['x'];
				local_gradients[counter]['y']=gradients[gradient]['y'];
				local_gradients[counter]['dx']=gradients[gradient]['dx'];
				local_gradients[counter]['dy']=gradients[gradient]['dy'];
				// console.log(local_gradients[counter]);
				counter++;
				break;
			}
			
		}
		if(counter>3){
			break;
		}
	}
	return local_gradients;
}

function minmax(im){
	let cmax = 0;
	let cmin = 0;
	for(let v in im){
		if(im[v]['value']>cmax){
			cmax=im[v]['value'];
		}
		if(im[v]['value']<cmin){
			cmin=im[v]['value'];
		}
	}
	return [cmax,cmin];
	
}

function Perlin(gradients, r, c, w, luw, lw){
	// console.log("called perlin");
	r = r % w;
	c = c % w;
	let cell_x = parseInt(Math.floor(c/luw));
	let cell_y = parseInt(Math.floor(r/luw));
	// ... get coordinates of all four corners in the order: TOP LEFT, TOP RIGHT, BOT LEFT, BOT RIGHT...
	let cell_corners = {
		0: {'cx':cell_x,'cy':cell_y},
		1: {'cx':cell_x+1,'cy':cell_y},
		2: {'cx':cell_x,'cy':cell_y+1},
		3: {'cx':cell_x+1,'cy':cell_y+1}
		};
	let local_gradients=get_local_gradients(gradients, cell_corners);
	// ... get those coordinates in pixels.
	let cell_corners_pixels = {};
	
	let offsets = {};
	
	let dots = {};
	let frac_x;
	let frac_y;
	let max_offset=0;
	let max_gradient=0;
	let this_norm=0;
	
	for(let i=0;i<4;i++){
		cell_corners_pixels[i] = {};
		cell_corners_pixels[i]['x']=cell_corners[i]['cx']*luw;
		cell_corners_pixels[i]['y']=cell_corners[i]['cy']*luw;
		
		// get offsets from pixel to corner, divided by luw to get a value in interval [0,1].
		offsets[i]={};
		offsets[i]['dx']=(c-cell_corners_pixels[i]['x'])/luw;
		offsets[i]['dy']=(r-cell_corners_pixels[i]['y'])/luw;
		
		this_norm = norm(offsets[i]['dx'],offsets[i]['dy']);
		
		
		
		// get dot products of offset, to gradient for each.
		
		dots[i]=(local_gradients[i]['dx']*offsets[i]['dx'])+(local_gradients[i]['dy']*offsets[i]['dy']);
	}
	
	frac_x = offsets[0]['dx'];
	frac_y = offsets[0]['dy'];
	
	frac_x = fade(frac_x);
	frac_y = fade(frac_y);
	
	let l1 = lerp(dots[0],dots[1],frac_x);
	let l2 = lerp(dots[2],dots[3],frac_x);
	
	let value = lerp(l1,l2,frac_y);
	// console.log('offsets...',offsets,'ccp...',cell_corners_pixels,'dots...',dots,'localg...',local_gradients,'fracx...',frac_x,'fracy...', frac_x, 'l1',l1, 'l2', l2,value);
	
	// console.log(cell_corners, local_gradients, dots);
	// await sleep(2000);
	return value
}
function perlin_driver(){
	im = {};
	// console.log('octaves',octaves);
	let w = lw*luw;
	let counter = 0;
	// console.log(lw, luw, window.octaves, w);
	for(let r=0; r<w; r++){
		for(let c=0; c<w; c++){
			let value = 0;
			// Get Perlin value at (r,c).
			let amplitude = 1;
			let frequency = 1;
			let weight = 1/octaves;
			for(let o=0;o<octaves;o++){
				// console.log("calling perlin");
				value += (Perlin(vectors, r*frequency, c*frequency, w, luw, lw))*amplitude;  
				amplitude*=.5;
				frequency*=2;
			}
			value+=1;
			value/=2;
			im[counter]={};
			im[counter]['x']=c;
			im[counter]['y']=r;
			im[counter]['value']=value;
			counter++;
		}		
	}
	
	console.log("Perlin is done");
	if(!should_draw_im){
		show_hide("Image");
	}
	draw_all();
}
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
function fade(t){
	return parseFloat(6*Math.pow(t,5)-15*Math.pow(t,4)+10*Math.pow(t,3));
}
function lerp(y1, y2, x){
	return parseFloat(y1)+parseFloat(y2-y1)*x;
}