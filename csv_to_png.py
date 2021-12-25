from PIL import Image
from numpy import asarray
import numpy as np
import matplotlib.pyplot as plt
import os

def save_image(image, name):
    Image.fromarray(image).save(f'{name}');
def load_image(path):
    image = Image.open(path)
    image = np.asarray(image)
    return image
    
if __name__ == "__main__":
    path = input("Enter path to .txt file: ")
    
    
    if(os.path.exists(path)):
        
        my_data = np.genfromtxt(path, delimiter=',')
        
        print(my_data.shape)
        my_data = my_data[:, 0:my_data.shape[1]-1]
        print(my_data.shape)
        new_path=path.split('.')[0]+'.png'
        save_image(np.floor((2**16-1)*my_data).astype(np.uint16),new_path)
        print('New image saved.')
        print(new_path)
    else:
        print("File not found.")
    
