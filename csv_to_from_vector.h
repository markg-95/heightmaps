#include <vector>
#include <string>
#include <fstream>
#include <iostream>
#include <sstream>
#include <math.h>
#include <stdio.h>
#include <chrono>
#include <thread>

using namespace std;
using namespace std::this_thread; // sleep_for, sleep_until
using namespace std::chrono; // nanoseconds, system_clock, seconds

bool debug = false;

vector<vector<float>> load_image_as_vector_from_csv_path(string path, int w, int h){
	printf("(w,h): ( %d , %d ).\n", w, h);
	cout << "Path: " << path << "\n";
	ifstream data_file (path);
	stringstream buffer;
	buffer << data_file.rdbuf();
	vector<vector<float>> image(w,vector<float>(h,0));
	string digit;
	int counter = 0;
	
	int row_count = 0;
	int col_count = 0;
	bool count_cols = true;
	// cout << image.size();
	// cout << image[0].size();
	for(char c: buffer.str()){
		
		if(c != ',' && c!='\n'){
			digit += c;
		}
		else{
			if(c=='\n'){
				digit = "";
				if(row_count < w-1){
					row_count++;	
					col_count=0;
					count_cols = false;
				}
				
			}
			if(c==','){
				float fdigit = stof(digit);
				image[row_count][col_count]=fdigit;
				// cout << fdigit << endl;
				if(col_count < h-1){
					col_count++;	
				}
				// printf("value: %f = %f ?, (r,c): (%d , %d )\n", fdigit, image[row_count][col_count], row_count, col_count);
				digit="";
			}
		}
	}
	// printf("Dimensions found were: %d %d ", row_count, col_count);
	return image;
	//w946lw11oct1seed12
}



vector<int> get_csv_dims(string path){
	cout << "GETTING DIMS\n";
	ifstream data_file (path);
	stringstream buffer;
	buffer << data_file.rdbuf();
	vector<int> dims(2);
	dims[0]=0;
	dims[1]=0;
	bool counting_cols = true;
	float excess_counter=0;
	for(char c: buffer.str()){
		if(c == ',' && counting_cols){
			dims[1]++;
		}
		else if(c=='\n'){
			counting_cols=false;
			dims[0]++;
		}
	}
	dims[1]++;
	return dims;
}


int save_vector_as_csv(vector<vector<float>> iv, string path){
	
	char use_default_path = '1';
	cout << "\nUse default path? (1/0): " + path << "\n";
	cin >> use_default_path;
	if(use_default_path=='1'){
		// use default
	}
	else{
		cout << "\nEnter path: ";
		cin >> path;
	}
	
	ofstream myfile (path);
	
	
	
	if(myfile.is_open()){
		for(int i = 0; i < iv.size(); i++){
			for(int j = 0; j < iv[0].size()-1; j++){
				myfile << iv[i][j] << ",";
			}
			myfile << '\n';
		}
	}
	myfile.close();
	return 0;
}

void debug_vector_to_console(vector<vector<float>> iv){
	int size1 = iv.size();
	int size2 = iv[0].size();
	
	printf("Size: (%d, %d). \nPress any key to continue... (", size1, size2);
	char dummy;
	cin >> dummy;
		for(int i = 0; i < size1; i++){
			for(int j = 0; j < size2; j++){
				cout << iv[i][j] << ","; 
			}	
			cout << "\n";
		}
	
	
	cout << ")";
}
