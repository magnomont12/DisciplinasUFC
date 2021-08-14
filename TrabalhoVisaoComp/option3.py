import cv2
import numpy as np
import os

def vetImages(path):
    namesImgs = os.listdir(path)
    vetImgs = []
    teste = []
    for a in namesImgs:
        vetImgs.append(cv2.imread(path+a,cv2.IMREAD_GRAYSCALE))

    return vetImgs

def showImages(vetImgs, vet):
    for a in range(len(vetImgs)):
        contours, hierarchy = cv2.findContours(vetImgs[a], cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        for c in contours:
            x , y, w, h = cv2.boundingRect(c)
            cv2.rectangle(vet[a], (x, y), (x+w, y+h), (0, 0, 255), 2)
        cv2.imshow('teste'+str(a), vet[a])
        #cv2.imwrite('teste'+str(a)+'.jpeg', vet[a])

def clahe(vetImgs):
    imgsClahe = []
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))
    for a in vetImgs:
        imgsClahe.append(clahe.apply(a))
    return imgsClahe


def binarizeImgs(vetImgs):
    imgsBinarizada = []
    tipo = cv2.THRESH_BINARY + cv2.THRESH_OTSU
    for a in vetImgs:
        limiar, imgBinarizada = cv2.threshold(a, 0, 255, tipo)
        imgsBinarizada.append(imgBinarizada)

    return imgsBinarizada

def filterImages(vetImgs, value):
    imgsFilter = []
    for a in vetImgs:
        imgsFilter.append(cv2.bilateralFilter(a, value,75,75))
    return imgsFilter


def morphoImgs(vetImgs):
    imgsProcessadas = []
    elementoEstruturante = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3,3))
    elementoEstruturante1 = cv2.getStructuringElement(cv2.MORPH_RECT, (55,4))
    elementoEstruturante2 = cv2.getStructuringElement(cv2.MORPH_RECT, (30,5))
    for a in vetImgs:
        img = cv2.morphologyEx( a,cv2.MORPH_OPEN,elementoEstruturante)
        img = cv2.morphologyEx( img,cv2.MORPH_DILATE,elementoEstruturante1)
        img = cv2.morphologyEx( img,cv2.MORPH_CLOSE,elementoEstruturante2)
        imgsProcessadas.append(img)
    return imgsProcessadas


def laplacianImgs(vetImgs):
    laplacianImgs = []
    for a in vetImgs:
        laplacianImgs.append(cv2.Laplacian(a, cv2.CV_8U))
    return laplacianImgs

def findContours(image):
    contours, hierarchy = cv2.findContours(image, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
    return contours, hierarchy

def proj(image):
    vet = []
    for a in image:
        vet.append(np.sum(a))
    return vet

def coordsImgs(contours):
    positions = []
    for c in contours:
        x,y,w,h = cv2.boundingRect(c)
        if h > 20:
            positions.append(cv2.boundingRect(c))
    positions = sorted(positions, key=lambda positions: positions[0])
    return positions

def showAllCountours(image, positions):
    vetImgs = []
    for a in positions:
        inicioX = a[0]
        fimX = a[0]+a[2]
        inicioY = a[1]
        fimY = a[1]+a[3]
        img = image[inicioY:fimY, inicioX:fimX]
        vetImgs.append(img)
    # for a in range(len(vetImgs)):
    #     cv2.imshow('teste'+str(a), vetImgs[a])
    return vetImgs

def findAllSubImgs(path,value):
    vet = vetImages(path)
    vetClahe = clahe(vet)
    vetFilter = filterImages(vetClahe, 5)
    vetLaplacian = laplacianImgs(vetFilter)
    vetBinarize = binarizeImgs(vetLaplacian)
    vetMorpho = morphoImgs(vetBinarize)
    contornos = findContours(vetMorpho[value])
    positions = coordsImgs(contornos[0])
    subImages = showAllCountours(vet[value], positions)
    # showImages(vetMorpho, vet)
    return subImages



