import { useState } from "react";
import { FlaskConical, Sprout, RotateCcw, MapPin, CloudRain } from "lucide-react";
import API from "../services/api";
import toast from "react-hot-toast";
import "./CropRecommendation.css";

const initialForm = {
  nitrogen: "",
  phosphorus: "",
  potassium: "",
  temperature: "",
  humidity: "",
  ph: "",
  rainfall: "",
};

const fieldConfig = [
  { name: "nitrogen", label: "Nitrogen (N)", placeholder: "e.g., 90", unit: "mg/kg", min: 0, max: 140, step: "any" },
  { name: "phosphorus", label: "Phosphorus (P)", placeholder: "e.g., 42", unit: "mg/kg", min: 5, max: 145, step: "any" },
  { name: "potassium", label: "Potassium (K)", placeholder: "e.g., 43", unit: "mg/kg", min: 5, max: 205, step: "any" },
  { name: "temperature", label: "Temperature", placeholder: "e.g., 25", unit: "°C", min: 8, max: 45, step: "any" },
  { name: "humidity", label: "Humidity", placeholder: "e.g., 80", unit: "%", min: 14, max: 100, step: "any" },
  { name: "ph", label: "Soil pH", placeholder: "e.g., 6.5", unit: "pH", min: 3, max: 10, step: 0.1 },
  { name: "rainfall", label: "Rainfall", placeholder: "e.g., 200", unit: "mm", min: 20, max: 300, step: "any" },
];

export default function CropRecommendation() {
  const [form, setForm] = useState(initialForm);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSlider = (name, value) => {
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const payload = {};
      for (const key of Object.keys(form)) {
        payload[key] = parseFloat(form[key]);
        if (isNaN(payload[key])) {
          toast.error(`Please enter a valid number for ${key}`);
          setLoading(false);
          return;
        }
      }

      const res = await API.post("/crop", payload);
      setResult(res.data);
      toast.success("Prediction complete!");
    } catch (err) {
      toast.error(err.response?.data?.error || "Prediction failed");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm(initialForm);
    setResult(null);
  };

  const fetchWeather = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }
    
    const loadingToast = toast.loading("Getting your location and weather...");
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          
          // Open-Meteo is a free API that doesn't require an API key
          const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,precipitation`);
          const data = await res.json();
          
          if (data && data.current) {
            // Rough estimation for rainfall if current precipitation is 0, since the model expects a typical seasonal rainfall value
            const estRainfall = data.current.precipitation > 0 ? (data.current.precipitation * 30 + 50) : 120;
            
            setForm((prev) => ({
              ...prev,
              temperature: data.current.temperature_2m.toString(),
              humidity: data.current.relative_humidity_2m.toString(),
              rainfall: estRainfall.toString()
            }));
            toast.success("Weather data auto-filled!", { id: loadingToast });
          }
        } catch (error) {
          toast.error("Failed to fetch weather data", { id: loadingToast });
        }
      },
      (error) => {
        toast.error("Could not get your location. Please allow location access.", { id: loadingToast });
      }
    );
  };

  return (
    <div className="crop-page page-wrapper">
      <div className="container">
        <div className="page-header fade-in">
          <h1 className="section-title">
            <FlaskConical size={32} style={{ display: "inline", verticalAlign: "middle" }} /> Crop Recommendation
          </h1>
          <p className="section-subtitle">
            Enter your soil and environmental data below — our Random Forest model
            will recommend the most suitable crop.
          </p>
        </div>

        <div className="crop-layout">
          {/* ─── Form ─── */}
          <form onSubmit={handleSubmit} className="glass-card crop-form slide-up">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--color-border)', paddingBottom: '14px' }}>
              <h2 className="form-title" style={{ borderBottom: 'none', margin: 0, padding: 0 }}>Soil & Weather Parameters</h2>
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={fetchWeather}
                style={{ fontSize: '0.85rem', padding: '6px 12px' }}
              >
                <MapPin size={16} /> Auto-fill Weather
              </button>
            </div>

            <div className="form-grid">
              {fieldConfig.map((field) => (
                <div className="form-group" key={field.name}>
                  <label className="input-label">
                    {field.label} <span className="unit-badge">{field.unit}</span>
                  </label>
                  <input
                    type="number"
                    name={field.name}
                    className="input-field"
                    placeholder={field.placeholder}
                    value={form[field.name]}
                    onChange={handleChange}
                    min={field.min}
                    max={field.max}
                    step={field.step || 1}
                    required
                  />
                  <input
                    type="range"
                    className="slider"
                    min={field.min}
                    max={field.max}
                    step={field.step || 1}
                    value={form[field.name] || field.min}
                    onChange={(e) => handleSlider(field.name, e.target.value)}
                  />
                </div>
              ))}
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner" style={{ width: 20, height: 20 }}></span>
                    Predicting...
                  </>
                ) : (
                  <>
                    <Sprout size={20} />
                    Predict Crop
                  </>
                )}
              </button>
              <button type="button" className="btn btn-secondary" onClick={handleReset}>
                <RotateCcw size={16} />
                Reset
              </button>
            </div>
          </form>

          {/* ─── Result ─── */}
          {result && (
            <div className="glass-card result-card fade-in">
              <div className="result-emoji">🌾</div>
              <h2 className="result-crop">{result.crop.charAt(0).toUpperCase() + result.crop.slice(1)}</h2>
              <p className="result-label">Recommended Crop</p>

              <div className="result-confidence">
                <div className="confidence-header">
                  <span>Confidence</span>
                  <span className="confidence-value">{Math.round(result.confidence * 100)}%</span>
                </div>
                <div className="confidence-bar">
                  <div
                    className="confidence-fill"
                    style={{ width: `${result.confidence * 100}%` }}
                  ></div>
                </div>
              </div>

              {result.explanation && (
                <div className="result-explanation">
                  <p>{result.explanation}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
