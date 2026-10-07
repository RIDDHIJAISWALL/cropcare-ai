import { Link } from "react-router-dom";
import {
  Leaf,
  FlaskConical,
  BarChart3,
  ArrowRight,
  CloudSun,
  Calendar,
  Users,
  BookOpen,
  ShieldCheck,
  TrendingUp,
  Droplets,
  Thermometer,
} from "lucide-react";
import "./Home.css";

export default function Home() {
  return (
    <div className="home-page">
      {/* ─── Hero with Background Image ─── */}
      <section className="hero">
        <div className="hero-overlay"></div>
        <div className="hero-particles">
          <span className="particle"></span>
          <span className="particle"></span>
          <span className="particle"></span>
          <span className="particle"></span>
          <span className="particle"></span>
        </div>
        <div className="container hero-content fade-in">
          <div className="hero-badge">
            <Leaf size={14} />
            <span>AI-Powered Agriculture</span>
          </div>
          <h1 className="hero-title">
            Smarter Farming,<br />Healthier Crops.
          </h1>
          <p className="hero-subtitle">
            Harness machine learning to get instant crop recommendations,
            detect plant diseases from photos, and track your farm's health
            — all in one powerful platform.
          </p>
          <div className="hero-actions">
            <Link to="/crop-recommendation" className="btn btn-hero-primary btn-lg">
              Get Crop Advice
              <ArrowRight size={16} />
            </Link>
            <Link to="/disease-detection" className="btn btn-hero-secondary btn-lg">
              Check Plant Health
            </Link>
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <span className="hero-stat-value">22+</span>
              <span className="hero-stat-label">Crops Supported</span>
            </div>
            <div className="hero-stat-divider"></div>
            <div className="hero-stat">
              <span className="hero-stat-value">38+</span>
              <span className="hero-stat-label">Disease Classes</span>
            </div>
            <div className="hero-stat-divider"></div>
            <div className="hero-stat">
              <span className="hero-stat-value">95%</span>
              <span className="hero-stat-label">Accuracy</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Core Features ─── */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">Core Features</span>
            <h2 className="section-title">What you can do</h2>
            <p className="section-subtitle">Powerful AI tools built for modern agriculture.</p>
          </div>

          <div className="grid-3 features-grid">
            <div className="glass-card feature-card slide-up" style={{ animationDelay: "0.05s" }}>
              <div className="feature-icon icon-green">
                <FlaskConical size={22} />
              </div>
              <h3>Crop Recommendation</h3>
              <p>
                Share your soil nutrients (N, P, K), pH, temperature, humidity, and
                rainfall. The model suggests which crop fits best.
              </p>
              <Link to="/crop-recommendation" className="feature-link">
                Try it <ArrowRight size={14} />
              </Link>
            </div>

            <div className="glass-card feature-card slide-up" style={{ animationDelay: "0.15s" }}>
              <div className="feature-icon icon-teal">
                <Leaf size={22} />
              </div>
              <h3>Disease Detection</h3>
              <p>
                Upload a photo of a leaf. The image model identifies potential
                diseases and gives you a confidence score.
              </p>
              <Link to="/disease-detection" className="feature-link">
                Try it <ArrowRight size={14} />
              </Link>
            </div>

            <div className="glass-card feature-card slide-up" style={{ animationDelay: "0.25s" }}>
              <div className="feature-icon icon-warm">
                <BarChart3 size={22} />
              </div>
              <h3>Track Everything</h3>
              <p>
                Save every prediction to your dashboard. Review past results and
                keep a record of what worked.
              </p>
              <Link to="/dashboard" className="feature-link">
                View Dashboard <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Additional Features ─── */}
      <section className="extra-features-section">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">More Tools</span>
            <h2 className="section-title">Everything your farm needs</h2>
            <p className="section-subtitle">Beyond predictions — a complete farming companion.</p>
          </div>

          <div className="grid-4 extra-grid">
            <div className="extra-card slide-up" style={{ animationDelay: "0.05s" }}>
              <div className="extra-icon">
                <CloudSun size={24} />
              </div>
              <h4>Weather Insights</h4>
              <p>Get real-time weather data to make timely decisions for your crops.</p>
            </div>

            <div className="extra-card slide-up" style={{ animationDelay: "0.1s" }}>
              <div className="extra-icon">
                <Calendar size={24} />
              </div>
              <h4>Crop Calendar</h4>
              <p>Know the best planting and harvesting seasons for each crop.</p>
            </div>

            <div className="extra-card slide-up" style={{ animationDelay: "0.15s" }}>
              <div className="extra-icon">
                <Droplets size={24} />
              </div>
              <h4>Irrigation Guide</h4>
              <p>Smart watering suggestions based on soil moisture and weather.</p>
            </div>

            <div className="extra-card slide-up" style={{ animationDelay: "0.2s" }}>
              <div className="extra-icon">
                <Thermometer size={24} />
              </div>
              <h4>Soil Health Monitor</h4>
              <p>Track your soil health over time with nutrient trend analysis.</p>
            </div>

            <div className="extra-card slide-up" style={{ animationDelay: "0.25s" }}>
              <div className="extra-icon">
                <ShieldCheck size={24} />
              </div>
              <h4>Disease Prevention</h4>
              <p>Proactive tips and alerts to protect your crops before problems arise.</p>
            </div>

            <div className="extra-card slide-up" style={{ animationDelay: "0.3s" }}>
              <div className="extra-icon">
                <TrendingUp size={24} />
              </div>
              <h4>Yield Estimator</h4>
              <p>Estimate your expected yield based on current conditions and crop type.</p>
            </div>

            <div className="extra-card slide-up" style={{ animationDelay: "0.35s" }}>
              <div className="extra-icon">
                <BookOpen size={24} />
              </div>
              <h4>Farming Knowledge</h4>
              <p>Access a library of best practices, tips, and techniques for better farming.</p>
            </div>

            <div className="extra-card slide-up" style={{ animationDelay: "0.4s" }}>
              <div className="extra-icon">
                <Users size={24} />
              </div>
              <h4>Community</h4>
              <p>Connect with other farmers, share experiences, and learn together.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── How it works ─── */}
      <section className="how-section">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">Simple Process</span>
            <h2 className="section-title">How it works</h2>
            <p className="section-subtitle">Three steps. No complicated setup.</p>
          </div>

          <div className="steps-list">
            <div className="step fade-in">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Enter your data</h3>
                <p>Fill in soil parameters or upload a leaf photo.</p>
              </div>
            </div>
            <div className="step-connector"></div>
            <div className="step fade-in" style={{ animationDelay: "0.1s" }}>
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>The model runs</h3>
                <p>Our trained ML model processes the input and generates a prediction.</p>
              </div>
            </div>
            <div className="step-connector"></div>
            <div className="step fade-in" style={{ animationDelay: "0.2s" }}>
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>See your results</h3>
                <p>Get a recommendation with a confidence score, saved to your history.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Testimonials / Trust ─── */}
      <section className="trust-section">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">Trusted</span>
            <h2 className="section-title">Why farmers love CropCare AI</h2>
          </div>

          <div className="grid-3 trust-grid">
            <div className="trust-card slide-up" style={{ animationDelay: "0.05s" }}>
              <div className="trust-quote">"</div>
              <p>The crop recommendation feature saved me from planting the wrong crop this season. Incredibly accurate!</p>
              <div className="trust-author">
                <div className="trust-avatar">R</div>
                <div>
                  <strong>Rajesh Kumar</strong>
                  <span>Wheat Farmer, Punjab</span>
                </div>
              </div>
            </div>

            <div className="trust-card slide-up" style={{ animationDelay: "0.15s" }}>
              <div className="trust-quote">"</div>
              <p>I caught a leaf blight early thanks to the disease detection. My entire harvest was saved!</p>
              <div className="trust-author">
                <div className="trust-avatar">P</div>
                <div>
                  <strong>Priya Sharma</strong>
                  <span>Rice Farmer, Maharashtra</span>
                </div>
              </div>
            </div>

            <div className="trust-card slide-up" style={{ animationDelay: "0.25s" }}>
              <div className="trust-quote">"</div>
              <p>So easy to use! I just take a picture and the app tells me everything. Even my father uses it now.</p>
              <div className="trust-author">
                <div className="trust-avatar">A</div>
                <div>
                  <strong>Amit Patel</strong>
                  <span>Cotton Farmer, Gujarat</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-card">
            <div className="cta-glow"></div>
            <Leaf size={40} className="cta-icon" />
            <h2>Ready to grow smarter?</h2>
            <p>Create a free account and run your first prediction in under a minute.</p>
            <div className="cta-actions">
              <Link to="/register" className="btn btn-primary btn-lg">
                Create Account <ArrowRight size={16} />
              </Link>
              <Link to="/login" className="btn btn-cta-secondary btn-lg">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
