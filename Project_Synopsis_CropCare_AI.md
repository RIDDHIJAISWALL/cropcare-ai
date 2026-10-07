# CropCare AI - Project Walkthrough & Synopsis

## 1. Introduction
**CropCare AI** is a comprehensive agricultural assistant designed to help farmers make data-driven decisions. The platform leverages Machine Learning (ML) to provide personalized crop recommendations based on soil metrics and environmental conditions, and uses advanced Generative AI to detect plant diseases from leaf images. It consists of a modern web interface, a robust backend API, and a dedicated microservice for ML predictions.

## 2. Technology Stack
- **Frontend**: React.js, Vite, React Router, custom CSS for UI, `lucide-react` for icons, `react-hot-toast` for notifications.
- **Backend**: Node.js, Express.js, Prisma ORM, SQLite (dev) / PostgreSQL (prod).
- **Machine Learning Service**: Python, FastAPI, scikit-learn (Random Forest), TensorFlow, Google Gemini API for disease analysis.
- **Authentication**: JSON Web Tokens (JWT) & bcryptjs.

## 3. Core Features Developed
1. **User Authentication & Authorization**: Secure login, registration, and role-based access control (Farmers vs. Admins).
2. **Crop Recommendation Engine**: Analyzes NPK (Nitrogen, Phosphorus, Potassium), pH, temperature, humidity, and rainfall to recommend the most suitable crop (using an ML model with heuristic fallbacks).
3. **Plant Disease Detection**: Users can upload a photo of a sick plant leaf. The system identifies the plant, detects the disease, and returns a confidence score along with actionable treatment suggestions.
4. **User Dashboard**: A personalized dashboard for farmers to track their past predictions and historical data.

---

## 4. System Flowchart

The flowchart below illustrates how a user interacts with the system, specifically detailing the paths for Crop Recommendation and Disease Detection.

```mermaid
flowchart TD
    A([User visits CropCare AI]) --> B{Is User Logged In?}
    B -- No --> C[Login / Register Page]
    C --> D[Authenticate via Node.js Backend]
    D --> B
    B -- Yes --> E[Dashboard / Home]
    
    E --> F[Select Feature]
    
    F -->|Crop Recommendation| G[Enter Soil & Weather Data: N, P, K, pH, Temp, etc.]
    G --> H[Frontend sends request to Node Backend]
    H --> I[Backend forwards data to Python ML Service]
    I --> J[ML Model predicts best crop]
    J --> K[Backend saves prediction to DB]
    K --> L([Display Crop & Confidence to User])
    
    F -->|Disease Detection| M[Upload Leaf Image Base64]
    M --> N[Frontend sends request to Node Backend]
    N --> O[Backend forwards image to Python ML Service]
    O --> P[Gemini API analyzes image]
    P --> Q[Backend saves prediction to DB]
    Q --> R([Display Disease & Treatment to User])
```

---

## 5. Entity Relationship (ER) Diagram

The ER diagram illustrates the database architecture built with Prisma ORM.

```mermaid
erDiagram
    USER {
        int id PK
        string name
        string email
        string password
        string role "farmer or admin"
        string location
        datetime createdAt
    }
    
    CROP_PREDICTION {
        int id PK
        int userId FK
        float nitrogen
        float phosphorus
        float potassium
        float temperature
        float humidity
        float ph
        float rainfall
        string predictedCrop
        float confidence
        datetime createdAt
    }
    
    DISEASE_PREDICTION {
        int id PK
        int userId FK
        string plantName
        string imageUrl
        string predictedDisease
        float confidence
        datetime createdAt
    }
    
    CROP {
        int id PK
        string cropName
        string description
        string soilRequirements
        string waterRequirements
        string season
    }
    
    DISEASE {
        int id PK
        string plantName
        string diseaseName
        string symptoms
        string prevention
    }

    USER ||--o{ CROP_PREDICTION : makes
    USER ||--o{ DISEASE_PREDICTION : submits
```

---

## 6. Architecture Overview
The system is built on a microservices-inspired architecture:
1. **Frontend App**: Communicates exclusively with the Node.js backend.
2. **Node.js Backend**: Acts as an API Gateway and handles business logic, database transactions, and user authentication.
3. **Python ML Service**: An isolated, compute-heavy FastAPI service that runs the scikit-learn random forest models and interfaces with the Gemini AI model. The Node.js backend communicates with this service via internal HTTP requests.
