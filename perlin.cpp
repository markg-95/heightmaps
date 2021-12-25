// Perlin implentation in c++;
#include <vector>
#include <iostream>
#include <math.h>
#include <stdlib.h>
#include <bits/stdc++.h>
#include <fstream>
#include <chrono>
#include <thread>
#include <string>
#include "my_math.h"
#include "csv_to_from_vector.h"

using namespace std;
using namespace std::this_thread; // sleep_for, sleep_until
using namespace std::chrono; // nanoseconds, system_clock, seconds


/*
Additional functions below:
- lerp(y1,y2,t)
- fade(t)
-randint(low,hi)
-get_pseudo_random_gradients(n,seed)
*/

float Perlin(vector<vector<vector<float>>> gradients, int r, int c, int w, int luw, int lw){
	// ... get enclosing cell's top left corner coordinates.
			// cout << "(c,r,w,luw,lw) : ("<< c << "," << r << "," << w << "," << luw << "," << lw << ")\n";
			r = r % w;
			c = c % w;
			int cell_x = (int)floor(c/luw);
			int cell_y = (int)floor(r/luw);
			// ... get coordinates of all four corners in the order: TOP LEFT, TOP RIGHT, BOT LEFT, BOT RIGHT...
			int cell_corners[4][2] = {{cell_x,cell_y},{cell_x+1,cell_y},{cell_x, cell_y+1},{cell_x+1,cell_y+1}};
			// ... get those coordinates in pixels.
			int cell_corners_pixels[4][2];
			float offsets[4][2];
			float local_gradients[4][2];
			float dots[4];
			float frac_x;
			float frac_y;
			float max_offset=0;
			float max_gradient=0;
			float this_norm=0;
			
			// cout << "\tCell: " << cell_x << ", " << cell_y << "\n";
			
			for(int i=0;i<4;i++){
				cell_corners_pixels[i][0] = cell_corners[i][0]*luw;
				cell_corners_pixels[i][1] = cell_corners[i][1]*luw;
				
				
				
				// get offsets from pixel to corner, divided by luw to get a value in interval [0,1].
				offsets[i][0]=(float)(c-cell_corners_pixels[i][0])/luw;
				offsets[i][1]=(float)(r-cell_corners_pixels[i][1])/luw;
				
				this_norm = norm(offsets[i]);
				
				// cout << "Offset norm: " << this_norm;
				
				
				
				
				// cout << "\tComputed offset: " << i << "\n";
				
				// get local gradients
				local_gradients[i][0]=gradients[cell_corners[i][1]][cell_corners[i][0]][1];
				local_gradients[i][1]=gradients[cell_corners[i][1]][cell_corners[i][0]][0];
				
				this_norm = norm(local_gradients[i]);
				
				// cout << ", Gradient norm: " << this_norm << "\n";
				
				// sleep_until(system_clock::now()+seconds(.01));
				// sleep_for(nanoseconds(1000));
				
				
				
				// cout << "\tRetrieved gradient: " << i << "\n";
				
				// get dot products of offset, to gradient for each.
				dots[i]=(local_gradients[i][0]*offsets[i][0])+(local_gradients[i][1]*offsets[i][1]);
				
				
			}
			// get dx, dy for bilinear interpolation between 4 dot products.
			frac_x = offsets[0][0];
			frac_y = offsets[0][1];
			
			frac_x = fade(frac_x);
			frac_y = fade(frac_y);
			
			float l1 = lerp(dots[0],dots[1],frac_x);
			float l2 = lerp(dots[2],dots[3],frac_x);
			
			// Final interpolation yields a value from -1 to 1, so we shift to (0,1).
			return lerp(l1,l2,frac_y);
}

void debug_psuedo_random_gradients(vector<vector<vector<float>>> t){
	int rc = 0;
	int cc = 0;
	for(vector<vector<float>> Fs: t){
		for(vector<float> fs: Fs){
			cout << "(";
			for(float f: fs){
				cout << f;
				cout << ",";
			}
			cout << ")";
			if(rc==0){
				cc++;
			}
		}
		cout << "\n";
		rc++;
	}
	cout << "Rows: " << rc << ", Cols: " << cc << "\n";
}

vector<vector<vector<float>>> get_pseudo_random_gradients(int n, int seed){
		float u = 0.707106781; // 1/sqrt(2);
		float pool[4][2] = {{u,u},{u,-u},{-u,u},{-u,-u}};
		vector<vector<vector<float>>> r (n, vector<vector<float>>(n,vector<float>(2,0)));
		for(int i = 0; i < n; i++){
				for(int j = 0; j < n; j++){
				int rand_index = randint(0,3, seed);
				
				// below conditions make the map tileable / work as a fractal pattern.
				if(!(i==n-1 || j==n-1)){
					r[i][j][0] = pool[rand_index][0];
					r[i][j][1] = pool[rand_index][1];
				}
				else{
					if(i==n-1){
						r[i][j][0]=r[0][j][0];
						r[i][j][1]=r[0][j][1];
					}	
					if(j==n-1){
						r[i][j][0]=r[i][0][0];
						r[i][j][1]=r[i][0][1];
					}
				}
				seed++;
			}
		}
	return r;
}


float Perlin_Driver(int w=946, int seed=19, int octaves=4){
	/* default values:
	w = 946;
	*/
	
	// Determine width of integer lattice.
	vector<int> fs = factors(w);
	cout << "Factors: ";
	for(int f: fs){
		cout << f << ", ";
	}
	cout << "\nSelect a factor from the list above to determine the width of the integer lattice.\n";
	int lw; // lattice width
	cin >> lw;
	
	cout << "\nEnter number of octaves: ";
	cin >> octaves;
	
	cout << "\nEnter seed: ";
	cin >> seed;
	
	auto it = find(fs.begin(), fs.end(), lw);
	
	if(it == fs.end()){
		// Did not choose a factor from the given list.
		cout << "\nInvalid choice. Exiting program.";
		return 0;
	}
	
	cout << "Generating image...";
	
	int luw = (int)w/lw; // lattice unit width
	
	// Get (lw+1)x(lw+1) lattice populated with 2d gradient vectors.
	// note: There are lw squares in the lattice's rows, but lw+1 vertices which store the gradients.
	vector<vector<vector<float>>> gradients = get_pseudo_random_gradients(lw+1,seed);
	
	// cout << "\n Shape of gradients: " << gradients.size() << "\n";
	// sleep_until(system_clock::now()+seconds(1));
	// debug_psuedo_random_gradients(gradients);
	// sleep_until(system_clock::now()+seconds(2));
	
	
	vector<vector<float>> image (w, vector<float>(w,0));
	// For each pixel in image...
	float value;
	
	for(int r=0; r<w; r++){
		for(int c=0; c<w; c++){
			value = 0;
			// Get Perlin value at (r,c).
			float amplitude = 1;
			float frequency = 1;
			float weight = 1/octaves;
			for(int o=0;o<octaves;o++){
				value += (Perlin(gradients, r*frequency, c*frequency, w, luw, lw))*amplitude;  
				amplitude*=.5;
				frequency*=2;
			}
			value+=1;
			value/=2;
			
			
			image[r][c]=value;
		}	
		
	}
	string path = "w" + to_string(w) + "lw" + to_string(lw) + "oct" + to_string(octaves) + "seed" + to_string(seed) + ".txt";
	save_vector_as_csv(image, path);
	return 0;
}







int main(){
	int octaves;
	Perlin_Driver(946,11,1);
	
	
	return 0;
}