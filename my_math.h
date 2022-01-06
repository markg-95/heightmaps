#include <math.h>
#include <vector>
using namespace std;
int randint(int nMin, int nMax, int seed)
{
	// src: https://stackoverflow.com/questions/5008804/generating-random-integer-from-a-range
	srand(seed);
    return nMin + (int)((double)rand() / ((double)RAND_MAX+1) * (nMax-nMin+1));
}
int randint(int nMin, int nMax)
{
	// src: https://stackoverflow.com/questions/5008804/generating-random-integer-from-a-range
    return nMin + (int)((double)rand() / ((double)RAND_MAX+1) * (nMax-nMin+1));
}
float lerp(float y1, float y2, float x){
	return y1+(y2-y1)*x;
}

float fade(float t){
	return 6*pow(t,5)-15*pow(t,4)+10*pow(t,3);
}

float norm(float fs[2]){
	return sqrt(pow(fs[0],2)+pow(fs[1],2));
}
vector<int> factors(int n){
	vector<int> r (1);
	vector<int> nf (1); // 'new_factor' for appending factors to r.
	
	int c = 0;
	for(int i = 1; i < n+1; i++){
		if(n%i==0){
			nf[0]=i;
			r.insert(r.end(),nf.begin(),nf.end());
		}
	}
	return r;
}