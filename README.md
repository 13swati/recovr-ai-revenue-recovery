# Recovr — AI Revenue Recovery System

> An AI-powered payment failure detection and intelligent revenue recovery platform that analyzes failed payments, predicts recovery probability, evaluates customer behavior, and recommends the most suitable recovery action.

## 🚀 Overview

**Recovr** is an intelligent revenue recovery system designed to help businesses recover failed payments through data-driven decision making.

Instead of applying the same recovery strategy to every failed payment, Recovr evaluates multiple factors such as:

* Payment failure reason
* Customer payment history
* Customer reliability
* Payment attempts
* Subscription information
* Recovery probability
* Recovery score
* Retry limits
* Policy rules

The system then determines the most appropriate recovery strategy, such as:

* 🔄 Retry the payment
* 💳 Generate a payment link
* 📞 Contact the customer
* ⚠️ Escalate for manual review
* ✓ Take no action

---

## 🎯 Problem Statement

Failed payments can lead to significant revenue loss for businesses.

A traditional payment recovery system may repeatedly retry failed payments without considering:

* Why the payment failed
* How valuable the customer is
* Previous payment behavior
* Number of previous attempts
* Probability of successful recovery
* Business recovery policies

Recovr addresses this problem by combining **Machine Learning, customer intelligence, rule-based policy decisions, and automated recovery actions** into a single workflow.

---

## ✨ Key Features

### 🤖 AI-Powered Recovery Prediction

The system uses a Machine Learning model to estimate the probability that a failed payment can be successfully recovered.

Example:

```text
Recovery Probability: 27%
Predicted Success: No
Risk Level: High
```

### 👤 Customer Intelligence

Recovr analyzes customer payment behavior and generates insights including:

* Customer value
* Reliability
* Total payments
* Successful payments
* Failed payments
* Success rate
* Subscription plan

### 📊 Recovery Scoring

Each failed payment receives a recovery score that helps prioritize recovery efforts.

Example:

```text
Recovery Score: 70
Priority: HIGH
```

### 🧠 Intelligent Recovery Engine

The recovery engine evaluates the payment context and recommends the most appropriate action.

Example:

```text
Recommended Action: Send Payment Link
Reason: Retry limit reached for insufficient funds
Confidence: 92%
```

### 🛡️ Policy Engine

Before executing an action, the system checks whether the recommended action is allowed by the configured recovery policies.

```text
Decision: ALLOWED
```

This provides an additional control layer between AI recommendations and action execution.

### ⚡ Recovery Action Executor

Approved recovery actions can be executed through the action executor.

Currently supported recovery simulations include:

* Payment link generation
* Payment retry simulation
* Manual escalation
* Unknown-action handling
* Policy-blocked actions

### 📜 Recovery History

Every recovery action is persisted and can be viewed through the Recovery History section.

The system records:

* Action type
* Confidence
* Policy decision
* Execution status
* Outcome
* Timestamp

---

# 🏗️ System Architecture

```text
                    ┌───────────────────────┐
                    │     React Frontend    │
                    │       Dashboard       │
                    └───────────┬───────────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │      FastAPI API      │
                    │       Backend         │
                    └───────────┬───────────┘
                                │
             ┌──────────────────┼──────────────────┐
             │                  │                  │
             ▼                  ▼                  ▼
      Failure Detector    ML Prediction    Customer Intelligence
             │                  │                  │
             └──────────────────┼──────────────────┘
                                ▼
                    ┌───────────────────────┐
                    │   Recovery Scoring    │
                    │        Engine         │
                    └───────────┬───────────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │   Recovery Engine     │
                    │ Recommendation Logic  │
                    └───────────┬───────────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │    Policy Engine      │
                    │  Allow / Block Action │
                    └───────────┬───────────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │   Action Executor     │
                    │ Recovery Execution    │
                    └───────────┬───────────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │      PostgreSQL       │
                    │       Database        │
                    └───────────────────────┘
```

---

# 🔄 Recovery Workflow

```text
Failed Payment
      │
      ▼
Failure Detection
      │
      ▼
Customer Intelligence
      │
      ▼
ML Recovery Prediction
      │
      ▼
Recovery Score
      │
      ▼
Recovery Recommendation
      │
      ▼
Policy Validation
      │
      ├── BLOCKED ──► No Action
      │
      ▼
Action Executor
      │
      ▼
Recovery Result
      │
      ▼
Recovery History
```

---

# 🛠️ Tech Stack

## Backend

* Python
* FastAPI
* SQLAlchemy
* PostgreSQL
* Uvicorn

## Machine Learning

* Scikit-learn
* Pandas
* NumPy
* Joblib
* Machine Learning classification model

## Frontend

* React
* JavaScript
* Vite
* HTML
* CSS

## Development

* Git
* GitHub
* VS Code
* REST APIs

---

# 📂 Project Structure

