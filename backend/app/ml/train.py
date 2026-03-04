"""
Train MedAssist Symptom Risk Classifier
Run: python train.py
Saves model.pkl to the ml/ directory.
"""
import pickle
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report

# ─── Training Data ────────────────────────────────────────────────────────────
# Format: (symptom_text, severity_1_to_10, duration_days, label)

TRAINING_DATA = [
    # EMERGENCY
    ("chest pain difficulty breathing", 9, 1, "emergency"),
    ("severe chest pain radiating arm", 10, 1, "emergency"),
    ("loss of consciousness seizure", 10, 1, "emergency"),
    ("stroke symptoms paralysis face drooping", 10, 1, "emergency"),
    ("severe allergic reaction anaphylaxis", 9, 1, "emergency"),
    ("coughing blood severe shortness of breath", 9, 2, "emergency"),
    ("sudden severe headache worst of life", 9, 1, "emergency"),
    ("severe abdominal pain high fever above 40", 8, 1, "emergency"),
    ("heart attack symptoms sweating pain", 10, 1, "emergency"),
    ("severe bleeding uncontrolled", 9, 1, "emergency"),

    # MODERATE
    ("fever vomiting diarrhea", 6, 3, "moderate"),
    ("persistent cough fever fatigue", 6, 5, "moderate"),
    ("severe headache dizziness nausea", 7, 2, "moderate"),
    ("rash swelling joint pain", 6, 4, "moderate"),
    ("blurred vision headache palpitations", 7, 2, "moderate"),
    ("high fever chills body ache", 7, 3, "moderate"),
    ("ear pain sore throat difficulty swallowing", 6, 3, "moderate"),
    ("urinary pain frequent urination fever", 6, 4, "moderate"),
    ("back pain muscle weakness numbness", 6, 5, "moderate"),
    ("nausea vomiting severe stomach pain", 7, 2, "moderate"),
    ("skin rash spreading swelling", 6, 2, "moderate"),
    ("dizziness fainting episodes", 7, 3, "moderate"),

    # MILD
    ("runny nose sneezing mild cough", 2, 2, "mild"),
    ("mild headache slight fatigue", 3, 1, "mild"),
    ("dry throat minor ache", 2, 1, "mild"),
    ("bloating mild nausea", 3, 2, "mild"),
    ("skin irritation minor rash", 2, 1, "mild"),
    ("sneezing watery eyes", 2, 3, "mild"),
    ("mild sore throat", 3, 2, "mild"),
    ("minor back ache tiredness", 3, 2, "mild"),
    ("slight fever mild fatigue", 4, 2, "mild"),
    ("minor stomach discomfort", 3, 1, "mild"),
]


def train():
    texts     = [d[0] for d in TRAINING_DATA]
    severities = [d[1] for d in TRAINING_DATA]
    durations  = [d[2] for d in TRAINING_DATA]
    labels    = [d[3] for d in TRAINING_DATA]

    vectorizer = TfidfVectorizer(max_features=500)
    X_text = vectorizer.fit_transform(texts).toarray()
    X_extra = np.array([[s, dur] for s, dur in zip(severities, durations)])
    X = np.hstack([X_text, X_extra])

    le = LabelEncoder()
    y = le.fit_transform(labels)

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)

    print("Classification Report:")
    print(classification_report(y_test, model.predict(X_test), target_names=le.classes_))

    with open("model.pkl", "wb") as f:
        pickle.dump({"model": model, "vectorizer": vectorizer, "label_encoder": le}, f)

    print("✅ Model saved to model.pkl")


if __name__ == "__main__":
    train()
