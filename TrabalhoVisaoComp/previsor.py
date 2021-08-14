# make a prediction for a new image.
from keras.preprocessing.image import load_img
from keras.preprocessing.image import img_to_array
from keras.models import load_model
import findHist as fd
import cv2
import numpy as np
import pandas as pd
 
# load and prepare the image
def load_image(img):
    img = cv2.resize(img,(28,28))
    img = img_to_array(img)
    img = img.reshape(1, 28, 28, 1)
    img = img.astype('float32')
    return img
 
def run_example(img):
    image = load_image(img)
    model = load_model('final_model.h5')
    digit = model.predict_classes(image)
    teste = model.predict_proba(image)
    return digit[0]

def findNumbersImage(vetImages):
    numbers = []
    for a in range(len(vetImages)):
        number = []
        for b in range(len(vetImages[a])):
            img = vetImages[a][b]
            digit = run_example(img)
            number.append(digit)
        numbers.append(number)
    return numbers

def generateImages(vetImages):
    for a in range(len(vetImages)):
        for b in range(len(vetImages[a])):
            vetImages[a][b]
            cv2.imwrite('myImages/teste9'+str(a)+'-'+str(b)+'.jpeg', vetImages[a][b])

def centralize(image):
    h = np.size(image, 0)
    w = np.size(image, 1)
    if h>w :
        img_c= np.zeros((h*2,h*2), dtype = 'float32')
        inicio = h
    else:
        img_c= np.zeros((w*2,w*2), dtype = 'float32')
        inicio = w
    inicioX = w//2
    inicioY = h//2
    for a in range(0,h):
        for b in range(0,w):
            img_c[inicio-inicioY+a][inicio-inicioX+b] = image[a][b]
    return img_c

def allImages():
    results = []
    for a in range(10):
        images = fd.previsionImgs('dataset/',a)
        results.append(findNumbersImage(images))
    return results

def gerarNumbers(results):
    newResults = []
    for a in range(len(results)):
        numbers = []
        for b in range(len(results[a])):
            if len(results[a][b]) < 4:
                number = 'error'
            else:
                number = str(results[a][b][0]) + str(results[a][b][1]) + str(results[a][b][2]) + str(results[a][b][3])
            numbers.append(number)
        newResults.append(numbers)
    return newResults

def gerarCsv(numbers):
    for a in range(0,len(numbers)):
        print("printando a imagem: " + str(a))
        for b in range(0,len(numbers[a])):
            print(numbers[a][b])


