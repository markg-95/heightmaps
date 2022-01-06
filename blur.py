import numpy as np
import matplotlib.pyplot as plt
from PIL import Image
from numpy import asarray
#from simple_image_download import simple_image_download as simp
import os
import random

def gaussian(x,y,s=1.5):
    return (1/(2*np.pi*s**2))*np.exp(-1*((x**2+y**2)/(2*s**2)))
def get_gaussian_kernel(n=5, std=1.5):
    # Returns a kernel of values from the gaussian distribution, centered at the center of the kernel.
    kr = int(np.floor(n/2))
    indicies = np.zeros((n,n,2))
    g = np.zeros((n,n,1))
    for i in range(0,n):
        for j in range(0,n):
            displacement = np.array(np.array([kr,kr])-np.array([j,i]))
            indicies[i][j]= displacement[1]
            #print(displacement)
            g[i][j] = gaussian(displacement[0],displacement[1],std)
    return g
def convolute(image, kernel, normalize=True):
    # Iterate through the pixels of an image, and for each pixel we form a neighborhood around it whose size matches the kernel.
    # After a direct product is taken between the neighborhood and kernel, we sum the values and divide by the sum of the weights.
    # If performing edge detection (kernels have 0 sum), then we skip this normalizing step (dividing by the sum of the weights).
    kh = kernel.shape[0]
    kw = kernel.shape[1]
    kr = int(np.floor(kw/2))
    im_copy=image.copy()
    h=image.shape[0]
    w=image.shape[1]
    for i in range(0,h):
        for j in range(0,w):
            local_pixels = np.zeros((kw,kh,3))
            value = [0,0,0]
            
            for n in range(0,kw):
                for m in range(0,kh):
                    local_x = j-kr+n
                    local_y = i-kr+m
                    try:
                        local_pixels[m][n]=image[local_y][local_x]
                        pass
                    except:
                        local_pixels[m][n]=[0,0,0]
                        pass
        
            new_pixels = local_pixels * kernel
            if normalize:
                new_pixels = new_pixels / np.sum(kernel)
            
            new_r = np.sum([p[0] for row in new_pixels for p in row])
            new_g = np.sum([p[1] for row in new_pixels for p in row])
            new_b = np.sum([p[2] for row in new_pixels for p in row])
            
            im_copy[i][j]=[new_r,new_g,new_b]
    return im_copy
def gaussian_blur(image, n=5, std=1.5):
    # Convolutes an image with a gaussian kernel.
    return convolute(image, kernel=get_gaussian_kernel(n,std))

def linear_blur(image, n=5):
    # Convultes an image with a kernel of ones. (Non-weighted average)
    return convolute(image, kernel=np.ones((n,n,1)))