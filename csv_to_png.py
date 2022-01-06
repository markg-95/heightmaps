#test.py
import sys
from PIL import Image
import numpy as np
import blur
def raw_to_rgb(image):
    r = np.zeros((image.shape[0],image.shape[1],3))
    for i in range(0,image.shape[0]):
        for j in range(0,image.shape[1]):
            v = image[i][j]
            r[i][j]=[v,v,v]
    return r
    
def rgb_to_raw(image):
    return image[:,:,0]
    
if __name__ == "__main__":
    do_blur = False
    image_path = ""
    if len(sys.argv) < 1:
        path = input("Enter path to .txt file: ")
        image_path=path
    else:
        passed_args = sys.argv
        image_path = passed_args[1]
        do_blur = passed_args[2]
    image_data = np.genfromtxt(image_path, delimiter=',')
    if int(do_blur) == 1:
        image_data = raw_to_rgb(image_data)
        image_data = blur.gaussian_blur(image_data)
        image_data = rgb_to_raw(image_data)
    Image.fromarray(np.floor((2**16-1)*image_data).astype(np.uint16)).save(f"{image_path.split('.')[0]+'.png'}");