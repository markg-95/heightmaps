#include <vector>
#include <iostream>
#include <math.h>
#include <stdlib.h>
#include <bits/stdc++.h>
#include <fstream>
#include <chrono>
#include <thread>
#include "csv_to_from_vector.h"

using namespace std;
using namespace std::this_thread; // sleep_for, sleep_until
using namespace std::chrono; // nanoseconds, system_clock, seconds

vector<vector<float>> csv_to_vector(){
	vector<vector<float>> r;
	return r;
}

void vector_to_csv(vector<vector<float>> v, string path){
	// The vector is converted to csv and saved at path.
	
}

vector<int> get_image_dimensions(ifstream data_file){
	vector<int> dims(2);
	int w;
	int h;
	bool count_width=true;
	string line;
	if(data_file.is_open()){
		while (getline (data_file, line)){
				for(char c: line){
					if(c==','){
						if(count_width){
							w++;
						}
					}
					else if(c=='\\'){
						h++;
						count_width=false;
					}
				}
		}	
	}
	
		dims[0]=w;
		dims[0]=h;
		return dims;
}



int main(){
	vector<vector<float>> vtest = load_image_as_vector_from_csv_path("w946lw2oct2seed1",960,960);
	cout << "Found vector. Size: " << vtest.size();
	for(vector<float> row: vtest){
		// cout << "Found row.\n";
		for(float element: row){
			cout << element << ",";
		}
		cout << "\n";
	}
	return 0;
}