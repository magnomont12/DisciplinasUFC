import option3 as op
import cv2
import numpy as np
import os
import seaborn as sns
import numpy as np
import matplotlib.pyplot as plt 
from sklearn.linear_model import LinearRegression

def showImages(vetImgs, vetPositions):
    for img in range(len(vetImgs)):
        for a in range(len(vetPositions[img])):
            cv2.rectangle(vetImgs[img], (vetPositions[img][a][0], vetPositions[img][a][1]), (vetPositions[img][a][0]+vetPositions[img][a][2], vetPositions[img][a][1]+vetPositions[img][a][3]), (0, 0, 255), 2)
        cv2.imshow('teste'+str(img), vetImgs[img])
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

def laplacianImgs(vetImgs):
    laplacianImgs = []
    for a in vetImgs:
        laplacianImgs.append(cv2.Laplacian(a, cv2.CV_8U))
    return laplacianImgs

def morphoImgs(vetImgs):
    imgsProcessadas = []
    elementoEstruturante = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (2,2))
    elementoEstruturante1 = cv2.getStructuringElement(cv2.MORPH_RECT, (2,3))
    for a in vetImgs:
        #img = cv2.morphologyEx( a,cv2.MORPH_OPEN,elementoEstruturante)
        img = cv2.morphologyEx( a,cv2.MORPH_CLOSE,elementoEstruturante1)
        #img = cv2.morphologyEx( a,cv2.MORPH_CLOSE,elementoEstruturante1)
        imgsProcessadas.append(img)
    return imgsProcessadas

def aplicarFiltros(vetImgs):
    vetClahe = clahe(vetImgs)
    vetFilter = filterImages(vetClahe, 5)
    vetLaplacian = laplacianImgs(vetFilter)
    vetBinarize = binarizeImgs(vetLaplacian)
    vetMorpho = morphoImgs(vetBinarize)
    return vetMorpho


def findProj(vetImgs):
    vetProj = []
    for img in vetImgs:
        vet = [0] * (len(img[0] -1))
        for linha in range(len(img)):
            for coluna in range(len(img[linha])):
                #print("coluna: " + str(linha) + " linha: "+ str(coluna))
                vet[coluna] += img[linha][coluna]
        vetProj.append(vet)
    return vetProj

def plotHist(vetorHist):
    for a in range(len(vetorHist)):
        array = np.array(vetorHist[a])
        array = array/len(vetorHist[a])
        plt.figure(a)
        vetIndices=[]
        for a in range(len(array)):
            vetIndices.append(a)
        #print(len(vetorHist[a]))
        plt.bar(vetIndices, array)
        #plt.hist(array)
    plt.show()


def find_nonzero_runs(a):
        # Create an array that is 1 where a is nonzero, and pad each end with an extra 0.
        isnonzero = np.concatenate(([0], (np.asarray(a) != 0).view(np.int8), [0]))
        absdiff = np.abs(np.diff(isnonzero))
        # Runs start and end where absdiff is 1.
        ranges = np.where(absdiff == 1)[0].reshape(-1, 2)
        return ranges

def testandoBox(vetHist):
    for hist in vetHist:
        blocks = find_nonzero_runs(hist)
        print(len(blocks))

def findContours(vetImgs):
    vetContours = []
    for a in range(len(vetImgs)):
        contours, hierarchy = cv2.findContours(vetImgs[a], cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        vetContours.append([contours, hierarchy])
    return vetContours

def findPositions(contour):
    positions = []
    for c in contour:
        x , y, w, h = cv2.boundingRect(c)
        if h>15:
            positions.append([x,y,w,h])
    while len(positions)>4:
        regressor = LinearRegression()  
        regressor.fit([[positions[i][2]] for i in range(len(positions))], [positions[i][3] for i in range(len(positions))])  
        b = (regressor.intercept_, regressor.coef_)
        error =abs(positions[0][2]-(b[0]+b[1]*positions[0][2]))
        outline = 0
        for i in range(1,len(positions)):
            if abs(positions[i][2]-(b[0]+b[1]*positions[i][2])) > error:
                error = abs(positions[i][3]-(b[0]+b[1]*positions[i][2]))
                outline = i
        del(positions[outline])
    positions = sorted(positions, key=lambda positions: positions[0])
    return positions

def findBox(vetContours):
    find = []
    for a in range(len(vetContours)):
        positions = findPositions(vetContours[a][0])
        find.append(positions)
    return find

def generateImgs(vetImgs, vetPositions):
    images = []
    for img in range(len(vetImgs)):
        image = []
        for a in range(len(vetPositions[img])):
            image.append(vetImgs[img][:, vetPositions[img][a][0]:vetPositions[img][a][0]+vetPositions[img][a][2]])
        images.append(image)
    return images

def previsionImgs(path, value):
    images = op.findAllSubImgs(path, value)
    imgs = aplicarFiltros(images)
    contours = findContours(imgs)
    find = findBox(contours)
    previsionImgs = generateImgs(imgs, find)
    return previsionImgs
