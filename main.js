// main.js
// Noise Variables
var lw;
var luw;
var vectors;
var octaves;
var im;
var seed=21;
// Erosion Variables
var inertia;
var carry;
var deposition_rate;
var erosion_rate;
var erosion_radius;
var min_slope;
var iterations;
var evaporation_rate;

var debug=false;

function doAfterLoad(){
	canvas = document.getElementById("my_canvas");
	
	octaves=1;
	canvas.width = CANVAS_W;
	canvas.height = CANVAS_H;
	
	// Initial Noise Parameters
	document.getElementById("luw_slider").value = 20; // 
	document.getElementById("1octaves").checked = true;
	document.getElementById("lw_slider").value = 3; // 
	document.getElementById("seed_input").value = 21; // 
	// Initial Erosion Parameters
	document.getElementById("inertia_slider").value = 20; // 
	document.getElementById("carry_slider").checked = true;
	document.getElementById("deposition_slider").value = 3; // 
	document.getElementById("erosion_slider").value = 50; // 
	document.getElementById("radius_slider").value = 3; // 
	document.getElementById("slope_slider").value = 50; //
	document.getElementById("evaporation_slider").value = 50; //
	document.getElementById("iterations_slider").value = 50; //
	im = {};
	update_values("slider");
	
	return;
}

function update_values(input_type){
	
	if(input_type == "slider"){
		lw = document.getElementById("lw_slider").value;
		luw = document.getElementById("luw_slider").value;
		octaves = document.querySelector('input[name="octaves_radio"]:checked').value;
		
		inertia = document.getElementById("inertia_slider").value / 100;
		carry = document.getElementById("carry_slider").value;
		deposition_rate = document.getElementById("deposition_slider").value / 100;
		erosion_rate = document.getElementById("erosion_slider").value / 100;
		evaporation_rate = document.getElementById("evaporation_slider").value / 100; //
		erosion_radius = Math.floor(document.getElementById("radius_slider").value / 10);
		min_slope = document.getElementById("slope_slider").value / 100;
		iterations = document.getElementById("iterations_slider").value * 1000;
	}
	else if(input_type == "input"){
		lw = document.getElementById("lw_input").value;
		luw = document.getElementById("luw_input").value;
		
		inertia = document.getElementById("inertia_input").value;
		carry = document.getElementById("carry_input").value;
		deposition_rate = document.getElementById("deposition_input").value;
		erosion_rate = document.getElementById("erosion_input").value;
		evaporation_rate = document.getElementById("evaporation_input").value; //
		erosion_radius = document.getElementById("radius_input").value;
		min_slope = document.getElementById("slope_input").value;
		iterations = document.getElementById("iterations_input").value;
	}
	else{
		octaves = document.querySelector('input[name="octaves_radio"]:checked').value;
	}
	document.getElementById("lw_input").value = lw;
	document.getElementById("luw_input").value = luw;
	
	document.getElementById("inertia_input").value = inertia;
	document.getElementById("carry_input").value = carry;
	document.getElementById("deposition_input").value = deposition_rate;
	document.getElementById("evaporation_input").value = evaporation_rate;
	document.getElementById("erosion_input").value = erosion_rate;
	document.getElementById("radius_input").value = erosion_radius;
	document.getElementById("slope_input").value = min_slope;
	document.getElementById("iterations_input").value = iterations;
	
	document.getElementsByName("octaves_radio").value = octaves;
	document.getElementById("lw_slider").value = lw;
	document.getElementById("luw_slider").value = luw;
	document.getElementById("width").innerText = luw*lw;
	
	random_vectors();
	
	draw_all();
}

window.onload=doAfterLoad