# -*- coding: utf-8 -*-


import tensorflow as tf

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

dataset = pd.read_csv('Churn_Modelling.csv')
dataset.head()

#dependent and independent feature
X = dataset.iloc[:,3:13]
y = dataset.iloc[:,13]
X

y

#feature engineering
geography = pd.get_dummies(X['Geography'],drop_first= True)
gender = pd.get_dummies(X['Gender'], drop_first=True)

#concate feature
X = X.drop(['Geography','Gender'], axis=1)
X

X = pd.concat([X,geography,gender],axis=1)
X

from sklearn.model_selection import train_test_split
X_train, X_test, y_train, y_test = train_test_split(X,y,test_size=0.2,random_state=0)
#

#feature scaling
from sklearn.preprocessing import StandardScaler
sc = StandardScaler()
X_train = sc.fit_transform(X_train)
X_test = sc.transform(X_test)

X_train.shape

#part - 2 Implement ANN
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense
from tensorflow.keras.layers import ReLU, PReLU, LeakyReLU, ELU
from tensorflow.keras.layers import Dropout

#lets initialize ANN
classifier = Sequential()

#Adding input layer
classifier.add(Dense(units=11,activation='relu'))
#Addint first hidden layer
classifier.add(Dense(units=7,activation='relu'))
#Adding second hidden layer
classifier.add(Dense(units=6,activation='relu'))
#Adding output layer
classifier.add(Dense(units=1,activation='sigmoid'))

classifier.compile(optimizer='adam',loss='binary_crossentropy',metrics=['accuracy'])

early_stoping = tf.keras.callbacks.EarlyStopping(
    monitor="val_loss",
    min_delta=0.0001,
    patience=20,
    verbose=1,
    mode="auto",
    baseline=None,
    restore_best_weights=False,
    start_from_epoch=0,
)

model_history = classifier.fit(X_train,y_train,validation_split=0.33, batch_size=10,epochs=1000,callbacks=early_stoping)

model_history.history.keys()

#summarise history of accuracy
plt.plot(model_history.history['accuracy'])
plt.plot(model_history.history['val_accuracy'])
plt.title('model accuracy')
plt.ylabel('accuracy')
plt.xlabel('epoch')
plt.legend(['train','test'],loc='upper left')
plt.show()

#summarise for loss
plt.plot(model_history.history['loss'])
plt.plot(model_history.history['val_loss'])
plt.title('model loss')
plt.ylabel('loss')
plt.xlabel('epoch')
plt.legend(['train','test'],loc='upper left')
plt.show()

y_pred = classifier.predict(X_test)
y_pred = (y_pred >= 0.5)

from sklearn.metrics import confusion_matrix
cm = confusion_matrix(y_test,y_pred)
cm

from sklearn.metrics import accuracy_score
score = accuracy_score(y_test,y_pred)
score

#get the weigths
classifier.get_weights()

import joblib

# Save the scaler
joblib.dump(sc, 'scaler.pkl')

# Save the model
classifier.save('churn_model.h5')

print("Model and scaler saved!")