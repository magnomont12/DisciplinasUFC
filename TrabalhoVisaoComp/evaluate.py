from numpy import mean
from numpy import std
from matplotlib import pyplot
from sklearn.model_selection import KFold
from keras.datasets import mnist
from keras.utils import to_categorical
from keras.models import Sequential
from keras.layers import Conv2D
from keras.layers import MaxPooling2D
from keras.layers import Dense
from keras.layers import Flatten
from keras.optimizers import SGD
from keras.utils import np_utils
import os
from PIL import Image
import numpy as np
import os

def load_images_to_data(image_label, image_directory, features_data, label_data):
    list_of_files = os.listdir(image_directory)
    for file in list_of_files:
        image_file_name = os.path.join(image_directory, file)
        if ".jpeg" in image_file_name:
            img = Image.open(image_file_name).convert("L")
            img = np.resize(img, (28,28,1))
            im2arr = np.array(img)
            im2arr = im2arr.reshape(1,28,28,1)
            features_data = np.append(features_data, im2arr, axis=0)
            label_data = np.append(label_data, [image_label], axis=0)
    return features_data, label_data

def load_dataset():
	(X_train, Y_train), (x_test, y_test) = mnist.load_data()

	X_train = X_train.reshape(X_train.shape[0], X_train.shape[1], X_train.shape[2], 1).astype('float32')
	x_test = x_test.reshape(x_test.shape[0], x_test.shape[1], x_test.shape[2], 1).astype('float32')

	X_train, Y_train = load_images_to_data ('0', 'train/0/', X_train, Y_train)
	x_test, y_test = load_images_to_data('0', 'test/0', x_test, y_test)

	X_train, Y_train = load_images_to_data ('1', 'train/1/', X_train, Y_train)
	x_test, y_test = load_images_to_data('1', 'test/1', x_test, y_test)

	X_train, Y_train = load_images_to_data ('2', 'train/2/', X_train, Y_train)
	x_test, y_test = load_images_to_data('2', 'test/2', x_test, y_test)

	X_train, Y_train = load_images_to_data ('3', 'train/3/', X_train, Y_train)
	x_test, y_test = load_images_to_data('3', 'test/3', x_test, y_test)

	X_train, Y_train = load_images_to_data ('4', 'train/4/', X_train, Y_train)
	x_test, y_test = load_images_to_data('4', 'test/4', x_test, y_test)

	X_train, Y_train = load_images_to_data ('5', 'train/5/', X_train, Y_train)
	x_test, y_test = load_images_to_data('5', 'test/5', x_test, y_test)

	X_train, Y_train = load_images_to_data ('6', 'train/6/', X_train, Y_train)
	x_test, y_test = load_images_to_data('6', 'test/6', x_test, y_test)

	X_train, Y_train = load_images_to_data ('7', 'train/7/', X_train, Y_train)
	x_test, y_test = load_images_to_data('7', 'test/7', x_test, y_test)

	X_train, Y_train = load_images_to_data ('8', 'train/8/', X_train, Y_train)
	x_test, y_test = load_images_to_data('8', 'test/8', x_test, y_test)

	X_train, Y_train = load_images_to_data ('9', 'train/9/', X_train, Y_train)
	x_test, y_test = load_images_to_data('9', 'test/9', x_test, y_test)

	X_train/=255
	x_test/=255

	number_of_classes = 10
	Y_train = np_utils.to_categorical(Y_train, number_of_classes)
	y_test = np_utils.to_categorical(y_test, number_of_classes)

	return X_train, Y_train, x_test, y_test

def define_model():
	model = Sequential()
	model.add(Conv2D(32, (3, 3), activation='relu', kernel_initializer='he_uniform', input_shape=(28, 28, 1)))
	model.add(MaxPooling2D((2, 2)))
	model.add(Conv2D(64, (3, 3), activation='relu', kernel_initializer='he_uniform'))
	model.add(Conv2D(64, (3, 3), activation='relu', kernel_initializer='he_uniform'))
	model.add(MaxPooling2D((2, 2)))
	model.add(Flatten())
	model.add(Dense(100, activation='relu', kernel_initializer='he_uniform'))
	model.add(Dense(10, activation='softmax'))
	opt = SGD(lr=0.01, momentum=0.9)
	model.compile(optimizer=opt, loss='categorical_crossentropy', metrics=['accuracy'])
	return model

def evaluate_model(dataX, dataY, n_folds=5):
	scores, histories = list(), list()
	# prepare cross validation
	kfold = KFold(n_folds, shuffle=True, random_state=1)
	# enumerate splits
	for train_ix, test_ix in kfold.split(dataX):
		# define model
		model = define_model()
		# select rows for train and test
		trainX, trainY, testX, testY = dataX[train_ix], dataY[train_ix], dataX[test_ix], dataY[test_ix]
		# fit model
		history = model.fit(trainX, trainY, epochs=10, batch_size=32, validation_data=(testX, testY), verbose=0)
		# evaluate model
		_, acc = model.evaluate(testX, testY, verbose=0)
		print('> %.3f' % (acc * 100.0))
		# stores scores
		scores.append(acc)
		histories.append(history)
	return scores, histories

def summarize_performance(scores):
	# print summary
	print('Accuracy: mean=%.3f std=%.3f, n=%d' % (mean(scores)*100, std(scores)*100, len(scores)))
	# box and whisker plots of results
	pyplot.boxplot(scores)
	pyplot.show()

def run_test_harness():
	trainX, trainY, testX, testY = load_dataset()
	scores, histories = evaluate_model(trainX, trainY)
	summarize_performance(scores)

run_test_harness()