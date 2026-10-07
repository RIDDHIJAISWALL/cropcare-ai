import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <h3 className="footer-title">CropCare AI</h3>
            <p>Helping farmers make data-driven decisions through machine learning and image analysis.</p>
          </div>

          <div className="footer-nav">
            <div className="footer-col">
              <h4>Tools</h4>
              <Link to="/crop-recommendation">Crop Recommendation</Link>
              <Link to="/disease-detection">Disease Detection</Link>
              <Link to="/dashboard">My Dashboard</Link>
            </div>
            <div className="footer-col">
              <h4>Get Started</h4>
              <Link to="/register">Create Account</Link>
              <Link to="/login">Sign In</Link>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>&copy; {new Date().getFullYear()} CropCare AI</span>
          <span className="footer-dot">·</span>
          <span>Built for smarter agriculture</span>
        </div>
      </div>
    </footer>
  );
}
