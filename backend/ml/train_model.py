import os
import joblib
import numpy as np

from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score


# ==================================================
# CREATE TRAINING DATA
# ==================================================

np.random.seed(42)

data = []
labels = []


for _ in range(5000):

    amount = np.random.randint(100, 100000)

    new_device = np.random.randint(0, 2)

    foreign_location = np.random.randint(0, 2)

    failed_attempts = np.random.randint(0, 8)

    transaction_hour = np.random.randint(0, 24)


    # ----------------------------------------------
    # Generate fraud probability
    # ----------------------------------------------

    risk = 0


    if amount >= 50000:
        risk += 25

    elif amount >= 20000:
        risk += 15


    if new_device:
        risk += 20


    if foreign_location:
        risk += 20


    if failed_attempts >= 5:
        risk += 25

    elif failed_attempts >= 3:
        risk += 15


    if transaction_hour < 5 or transaction_hour >= 23:
        risk += 10


    # Add some randomness
    risk += np.random.randint(-10, 11)


    fraud = 1 if risk >= 50 else 0


    data.append([
        amount,
        new_device,
        foreign_location,
        failed_attempts,
        transaction_hour
    ])

    labels.append(fraud)


# ==================================================
# CONVERT TO NUMPY
# ==================================================

X = np.array(data)

y = np.array(labels)


# ==================================================
# TRAIN / TEST SPLIT
# ==================================================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)


# ==================================================
# TRAIN MODEL
# ==================================================

model = RandomForestClassifier(
    n_estimators=150,
    max_depth=10,
    random_state=42
)


model.fit(
    X_train,
    y_train
)


# ==================================================
# TEST MODEL
# ==================================================

predictions = model.predict(X_test)

accuracy = accuracy_score(
    y_test,
    predictions
)


print(
    f"Model Accuracy: {accuracy * 100:.2f}%"
)


# ==================================================
# SAVE MODEL
# ==================================================

model_path = os.path.join(
    os.path.dirname(__file__),
    "fraud_model.joblib"
)


joblib.dump(
    model,
    model_path
)


print(
    "Model saved successfully!"
)

print(
    f"Location: {model_path}"
)