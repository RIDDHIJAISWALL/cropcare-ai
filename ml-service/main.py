"""
CropCare AI — ML Microservice
Serves two endpoints:
  POST /predict-crop     → Crop recommendation from soil/environment data
  POST /predict-disease  → Plant disease detection from leaf image URL

"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import numpy as np
import os
import google.generativeai as genai
import json
from dotenv import load_dotenv

load_dotenv() # Load environment variables from .env file

app = FastAPI(title="CropCare AI ML Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Load Models on Startup ──────────────────────────────────
CROP_MODEL_PATH = os.path.join("models", "crop_rf_model.pkl")
DISEASE_MODEL_PATH = os.path.join("models", "disease_model.h5")

crop_model = None
disease_model = None

# Crop label mapping (will be loaded from the saved model artifacts)
CROP_LABELS = [
    "rice", "maize", "chickpea", "kidneybeans", "pigeonpeas",
    "mothbeans", "mungbean", "blackgram", "lentil", "pomegranate",
    "banana", "mango", "grapes", "watermelon", "muskmelon",
    "apple", "orange", "papaya", "coconut", "cotton",
    "jute", "coffee"
]

# Crop explanation templates
CROP_EXPLANATIONS = {
    "rice": "Rice thrives in warm, humid conditions with high rainfall and slightly acidic soil (pH 5.5-6.5).",
    "maize": "Maize grows well in warm temperatures (21-27°C) with moderate rainfall and neutral soil pH.",
    "wheat": "Wheat prefers cooler temperatures (15-20°C) with moderate rainfall and slightly acidic to neutral soil.",
    "chickpea": "Chickpea does well in moderate temperatures with low humidity and well-drained soil.",
    "cotton": "Cotton requires warm temperatures, moderate rainfall, and slightly alkaline soil.",
    "coffee": "Coffee grows best in tropical climates with consistent rainfall and acidic soil.",
    "banana": "Banana needs warm, humid conditions with rich soil and consistent rainfall.",
    "mango": "Mango thrives in hot, dry weather with well-drained, slightly acidic soil.",
}


@app.on_event("startup")
def load_models():
    global crop_model, disease_model

    # Load crop model if it exists
    if os.path.exists(CROP_MODEL_PATH):
        crop_model = joblib.load(CROP_MODEL_PATH)
        print("Crop recommendation model loaded.")
    else:
        print("Crop model not found at", CROP_MODEL_PATH, "— using demo mode.")

    # Disease model loading placeholder
    # When you train and save the disease model, load it here
    if os.path.exists(DISEASE_MODEL_PATH):
        try:
            from tensorflow.keras.models import load_model
            disease_model = load_model(DISEASE_MODEL_PATH)
            print("Disease detection model loaded.")
        except Exception as e:
            print(f"Disease model failed to load: {e} — using demo mode.")
    else:
        print("Disease model not found at", DISEASE_MODEL_PATH, "— using demo mode.")


# ─── Request / Response Schemas ───────────────────────────────
class CropInput(BaseModel):
    nitrogen: float
    phosphorus: float
    potassium: float
    temperature: float
    humidity: float
    ph: float
    rainfall: float


class DiseaseInput(BaseModel):
    image_base64: str
    plant_name: str


# ─── Crop Prediction Endpoint ────────────────────────────────
@app.post("/predict-crop")
def predict_crop(data: CropInput):
    features = np.array([[
        data.nitrogen, data.phosphorus, data.potassium,
        data.temperature, data.humidity, data.ph, data.rainfall
    ]])

    if crop_model is not None:
        # Real prediction
        prediction = crop_model.predict(features)[0]
        probabilities = crop_model.predict_proba(features)[0]
        confidence = float(np.max(probabilities))
        crop_name = prediction if isinstance(prediction, str) else CROP_LABELS[int(prediction)]
    else:
        # Demo mode — realistic heuristic fallback for development
        temp = data.temperature
        rain = data.rainfall
        
        if temp > 28 and rain > 150:
            crop_name = "rice"
        elif temp > 28 and rain <= 150:
            crop_name = "cotton" if rain > 80 else "mango"
        elif temp < 20:
            crop_name = "wheat" if rain > 100 else "apple"
        elif temp >= 20 and temp <= 28:
            crop_name = "maize" if rain > 100 else "chickpea"
        else:
            crop_name = "banana"
            
        confidence = round(0.75 + (np.random.random() * 0.2), 2) # Random between 0.75 and 0.95

    explanation = CROP_EXPLANATIONS.get(
        crop_name,
        f"{crop_name.capitalize()} is suitable for the given soil and environmental conditions."
    )

    return {
        "crop": crop_name,
        "confidence": round(confidence, 2),
        "explanation": explanation,
    }


# ─── Disease Detection Endpoint ──────────────────────────────
@app.post("/predict-disease")
def predict_disease(data: DiseaseInput):
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="Gemini API Key is not set in environment.")
    
    try:
        genai.configure(api_key=api_key)
        
        # Parse the prompt for JSON formatting
        model = genai.GenerativeModel('gemini-3.8-flash')
        
        prompt = f"""
        You are an expert agricultural botanist and plant pathologist. Analyze the provided image of a {data.plant_name} leaf.
        Return the result strictly as a JSON object with the following exact keys:
        - "disease_name": The name of the disease (e.g., "Early Blight"). If healthy, say "Healthy".
        - "confidence": A float between 0.0 and 1.0 representing your confidence.
        - "remedies": "List 2-3 specific pesticides, medicines, or actionable organic remedies to treat this specific disease on this specific plant."
        
        Respond ONLY with valid JSON. No markdown formatting, no backticks.
        """
        
        # Prepare the base64 image payload
        image_parts = [
            {
                "mime_type": "image/jpeg",
                "data": data.image_base64
            }
        ]
        
        response = model.generate_content([prompt, image_parts[0]])
        
        # Clean up output (sometimes Gemini includes ```json ... ```)
        output = response.text.strip()
        if output.startswith("```json"):
            output = output.replace("```json", "", 1).strip()
        if output.endswith("```"):
            output = output.rsplit("```", 1)[0].strip()
            
        result = json.loads(output)
        return result
        
    except Exception as e:
        print("Gemini API Error:", e)
        # Fallback to demo mode if API fails (e.g., rate limit exceeded)
        print("Falling back to demo mode due to API error...")
        return {
            "disease_name": "Demo Mode: Early Blight",
            "confidence": 0.85,
            "remedies": "1. Remove affected leaves. 2. Apply copper-based fungicide. 3. Ensure good air circulation."
        }


# ─── Health Check ─────────────────────────────────────────────
@app.get("/health")
def health():
    return {
        "status": "ok",
        "crop_model_loaded": crop_model is not None,
        "disease_model_loaded": disease_model is not None,
    }