```text
recovr-ai-revenue-recovery/
│
├── backend/
│   ├── app/
│   │   ├── ml/
│   │   │   ├── feature_engineering.py
│   │   │   ├── predictor.py
│   │   │   ├── train_model.py
│   │   │   ├── training_data.csv
│   │   │   └── recovery_model.pkl
│   │   │
│   │   ├── models/
│   │   │   ├── customer.py
│   │   │   ├── payment.py
│   │   │   ├── payment_attempt.py
│   │   │   ├── recovery_action.py
│   │   │   └── subscription.py
│   │   │
│   │   ├── routes/
│   │   │   └── payments.py
│   │   │
│   │   ├── services/
│   │   │   ├── action_executor.py
│   │   │   ├── ai_agent.py
│   │   │   ├── customer_intelligence.py
│   │   │   ├── failure_detector.py
│   │   │   ├── policy_engine.py
│   │   │   ├── recovery_engine.py
│   │   │   └── scoring_engine.py
│   │   │
│   │   ├── database.py
│   │   └── main.py
│   │
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── Payments.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

---

# 🔌 API Endpoints

| Method | Endpoint                                  | Description                  |
| ------ | ----------------------------------------- | ---------------------------- |
| GET    | `/payments/`                              | Get all payments             |
| GET    | `/payments/{payment_id}`                  | Get a single payment         |
| GET    | `/payments/{payment_id}/context`          | Get complete payment context |
| POST   | `/payments/{payment_id}/analyze`          | Analyze payment recovery     |
| POST   | `/payments/{payment_id}/recover`          | Execute recommended recovery |
| GET    | `/payments/{payment_id}/recovery-history` | Get recovery history         |

---

# ⚙️ Local Setup

## 1. Clone the repository

```bash
git clone https://github.com/13swati/recovr-ai-revenue-recovery.git
cd recovr-ai-revenue-recovery
```

## 2. Backend Setup

Create a virtual environment:

```bash
python -m venv .venv
```

Activate it on Windows:

```powershell
.venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r backend/requirements.txt
```

## 3. Configure PostgreSQL

Create a PostgreSQL database and configure the database connection used by the backend.

Keep credentials and secrets in environment variables rather than committing them to GitHub.

## 4. Start FastAPI

Navigate to the application directory:

```powershell
cd backend/app
```

Run:

```powershell
uvicorn main:app --reload
```

The backend will be available at:

```text
http://127.0.0.1:8000
```

FastAPI documentation:

```text
http://127.0.0.1:8000/docs
```

## 5. Start Frontend

Open another terminal:

```powershell
cd frontend
```

Install dependencies:

```powershell
npm install
```

Start the development server:

```powershell
npm run dev
```

---

# 🖥️ Application

The dashboard provides several sections:

### 📊 Dashboard

Provides an overview of:

* Total payments
* Recovery probability
* Recovery score
* Risk level
* Quick payment analysis

### 💳 Payments

Displays payment information and allows failed payments to be analyzed.

### 👥 Customers

Provides customer-level payment intelligence including:

* Payment history
* Success rate
* Customer value
* Risk classification

### 🤖 AI Recovery

Displays:

* ML prediction
* Recovery probability
* Risk level
* Recovery score
* Recommended action
* Recommendation confidence
* Customer intelligence
* Policy decision
* Execution result

### 📜 Recovery History

Tracks previously executed recovery actions.

---

# 🧪 Example Recovery Decision

For a failed payment:

```text
Payment ID: 6
Amount: ₹2,499
Failure Reason: Insufficient Funds

Recovery Probability: 27%
Risk Level: HIGH
Recovery Score: 70
Priority: HIGH

Recommended Action:
Send Payment Link

Confidence: 92%

Policy Decision:
ALLOWED

Execution:
Payment link generated
```

This demonstrates how Recovr combines ML predictions with business rules and customer intelligence instead of relying on a simple retry mechanism.

---

# 🔮 Future Scope

The current version provides the foundation for an intelligent payment recovery platform. Future improvements could include:

### 💳 Real Payment Gateway Integration

Integrate payment providers such as Razorpay or Stripe to perform real payment retries and payment-link generation.

### 📧 Automated Customer Communication

Automatically send recovery messages through:

* Email
* SMS
* WhatsApp
* Push notifications

### 🧠 Advanced Machine Learning

Improve prediction accuracy using larger real-world datasets and features such as:

* Customer lifetime value
* Historical recovery success
* Payment method behavior
* Time since failure
* Retry response patterns
* Customer engagement

### 🔁 Adaptive Recovery Strategies

Allow the system to learn which recovery strategy works best for each customer segment.

### 📈 Analytics Dashboard

Add business-level analytics such as:

* Revenue recovered
* Recovery rate
* Revenue at risk
* Recovery performance by strategy
* Customer segment analysis

### 🔐 Authentication and Authorization

Add secure authentication with role-based access for administrators, finance teams, and support teams.

### ☁️ Cloud Deployment

Deploy the application using cloud infrastructure with:

* Docker
* CI/CD
* Managed PostgreSQL
* Cloud hosting
* Monitoring and logging

### 🤖 AI Agent Integration

Extend the AI recovery engine into an autonomous recovery agent capable of selecting and executing recovery strategies while respecting business policies.

---

# 🎓 Project Objective

Recovr demonstrates the practical integration of:

**Machine Learning + Backend APIs + Database Systems + Business Rules + Customer Intelligence + React UI**

The project was developed to explore how AI can be applied to a real-world fintech problem: **recovering revenue from failed payments intelligently.**

---

# 👩‍💻 Author

**Swati Gupta**

B.Tech — Information Technology

GitHub: [13swati](https://github.com/13swati)

---

## 📌 Project Status

🚧 **Active Development**

The core payment recovery workflow is implemented. Future development will focus on improving ML intelligence, real payment integrations, automated customer communication, analytics, security, and cloud deployment.

---

## ⭐ If you find this project useful

Consider giving the repository a ⭐ on GitHub.
