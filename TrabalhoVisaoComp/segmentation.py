import cv2
import numpy as np
import os


def vetImages(path):
    namesImgs = os.listdir(path)
    vetImgs = []
    for a in namesImgs:
        vetImgs.append(cv2.imread(path+a,cv2.IMREAD_GRAYSCALE))
    return vetImgs

def showImages(vetImgs, vet):
    for a in range(0,len(vetImgs)):
        contours, hierarchy = cv2.findContours(vetImgs[a], cv2.RETR_CCOMP, cv2.CHAIN_APPROX_NONE, offset = (50, 50))
        cv2.drawContours(vetImgs[a], contours, -1, (0,255,0), 3)
        cv2.imshow('teste'+str(a), vetImgs[a])

def binarizeImgs(vetImgs):
    imgsBinarizada = []
    for a in vetImgs:
        imgsBinarizada.append(cv2.adaptiveThreshold( a, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY_INV, 11, 5))
    return imgsBinarizada

def filterImages(vetImgs, value):
    imgsFilter = []
    for a in vetImgs:
        imgsFilter.append(cv2.bilateralFilter(a, value,75,75))
    return imgsFilter

def filterImages1(vetImgs, value):
    imgsFilter = []
    for a in vetImgs:
        imgsFilter.append(cv2.medianBlur(a, value))
    return imgsFilter

def realceContorno(vetImgs):
    imgsRealces = []
    for a in vetImgs:
        imgLaplace = cv2.Laplacian(a, cv2.CV_8U)
        imgsRealces.append(cv2.subtract(a, imgLaplace))
    return imgsRealces

def morphoImgs(vetImgs):
    imgsProcessadas = []
    elementoEstruturante = cv2.getStructuringElement(cv2.MORPH_OPEN, (3,3))
    for a in vetImgs:
        imgsProcessadas.append(cv2.morphologyEx( a,cv2.MORPH_CLOSE ,elementoEstruturante))
    return imgsProcessadas

def cannyImgs(vetImgs):
    imgsCanny = []
    for a in vetImgs:
        imgsCanny.append(cv2.Canny(a, 100, 200))
    return imgsCanny


if __name__ == '__main__':
    vet = vetImages('dataset/')
    vetFilter = filterImages(vet, 5)
    vetBinarize = binarizeImgs(vetFilter)
    vetMorpho = morphoImgs(vetBinarize)

    showImages(vetMorpho, vet)


    cv2.waitKey(0)
    cv2.destroyAllWindows()
