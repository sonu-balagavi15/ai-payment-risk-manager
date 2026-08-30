# AI Payment Risk Manager 💳🛡️

An AI-powered payment security and fraud-risk analysis system built with **React, FastAPI, SQLAlchemy, and Machine Learning**. The application analyzes payment transactions, calculates fraud risk, and provides a decision such as **Approved, Review, or Blocked**.

## 🚀 Live Demo

**Frontend:**
https://frontend-flame-nine-49.vercel.app/

**Backend API:**
https://ai-payment-risk-manager-0jyv.onrender.com/

**API Documentation (Swagger):**
https://ai-payment-risk-manager-0jyv.onrender.com/docs

---

## ✨ Features

* 🔐 User Registration and Login
* 💳 Payment Transaction Risk Analysis
* 🤖 Machine Learning-based Fraud Prediction
* 📊 Fraud Probability and Risk Score
* 🟢 Low / 🟡 Medium / 🔴 High Risk Classification
* ✅ Approved / ⚠️ Review / 🚫 Blocked Decisions
* 📋 Transaction History
* 🔎 Transaction Search and Filtering
* 📈 Dashboard with Risk Distribution
* 🔒 JWT-based Authentication
* 🗄️ SQLAlchemy Database Integration
* 📡 REST API using FastAPI
* 🌐 Responsive React Frontend

---

## 🛠️ Tech Stack

### Frontend

* React
* Vite
* JavaScript
* Axios
* CSS

### Backend

* Python
* FastAPI
* Uvicorn
* SQLAlchemy
* Pydantic
* JWT Authentication
* Passlib
* Bcrypt

### Machine Learning

* Scikit-learn
* Pandas
* NumPy
* Joblib

### Deployment

* **Frontend:** Vercel
* **Backend:** Render
* **Source Code:** GitHub

---

## 🏗️ Project Architecture

```text
                 ┌──────────────────────┐
                 │       GitHub         │
                 │    Source Code       │
                 └──────────┬───────────┘
                            │
             ┌──────────────┴──────────────┐
             │                             │
             ▼                             ▼
     ┌───────────────┐             ┌────────────────┐
     │    Vercel     │             │     Render     │
     │ React + Vite  │             │ FastAPI        │
     │   Frontend    │────────────▶│ Backend API    │
     └───────────────┘             └───────┬────────┘
                                           │
                              ┌────────────┴────────────┐
                              │                         │
                              ▼                         ▼
                       ┌─────────────┐          ┌─────────────┐
                       │ ML Model    │          │  Database   │
                       │ Scikit-Learn│          │ SQLAlchemy  │
                       └─────────────┘          └─────────────┘
```

---

## 📂 Project Structure

```text
ai-payment-risk-manager/
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── database.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   ├── auth.py
│   │   ├── crud.py
│   │   └── ...
│   │
│   ├── requirements.txt
│   └── ...
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── RiskAnalysis.jsx
│   │   │   └── Transactions.jsx
│   │   │
│   │   ├── api.js
│   │   ├── App.jsx
│   │   └── ...
│   │
│   ├── package.json
│   └── ...
│
└── README.md
```

---

## 🔍 Risk Analysis

The system evaluates transaction-related features such as:

* Transaction amount
* Transaction frequency
* Account age
* New device
* Foreign transaction
* Location mismatch

The system generates:

```text
Fraud Probability
        ↓
Risk Score
        ↓
Risk Level
        ↓
Decision
```

Possible decisions:

| Risk Level | Decision |
| ---------- | -------- |
| Low        | Approved |
| Medium     | Review   |
| High       | Blocked  |

---

## 🔐 Authentication

The application provides secure authentication using:

* User registration
* Login
* Password hashing
* JWT access tokens
* Protected API endpoints

Passwords are never stored as plain text.

---

## 📊 Dashboard

The dashboard provides an overview of analyzed payment activity, including:

* Total transactions
* Approved transactions
* Transactions requiring review
* Blocked transactions
* Risk distribution
* Recent transactions

---

## 🔌 API

The backend is built using FastAPI.

### Main API functionality

```text
POST /register
POST /login
POST /transactions/analyze
GET  /transactions
GET  /transactions/{id}
```

Interactive API documentation is available through Swagger:

https://ai-payment-risk-manager-0jyv.onrender.com/docs

---

## 💻 Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/sonu-balagavi15/ai-payment-risk-manager.git

cd ai-payment-risk-manager
```

### 2. Backend Setup

```bash
cd backend

python -m venv venv
```

Windows:

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run the backend:

```bash
uvicorn app.main:app --reload
```

Backend will run at:

```text
http://127.0.0.1:8000
```

Swagger documentation:

```text
http://127.0.0.1:8000/docs
```

---

### 3. Frontend Setup

Open another terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Frontend will normally run at:

```text
http://localhost:5173
```

---

## 🌐 Deployment

### Frontend

The React/Vite frontend is deployed using **Vercel**.

### Backend

The FastAPI backend is deployed using **Render**.

The frontend communicates with the deployed backend through the FastAPI REST API.

---

## 🧪 Example Risk Test

Example low-risk transaction:

```text
Amount: 500
Transaction Frequency: 2
Account Age: 1000
New Device: OFF
Foreign Transaction: OFF
Location Mismatch: OFF
```

The system analyzes these inputs and returns the corresponding:

```text
Fraud Probability
Risk Score
Risk Level
Decision
```

---

## 🎯 Project Goals

The main objective of this project is to demonstrate how **Artificial Intelligence, Machine Learning, and Full-Stack Development** can be combined to build a payment-security application.

The project focuses on:

* Fraud detection
* Payment risk assessment
* Secure authentication
* Transaction monitoring
* Machine Learning integration
* REST API development
* Full-stack application deployment

---

## 🔮 Future Enhancements

* Real-time fraud detection
* Advanced ML models
* Explainable AI for risk decisions
* Email/SMS fraud alerts
* Admin dashboard
* Real-time transaction monitoring
* Model performance monitoring
* Cloud database integration
* Improved fraud detection using historical transaction data

---

## 👩‍💻 Author

**Sonu Balagavi**

Computer Science Engineering Student

GitHub:
https://github.com/sonu-balagavi15

LinkedIn:
https://www.linkedin.com/in/sonu-balagavi

---

## ⭐ Support

If you find this project useful, consider giving the repository a ⭐ on GitHub.
