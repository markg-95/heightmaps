// hydraulic erosion implementaion in c++
#include <vector>
#include <iostream>
#include <math.h>
#include <stdlib.h>
#include <bits/stdc++.h>
#include <fstream>
#include <chrono>
#include <thread>
#include "csv_to_from_vector.h"
#include "my_math.h"
#include <stdio.h>

using namespace std;
using namespace std::this_thread; // sleep_for, sleep_until
using namespace std::chrono; // nanoseconds, system_clock, seconds



vector<vector<float>> erode (vector<vector<float>> heightmapsrc, float weights[], bool debug, float  inertia=.1,float carry_capacity=1,float deposition_speed=1,float erosion_speed=.9,float evaporation_speed=.001, float erosion_radius=3, float min_slope=.1, float max_lifetime=50, float gravity=1){
	vector<vector<float>> heightmap = heightmapsrc;
	
	int map_h = heightmap.size();
	int map_w = heightmap[0].size();
	
	// cout << map_h << "," <<map_w;
	
	float speed = 1;
	float water = 5;
	float sediment = .2;
	int n = 2*erosion_radius-1;
	
	float randx = (float) randint(0,map_w) + rand()/RAND_MAX;
	float randy = (float) randint(0,map_h) + rand()/RAND_MAX;
	
	float position[2] = {randx, randy};
	
	
	float random_dir[2] = {(float)rand()/RAND_MAX, (float)rand()/RAND_MAX};
	float norm1 = norm(random_dir);
	random_dir[0]/=norm1;
	random_dir[1]/=norm1;
	
	for(int i = 0; i < max_lifetime; i++){
		int cell_x = floor(position[0]);
		int cell_y = floor(position[1]);
		
		if(debug){
			cout << "Here: cx,cy = " << cell_x << "," << cell_y << "\n";	
		}
		
		
		// if droplet moves out of bounds, exit;
		if(cell_x >= map_w-1){
			break;
		}
		if(cell_y >= map_h-1){
			break;
		}
		if(cell_x < 0){
			break;
		}
		if(cell_y < 0){
			break;
		}
		
		int cells[4][2] = {{cell_x,cell_y},{cell_x+1,cell_y},{cell_x,cell_y+1},{cell_x+1,cell_y+1}};
		float heights[4];
		for(int i2=0;i2<4;i2++){
			heights[i2]=heightmap[cells[i2][0]][cells[i2][1]];	
		}
		float u = position[0]-cell_x;
		float v = position[1]-cell_y;
		// bilinear interpolation to get gradient.
		float grad[2] = {
			(heights[1]-heights[0])*(1-v)+(heights[3]-heights[2])*v,
			(heights[2]-heights[0])*(1-u)+(heights[3]-heights[1])*u
		};
		// update direction
		float new_dir[2];
		new_dir[0] = random_dir[0] * inertia - grad[0]*(1-inertia);
		new_dir[1] = random_dir[1] * inertia - grad[1]*(1-inertia);
		norm1 = norm(new_dir);
		new_dir[0]/=norm1;
		new_dir[1]/=norm1;
		if(norm(new_dir) < .01){
			new_dir[0]=(float)rand()/RAND_MAX;
			new_dir[1]=(float)rand()/RAND_MAX;
			norm1 = norm(new_dir);
			new_dir[0] /= norm1;
			new_dir[1] /= norm1;
		}
		
		float new_pos[2];
		new_pos[0] = position[0] + new_dir[0];
		new_pos[1] = position[1] + new_dir[1];
		
		float new_cell_x = floor(new_pos[0]);
		float new_cell_y = floor(new_pos[1]);
		
		if (new_cell_x > map_w - 1){
			break;
		}
		if (new_cell_x < 0){
			break;
		}
        if (new_cell_y > map_h - 1){
			break;
		}   
		if (new_cell_y < 0){
			break;
		}
		
		if(debug){
			// cout << "(posx,posy,cellx,celly,u,v,dirx,diry)" << new_pos[0]<<","<<new_pos[1]<<","<<new_cell_x<<","<<new_cell_y<< u<<","<<v<<","<<new_dir[0]<<","<<new_dir[1]<<"\n";
			printf("Heights: %f,%f,%f,%f. \n",heights[0],heights[1],heights[2],heights[3]);
			printf("pos=%f,%f. cell=%d,%d. u,v = %f,%f. dir=%f,%f. grad=%f,%f.\n",new_pos[0],new_pos[1],cell_x,cell_y,u,v,new_dir[0],new_dir[1],grad[0], grad[1]);
		}
        
		float new_height = heightmap[new_cell_x][new_cell_y];
		
		float dh = heights[0] - new_height;
		// dh = -dh;
		int w_c = 0;
		if(dh >= 0){
			w_c=0;
			if(debug){
				cout << "Going up slope. dh: "<< dh << "\n";
			}
			for(int k=cell_x;k<cell_x+n;k++){
				for(int j=cell_y;j<cell_y+n;j++){
					int neighbor_x = k-(erosion_radius-1);
					int neighbor_y = j-(erosion_radius-1);
					if(neighbor_x >= 0 && neighbor_x <= map_w-1 && neighbor_y >= 0 && neighbor_y <= map_h-1){
						float ds = weights[w_c]*min(sediment,dh);
						heightmap[neighbor_x][neighbor_y]+=ds;
						sediment-=ds;
						w_c++;
					}
				}
			}
		}
		else{
			if(debug){
				cout << "Going down slope. "<< "\n";
			}
			float c = max(-dh,min_slope)*speed*water*carry_capacity;
			if(sediment >= c){
				if(debug){
					printf("Carrying too much sediment ( %f ). Depositing... \n", sediment);
				}
				w_c=0;
				float dif=0;
				for(int k=cell_x;k<cell_x+n;k++){
					for(int j=cell_y;j<cell_y+n;j++){
					int neighbor_x = k-(erosion_radius-1);
					int neighbor_y = j-(erosion_radius-1);
					if(neighbor_x >= 0 && neighbor_x <= map_w-1 && neighbor_y >= 0 && neighbor_y <= map_h-1){
						float ds = weights[w_c]*(sediment-c)*deposition_speed;
						heightmap[neighbor_x][neighbor_y]+=ds;
						sediment-=ds;
						dif+=ds;
						w_c++;
					}
				}
				}
				if(debug){
					printf("Deposited %f. Now carrying ( %f ).\n", dif, sediment);
				}
			}
			else{
				if(debug){
					printf("Picking up more sediment since %f < %f (carry-capacity).\n", sediment, c);
				}
				w_c=0;
				for(int k=cell_x;k<cell_x+n;k++){
					for(int j=cell_y;j<cell_y+n;j++){
					int neighbor_x = k-(erosion_radius-1);
					int neighbor_y = j-(erosion_radius-1);
					if(neighbor_x >= 0 && neighbor_x <= map_w-1 && neighbor_y >= 0 && neighbor_y <= map_h-1){
						float ds = weights[w_c]*min((c-sediment)*erosion_speed,-dh);
						heightmap[neighbor_x][neighbor_y]-=ds;
						sediment+=ds;
						w_c++;
					}
				}
				if(debug){
					printf("Now carrying ( %f ).\n", sediment);
				}
				}
			}
	}
	speed = sqrt(max((float)0,(float)pow(speed,2)-dh*gravity));
	
	water *= (1-evaporation_speed);
	
	position[0] = new_pos[0];
	position[1] = new_pos[1];
	if (debug){
		sleep_for(seconds(1));
	}
	
	}
	return heightmap;
}