#Verificacao hardcode
def verificandoApp():
    o_coluna1 = [1521,93,5434,3344,8321,9593,7471,7721,1291,458,5809,7202,9178,1713,1653,5219,3284,3397,8421,5984,7315,6329,7100,2596,195,2377]
    o_coluna2= [3012,3021,3210,3102,2312,1987,1879,1798,1879,2789,2897,2987,2789,2879,2978,3678,3789,3867,3978,3798,4678,4786,4867,4768,4769,4976,4698]
    o_coluna3= [3692,4758,2031,4179,3156,7439,2056,1038,6493,5423,8106,7290,1056,7968,2431,6390,3425,7103,2546,6381,4207,9564,1029,9837,1357,9024,6813,5790]
    o_coluna4= [7381,4501,1508,2703,3801,7204,6108,832,3943,696,101,3203,6138,7282,7148,2182,4285,7172,2019,1817,1703,4013,3923,1638,824,2289,352]
    o_coluna5= [752,1203,4851,9606,7136,5458,3892,5905,4234,1546,2738,159,3250,4372,5681,9403,5932,517,3267,14,3527,4790,2135,426,1608,2971,7076]
    o_coluna6 = [1358,2467,8631,9902,4590,5132,3567,7125,3500,9127,2379,8643,1472,4313,6706,71,5304,7142,8653,2480,121,3320,2045,3690,5814,8103,4892]
    o_coluna7= [1503,3627,1985,7081,2038,9601,4052,2701,1803,9601,2503,139,6132,2107,3892,6741,5102,7182,632,333,2162,1745,7832,6182,9837,3224,303]
    o_coluna8= [2384,4159,3771,7598,8321,6683,7921,8843,9279,4391,6278,3771,5910,9101,2311,7020,9431,9320,9358,3321,5498,9986,6137,8509,8874,3819,1022]
    o_coluna9= [1234,5970,3248,8879,3819,1985,2398,1011,1843,2345,7391,4424,4832,9131,7001,4077,3299,4213,8389,9124,8771,9283,5253,5143,179,1573,9303]
    o_coluna10= [1234,2134,3215,4321,4567,5467,6457,7654,8976,9876,7698,6876,6897,7968,6789,8696,9678,7869,132,1032,2013,3201,321,213,312,2301,2031]

    t_coluna1=[7782,2774,7773,8527,3327,8572,7737,2273,1508,3257,5287,1285,8555,9175,5827,7252,5454,1271,372,2175,2536,2702,5327,5727,4382,3374,5745] 
    t_coluna2=[3573,3524,1877,2777,1724,3245,7877,2311,3154,2577,2926,2759,2777,2747,3618,2787,3737,7871,2228,3768,2237,2784,1977,2127,4727,4778,2275]
    t_coluna3=[2433,5035,2355,7433,5552,4379,4758,2337,7337,5423,525,2527,7523,7240,7455,2555,8302,2455,7370,5527,5355,4221,3371,7557,2555,9524,9571,5735]
    t_coluna4=[4343,6705,5832,"error",3501,2405,4501,2382,3505,2572,4235,5352,7348,7254,5533,3237,546,7401,5354,2477,5524,8253,8423,4027,8505,7287,2054]
    t_coluna5=[2342,5553,5522,5435,5772,2255,4522,5252,1235,5521,5233,5553,5253,2272,3255,7127,2733,1545,7272,7772,5357,5922,5557,752,3523,7534,2257]
    t_coluna6=[3553,5525,5337,5032,4557,2437,5552,3532,3552,7327,5042,7145,5773,2775,7472,2377,5533,2157,2832,5227,3527,5275,5134,2585,9432,2322,6253]
    t_coluna7=[8825,2701,4552,2665,2033,7785,7485,"error","error",5302,5752,3741,"error",5702,5532,757,2503,4525,5727,"error",9357,7552,5582,5452,7745,333,"error"]
    t_coluna8=[7277,8573,7749,5555,2321,7575,3741,7157,2557,7525,5751,2222,2311,2622,5722,2771,2225,"error",7022,3837,3777,3559,6158,"error",778,7545,4353]
    t_coluna9=[6873,6587,7374,8952,3517,4579,5275,7742,7224,4383,3277,4522,7427,4151,4332,7371,7051,2375,4505,1573,5177,5075,5205,7235,8731,7127,5557]    
    t_coluna10 = [2735,3227,3227,4551,2322,5757,7277,1453,8717,4575,2575,7523,5752,5875,5757,5274,7777,8277,5622,2534,5555,2152,7323,7245,3362,7327,2572]


    oficial = []
    oficial.append(o_coluna1)
    oficial.append(o_coluna2)
    oficial.append(o_coluna3)
    oficial.append(o_coluna4)
    oficial.append(o_coluna5)
    oficial.append(o_coluna6)
    oficial.append(o_coluna7)
    oficial.append(o_coluna8)
    oficial.append(o_coluna9)
    oficial.append(o_coluna10)

    teste = []
    teste.append(t_coluna1)
    teste.append(t_coluna2)
    teste.append(t_coluna3)
    teste.append(t_coluna4)
    teste.append(t_coluna5)
    teste.append(t_coluna6)
    teste.append(t_coluna7)
    teste.append(t_coluna8)
    teste.append(t_coluna9)
    teste.append(t_coluna10)

    acertos = 0
    erros = 0
    problemas = 0

    for a in range(len(oficial)):
        for b in range(len(teste[a])):
            if teste[a][b] == "error":
                problemas+=1
            elif teste[a][b] in oficial[a]:
                acertos+=1
            else:
                erros+=1
    print(acertos, erros, problemas)

    

verificandoApp()

results = allImages()
numbers = gerarNumbers(results)
gerarCsv(numbers)
images = fd.previsionImgs('dataset/',0)

numbers = findNumbersImage(images)