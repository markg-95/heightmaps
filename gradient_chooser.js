







function reset_image(){
	im = {};
	draw_all();
	return;
}

function randint(seed, low, high) {
	// mulberry32
	//https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript;
    let dif = high-low;
      var t = seed += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return Math.floor((((t ^ t >>> 14) >>> 0) / 4294967296)*dif)+low;
    
}

function do_randomize(){
	random_vectors();
	perlin_driver();
	draw_all();
}

function random_vectors(){
	// console.log("Generating", lw*lw, " vectors");
	let u = 1/Math.sqrt(2);
	let PSR = {
		0:
			{
				'dx': u, 'dy': u
			},
		1:
			{
				'dx': u, 'dy': -u
			},
		2:
			{
				'dx': -u, 'dy': u
			},
		3:
			{
				'dx': -u, 'dy': -u
			}
		};
	vectors = {};
	let indices = {};
	let vector_str = "";
	vector_str+=`*${luw},${lw}*\n`;
	let c=0;
	let first_row = {};
	let first_col = {};
	let frc=0;
	let fcc=0;
	let n=parseInt(lw)+1;
	for(let j=0; j<n; j++){
		for(let i=0; i<n; i++){
			
			let dx = (Math.random()-.5)*2;
			let dy = (Math.random()-.5)*2;
			//let vec = PSR[randint(seed, 0,3)];
			//let dx = vec['dx'];
			//let dy = vec['dy'];
			let norm = Math.sqrt(Math.pow(dx,2)+Math.pow(dy,2));
			dx/=norm;
			dy/=norm;
			vectors[c] = {'x': i, 'y': j, 'dx': dx, 'dy': dy};	
			// Necessary for octaves / tiling.
			if(i==n-1){
				// console.log(c,c-lw);
				vectors[c]['dx'] = vectors[c-lw]['dx'];
				vectors[c]['dy'] = vectors[c-lw]['dy'];
				frc--;
			}
			if(j==n-1){
				// console.log(c, c-((parseInt(lw)+1)*(lw)));
				// vectors[c] = vectors[c-Math.pow(lw,2)];
				vectors[c]['dx']=vectors[c-((parseInt(lw)+1)*(lw))]['dx'];
				vectors[c]['dy']=vectors[c-((parseInt(lw)+1)*(lw))]['dy'];
				fcc--;
			}	
			
			
			// vector_str += `[${dx},${dy}],`;
			c++;
			seed++;
		}
		vector_str += '\n';
	}
	// console.log(vectors);
	// tiling
	let I=lw;
	let J=lw;
	
	// document.getElementById("io_gradients").value=vector_str;
	// console.log("Generated ",c, "vectors");
	return;
}

function field_manipulate(){
	let center_x = (lw)/2;
	let center_y = (lw)/2;
	
	let vector_str = "";
	
	vector_str+=`*${luw},${lw}*\n`;
	
	for(let c in vectors){
		let new_dx = center_x-vectors[c]['x'];
		let new_dy = center_y-vectors[c]['y'];
		let norm = Math.sqrt(Math.pow(new_dx,2)+Math.pow(new_dy,2));
		new_dx/=norm;
		new_dy/=norm;
		vectors[c]['dx']= new_dx;
		vectors[c]['dy']= new_dy;
		vector_str += `[${new_dx},${new_dy}]`;
		if(c%(parseInt(lw)+1)==0 & c > 0){
			vector_str += "\n";
		}
	}
	document.getElementById("io_gradients").value=vector_str;
	draw_all();
	return;
}







function draw_vectors(canvas, ctx){
	
	
	ctx.lineWidth = 2.5;
	ctx.strokeStyle = 'blue';
	for(let c in vectors){
		vec = vectors[c];
		let xi = (vec['x']*luw*draw_scale+canvas_padding);
		let yi = (vec['y']*luw*draw_scale+canvas_padding);
		let xf = ((vec['x']+vec['dx'])*luw*draw_scale+canvas_padding);
		let yf = ((vec['y']+vec['dy'])*luw*draw_scale+canvas_padding);
		
		ctx.beginPath();
		ctx.moveTo(xi,yi);
		ctx.strokeStyle = `rgb(125,75,245)`;
		ctx.lineTo((vec['x']+vec['dx'])*luw*draw_scale+canvas_padding,(vec['y']+vec['dy'])*luw*draw_scale+canvas_padding);
		ctx.moveTo(xf,yf);
		ctx.arc(xf,yf,(1/10)*luw*draw_scale,0,2*Math.PI, true);
		// ctx.fillStyle=`rgb(125,75,245)`;
		ctx.fill();
		ctx.stroke();
		
	}
}

function set_lw( w){
	lw = w;
	draw_all();
}

