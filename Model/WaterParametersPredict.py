import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeRegressor
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor

def myModel(new_data_point):
    data = pd.read_csv("Model\\dataset\\train.csv")
    features_input = ["day", "size"]
    features_ouput = ["temp", "pH" , "turb"]
    x = data[features_input]
    y = data[features_ouput]

    # Train the model as before
    x_train, x_valid, y_train, y_valid = train_test_split(x, y, train_size=0.8, test_size=0.2, random_state=0)
    rf_model = RandomForestRegressor(random_state=1)
    rf_model.fit(x_train, y_train)

    # Predict using the provided new_data_point
    new_data_df = pd.DataFrame(new_data_point, columns=features_input)
    rf_prediction = rf_model.predict(new_data_df)
    return rf_prediction