int driver(bool debug){
	
	// load image as csv
	string src_path;
	
	cout << "Enter path to .txt file.\n";
	cin >> src_path;
	
	vector<vector<float>> image = load_image_as_vector_from_csv_path(src_path,946,946);
	
	// generate list of weights
	int erosion_radius = 3;
	int n = 2*erosion_radius-1;
	int const_distances[n*n];
	int counter = 0;
	float running_sum = 0;
	for(int i=0;i<n;i++){
		for(int j=0;j<n;j++){
			float new_value = sqrt(pow((i-(erosion_radius-1)),2)+pow(j-(erosion_radius-1),2));
			const_distances[counter]= new_value;
			running_sum+=new_value;
			counter++;
		}	
	}
	counter=0;
	float weights[n*n];
	for(int i=0;i<n;i++){
		for(int j=0;j<n;j++){
			weights[counter]=const_distances[counter]/running_sum;
			printf("Weight at %d , %d is %f.\n", i, j, weights[counter]);
			counter++;
		}	
	}
	
	int snowballs;
	cout << "Enter desired number of iterations (droplets of water to simulate). Try 35000-75000.\n";
	cin >> snowballs;
	
	for(int i = 0; i<snowballs; i++){
		image = erode(image,weights,debug);
	}
	
	string path = "h.txt";
	save_vector_as_csv(image, path);
	
	return 0;
}

int main(){
	bool debug;
	char d;
	cout << "debug? (1/0).\n";
	cin >> d;
	if(d=='0'){
		debug=false;
	}
	else{
		debug=true;
	}
	driver(debug);
	return 0;
}
