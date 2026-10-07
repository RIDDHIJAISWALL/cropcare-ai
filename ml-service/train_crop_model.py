import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report
import joblib
import os

def train():
    print("Downloading Crop Recommendation Dataset...")
    url = "https://raw.githubusercontent.com/nileshely/Crop-Recommendation/main/Crop_Recommendation.csv"
    
    try:
        df = pd.read_csv(url)
    except Exception as e:
        print(f"Failed to download dataset: {e}")
        return
        
    print(f"Dataset loaded! Found {len(df)} records and {len(df['Crop'].unique())} crop types.")
    
    # 1. Split data into Features (X) and Labels (y)
    X = df[['Nitrogen', 'Phosphorus', 'Potassium', 'Temperature', 'Humidity', 'pH_Value', 'Rainfall']]
    y = df['Crop']
    
    # 2. Split into training and testing sets (80% train, 20% test)
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # 3. Initialize and train the Random Forest Classifier
    print("Training Random Forest Model... This will take a few seconds.")
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    
    # 4. Evaluate the model
    accuracy = model.score(X_test, y_test)
    print(f"Model trained! Accuracy on test data: {accuracy * 100:.2f}%")
    
    # 5. Save the trained model to the 'models' folder
    os.makedirs("models", exist_ok=True)
    model_path = os.path.join("models", "crop_rf_model.pkl")
    
    # The CropCare AI backend also needs to know the exact labels array mapping if it was label encoded, 
    # but our RandomForest can handle string labels directly, and predict() will output strings.
    # The ml-service main.py will check if the output is string and use it directly.
    joblib.dump(model, model_path)
    print(f"Model successfully saved to: {model_path}")

if __name__ == "__main__":
    train()
