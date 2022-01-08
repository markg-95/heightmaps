# heightmaps

Perlin noise / erosion algorithms v1.

1) ```git clone https://www.github.com/markg-95/heightmaps```
2) ```cd heightmaps```
3) Go to https://marksmaps.herokuapp.com/ to make a basic heightmap from perlin noise. The download will be a .txt file. Copy this file to ```./```
4) Run ```. h.sh``` to compile (as h.out) and run the erosion algorithm.
5) Enter the name of the file. 
6) Enter the number of simulations you want to run. (For low resolution heightmaps, try a lower number of simulations.)
7) Either save the file with the default path or enter a new path. The file gets saved as a .txt file.
8) Run `python3 -m venv venv` to create a virtual python environment.
9) Run `. venv/bin/activate` to activate the environment.
10) Run `pip install -r requirements.txt` to install required python modules.
11) Finally, run ```python3 csv_to_png.py <your-text-file> <0 OR 1>``` (1 will blur the final image).
12) Import the heightmap in your game engine.
