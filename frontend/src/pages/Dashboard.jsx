import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { LayoutDashboard, FlaskConical, Leaf, Clock } from "lucide-react";
import API from "../services/api";
import toast from "react-hot-toast";
import "./Dashboard.css";

export default function Dashboard() {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/dashboard/history")
      .then((res) => setHistory(res.data.history))
      .catch(() => toast.error("Failed to load dashboard history"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="page-wrapper" style={{ display: "flex", justifyContent: "center", paddingTop: 80 }}>
        <div className="spinner"></div>
      </div>
    );
  }

  const cropCount = history.filter(h => h.type === 'crop').length;
  const diseaseCount = history.filter(h => h.type === 'disease').length;

  return (
    <div className="dashboard-page page-wrapper">
      <div className="container">
        <div className="dash-header fade-in">
          <h1 className="section-title">
            <LayoutDashboard size={32} style={{ display: "inline", verticalAlign: "middle" }} /> Dashboard
          </h1>
          <p className="section-subtitle">Welcome back, {user?.name} 👋</p>
        </div>

        {/* ─── Stats ─── */}
        <div className="grid-3 dash-stats slide-up">
          <div className="glass-card stat-card">
            <FlaskConical size={28} style={{ color: "var(--color-primary-light)", marginBottom: 8 }} />
            <div className="stat-value">{cropCount}</div>
            <div className="stat-label">Crop Predictions</div>
          </div>
          <div className="glass-card stat-card">
            <Leaf size={28} style={{ color: "var(--color-secondary)", marginBottom: 8 }} />
            <div className="stat-value">{diseaseCount}</div>
            <div className="stat-label">Disease Checks</div>
          </div>
          <div className="glass-card stat-card">
            <Clock size={28} style={{ color: "var(--color-accent)", marginBottom: 8 }} />
            <div className="stat-value">
              {history.length}
            </div>
            <div className="stat-label">Total Analyses</div>
          </div>
        </div>

        {/* ─── Unified History ─── */}
        <div className="glass-card dash-section fade-in" style={{ animationDelay: "0.2s" }}>
          <h2 className="dash-section-title">
            <Clock size={20} /> Your Prediction History
          </h2>
          {history.length === 0 ? (
            <p className="empty-text">No predictions yet. Try predicting a crop or disease!</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Input Details</th>
                    <th>Result</th>
                    <th>Confidence</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((item) => (
                    <tr key={item.id}>
                      <td>
                        {item.type === 'crop' ? (
                          <span style={{ color: 'var(--color-primary-light)', fontWeight: 'bold' }}><FlaskConical size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }}/> Crop</span>
                        ) : (
                          <span style={{ color: 'var(--color-secondary)', fontWeight: 'bold' }}><Leaf size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }}/> Disease</span>
                        )}
                      </td>
                      <td style={{ fontSize: '0.9rem', color: 'var(--color-text-dim)' }}>
                        {item.type === 'crop' ? item.details : `Plant: ${item.plantName}`}
                      </td>
                      <td style={{ fontWeight: 600, textTransform: "capitalize" }}>
                        {item.type === 'disease' && item.result === 'Healthy' ? (
                          <span className="badge badge-success">Healthy ✅</span>
                        ) : (
                          item.result
                        )}
                      </td>
                      <td>
                        <span className="badge badge-success">{Math.round(item.confidenceScore * 100) || 95}%</span>
                      </td>
                      <td style={{ color: "var(--color-text-dim)" }}>
                        {new Date(item.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
