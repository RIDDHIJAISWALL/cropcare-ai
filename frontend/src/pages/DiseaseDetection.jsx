import { useState, useRef } from "react";
import { Leaf, Upload, X, RotateCcw, AlertCircle, CheckCircle } from "lucide-react";
import API from "../services/api";
import toast from "react-hot-toast";
import "./DiseaseDetection.css";

export default function DiseaseDetection() {
  const [file, setFile] = useState(null);
  const [plantName, setPlantName] = useState("");
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);

  const handleFile = (f) => {
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setResult(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else setDragActive(false);
  };

  const removeImage = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
  };

  const fileToBase64 = (f) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(f);
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = (error) => reject(error);
  });

  const handleSubmit = async () => {
    if (!plantName) return toast.error("Please enter the Plant Name");
    if (!file) return toast.error("Please upload a leaf image");
    setLoading(true);
    setResult(null);

    try {
      const base64Image = await fileToBase64(file);

      const res = await API.post("/disease", {
        image: base64Image,
        plantName: plantName
      });

      let parsedSuggestions = [];
      if (res.data.remedies) {
        if (Array.isArray(res.data.remedies)) {
          parsedSuggestions = res.data.remedies;
        } else {
          parsedSuggestions = res.data.remedies
            .split(/(?:\n|\d+\.\s+)/)
            .map(s => s.trim())
            .filter(Boolean);
        }
      }

      setResult({
         plant: res.data.plantName,
         disease: res.data.disease,
         confidence: res.data.confidenceScore,
         suggestions: parsedSuggestions
      });
      toast.success("Analysis complete!");
    } catch (err) {
      toast.error(err.response?.data?.error || "Detection failed");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    removeImage();
    setResult(null);
  };

  return (
    <div className="disease-page page-wrapper">
      <div className="container">
        <div className="page-header fade-in">
          <h1 className="section-title">
            <Leaf size={32} style={{ display: "inline", verticalAlign: "middle" }} /> Disease Detection
          </h1>
          <p className="section-subtitle">
            Upload a photograph of a plant leaf — our AI model will identify potential
            diseases and provide guidance.
          </p>
        </div>

        <div className="disease-layout">
          {/* ─── Upload Zone ─── */}
          <div className="glass-card upload-section slide-up">
            <h2 className="form-title">Upload Leaf Image</h2>

            <div className="form-group" style={{ marginBottom: "1rem", textAlign: "left" }}>
              <label className="input-label">Plant Name</label>
              <input 
                type="text" 
                className="input-field" 
                placeholder="e.g. Tomato, Potato, Rose" 
                value={plantName}
                onChange={(e) => setPlantName(e.target.value)}
                style={{ paddingLeft: "1rem" }}
              />
            </div>

            {!preview ? (
              <div
                className={`drop-zone ${dragActive ? "active" : ""}`}
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
              >
                <Upload size={48} className="drop-icon" style={{ color: "var(--color-primary-light)" }} />
                <p style={{ fontWeight: 600, marginBottom: 4 }}>Drag & Drop your leaf image here</p>
                <p style={{ fontSize: "0.85rem", color: "var(--color-text-dim)" }}>
                  or click to browse — PNG, JPG, WEBP
                </p>
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => handleFile(e.target.files[0])}
                />
              </div>
            ) : (
              <div className="preview-container">
                <img src={preview} alt="Leaf Preview" className="preview-image" />
                <button className="preview-remove" onClick={removeImage}>
                  <X size={18} />
                </button>
              </div>
            )}

            <div className="form-actions" style={{ marginTop: 24 }}>
              <button
                className="btn btn-primary btn-lg"
                onClick={handleSubmit}
                disabled={!file || loading}
              >
                {loading ? (
                  <>
                    <span className="spinner" style={{ width: 20, height: 20 }}></span>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Leaf size={20} />
                    Analyze Image
                  </>
                )}
              </button>
              <button className="btn btn-secondary" onClick={handleReset}>
                <RotateCcw size={16} />
                Reset
              </button>
            </div>
          </div>

          {/* ─── Result ─── */}
          {result && (
            <div className="glass-card disease-result fade-in">
              <div className="disease-result-header">
                {result.disease === "Healthy" ? (
                  <CheckCircle size={40} style={{ color: "var(--color-success)" }} />
                ) : (
                  <AlertCircle size={40} style={{ color: "var(--color-warning)" }} />
                )}
                <div>
                  <h3 className="disease-plant">{result.plant}</h3>
                  <h2 className="disease-name">
                    {result.disease === "Healthy" ? "Healthy ✅" : result.disease}
                  </h2>
                </div>
              </div>

              <div className="result-confidence" style={{ maxWidth: "100%" }}>
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

              {result.suggestions && result.suggestions.length > 0 && (
                <div className="disease-suggestions">
                  <h4>General Guidance</h4>
                  <ul>
                    {result.suggestions.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
              )}

              {result.imageUrl && (
                <div className="disease-uploaded-img">
                  <img src={result.imageUrl} alt="Analyzed leaf" />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
