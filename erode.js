// erode.js
function erosion_driver(){
	
	// get params from UI
	
	
	let erosion_radius = 3;
	let n = 2*erosion_radius-1;
	let const_distances={};
	let counter = 0;
	let running_sum = 0;
	for(let i=0;i<n;i++){
		for(let j=0;j<n;j++){
			let new_value = Math.sqrt(Math.pow((i-(erosion_radius-1)),2)+Math.pow(j-(erosion_radius-1),2));
			const_distances[counter]= new_value;
			running_sum+=new_value;
			counter++;
		}	
	}
	counter=0;
	let weights = {};
	for(let i=0;i<n;i++){
		for(let j=0;j<n;j++){
			weights[counter]=const_distances[counter]/running_sum;
			
			counter++;
		}	
	}
	console.log(weights);
	let snowballs = iterations;
	for(let i = 0; i<snowballs; i++){
		im = erode(im,lw*luw,weights,inertia,carry,deposition_rate,erosion_rate, evaporation_rate, erosion_radius, min_slope, 9);
	}
	return;
}

function norm(x,y){
	// console.log("from erode...");
	return Math.sqrt(Math.pow(x,2)+Math.pow(y,2));
}

function erode(map, w, weights, inertia, carry_capacity, deposition_speed, erosion_speed, evaporation_speed, erosion_radius, min_slope, gravity){
	
	console.log(inertia, carry_capacity, deposition_speed, erosion_speed, evaporation_speed, erosion_radius,min_slope);
	
	let speed = 1;
	let water = 5;
	let sediment = .2;
	let n = 2*erosion_radius-1;
	
	let randx = Math.random()*w+Math.random();
	let randy = Math.random()*w+Math.random();
	
	let position = {'x': randx, 'y': randy};
	
	let random_dir = {'dx': Math.random(), 'dy': Math.random()};
	// 
	let norm1 = norm(random_dir['dx'],random_dir['dy']);
	// console.log(norm1); 
	random_dir['dx']/=norm1;
	random_dir['dy']/=norm1;
	console.log(random_dir);
	
	for(let i = 0; i < 30; i++){
		let cell_x = Math.floor(position['x']);
		let cell_y = Math.floor(position['y']);
		
		if(cell_x>=w-1 || cell_x<0 || cell_y>=w-1 || cell_y<0){
			break;
		}
		// console.log(cell_x);
		let cells = {
			0: [cell_x, cell_y], 
			1: [parseInt(parseInt(cell_x)+1), cell_y], 
			2: [cell_x, parseInt(cell_y)+1], 
			3: [parseInt(cell_x)+1, parseInt(cell_y)+1]
		};
		
		let heights = {};
		for(let j = 0; j < 4; j++){
			let c = parseInt(cells[j][1]*(parseInt(lw)))+parseInt(cells[j][0]);
			console.log(cells[i],cells[j],c);
			heights[j]=map[c]['value'];
			console.log(heights[j]);
		}
		console.log(position, cell_x, cell_y, heights);
		let u = position['x']-cell_x;
		let v = position['y']-cell_y;
		console.log(u,v, heights);
		let grad = {
			0: (heights[1]-heights[0])*(1-v)+(heights[3]-heights[2])*v,
			1: (heights[2]-heights[0])*(1-u)+(heights[3]-heights[1])*u
		};
		console.log(grad);
		let new_dir = {};
		new_dir[0] = random_dir['dx'] * inertia - grad[0]*(1-inertia);
		new_dir[1] = random_dir['dy'] * inertia - grad[1]*(1-inertia);
		
		console.log(random_dir, new_dir);
		
		norm1 = norm(new_dir[0], new_dir[1]);
		new_dir[0]/=norm1;
		new_dir[1]/=norm1;
		
		// omitting norm (86)
		
		let new_pos = {
			0: position['x']+new_dir[0],
			1: position['y']+new_dir[1]
		};
		
		let new_cell_x = Math.floor(new_pos[0]);
		let new_cell_y = Math.floor(new_pos[1]);
		
		if (new_cell_x > w - 1){
			break;
		}
		if (new_cell_x < 0){
			break;
		}
        if (new_cell_y > w - 1){
			break;
		}   
		if (new_cell_y < 0){
			break;
		}
		
		console.log("new_pos=", new_pos);
		
		let new_height = map[new_cell_y*(parseInt(lw))+new_cell_x]['value'];
		
		console.log("new_height=",new_height, " at...", new_cell_x*new_cell_y+new_cell_y);
		
		let dh = heights[0]-new_height;
		let w_c = 0;
		
		if(dh>0){
			console.log("Going up slope. dh=",dh);
			for(let k = cell_x; k < cell_x+n; k++){
				for(let j = cell_x; j < cell_x+n; j++){
					let neighbor_x=k-(erosion_radius-1);
					let neighbor_y=j-(erosion_radius-1);
					if(neighbor_x >= 0 && neighbor_x <= w-1 && neighbor_y >= 0 && neighbor_y <= w-1){
						let ds = weights[w_c]*Math.min(sediment, dh);
						console.log("weights: ",weights[w_c]);
						console.log("ds", ds);
						map[neighbor_x*neighbor_y+neighbor_y]+=ds;
						sediment-=ds;
						w_c++;
					}
				}
			}
		}
		else{
			console.log("Going down slope, dh=", dh);
			let c = Math.max(-dh,min_slope)*speed*water*carry_capacity;
			if(sediment >= c){
				console.log("Carrying too much sediment, sediment=", sediment);
				w_c=0;
				let dif=0;
				for(let k=cell_x;k<cell_x+n;k++){
					for(let j=cell_y;j<cell_y+n;j++){
						let neighbor_x = k-(erosion_radius-1);
						let neighbor_y = j-(erosion_radius-1);
						if(neighbor_x >= 0 && neighbor_x <= w-1 && neighbor_y >= 0 && neighbor_y <= w-1){
							let ds = weights[w_c]*(sediment-c)*deposition_speed;
							console.log("weights: ",weights[w_c]);
							console.log("ds", ds);
							map[neighbor_x*neighbor_y+neighbor_y]+=ds;
							sediment-=ds;
							dif+=ds;
							w_c++;
						}
					}
				}
			}	
			else{
				console.log("Picking up more sediment since sed < c:", sediment, c);
				w_c=0;
				for(let k=cell_x;k<cell_x+n;k++){
					for(let j=cell_y;j<cell_y+n;j++){
						let neighbor_x = k-(erosion_radius-1);
						let neighbor_y = j-(erosion_radius-1);
						if(neighbor_x >= 0 && neighbor_x <= w-1 && neighbor_y >= 0 && neighbor_y <= w-1){
							let ds = weights[w_c]*Math.min((c-sediment)*erosion_speed,-dh);
							console.log("weights: ",weights[w_c]);
							console.log("ds", ds);
							map[neighbor_x*neighbor_y+neighbor_y]-=ds;
							sediment+=ds;
							w_c++;
						}
					}
				}
		}
	}
	speed = Math.sqrt(Math.max(0,Math.pow(speed,2)-dh*gravity));
	
	water *= (1-evaporation_speed);
	
	position[0] = new_pos[0];
	position[1] = new_pos[1];
	
	
	return map;
}
}