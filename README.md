**# Recovr — AI-Powered Revenue Recovery System**



**> An intelligent payment recovery platform that detects failed payments, analyzes customer behavior, predicts recovery probability, and recommends the most effective recovery action.**



**## 🚀 Overview**



**\*\*Recovr\*\* is an AI-powered revenue recovery system designed to help businesses recover revenue lost due to failed payments.**



**Instead of treating every failed payment in the same way, Recovr analyzes multiple signals including payment failure reasons, customer payment history, subscription information, previous payment attempts, and recovery history.**



**The system then:**



**1. Detects payment failures**

**2. Analyzes customer behavior**

**3. Predicts recovery probability using Machine Learning**

**4. Calculates a recovery priority score**

**5. Recommends an intelligent recovery action**

**6. Validates the action through a policy engine**

**7. Executes the approved recovery action**

**8. Stores the recovery activity for future analysis**



**---**



**## 🎯 Problem Statement**



**Failed payments can result in significant revenue loss for businesses.**



**A simple retry-based system may not be effective because different payment failures require different recovery strategies.**



**For example:**



**\* Insufficient funds → Send a payment link**

**\* Temporary payment failure → Retry payment**

**\* Repeated failures → Contact or escalate to customer support**

**\* Successful payment → No recovery action required**



**Recovr attempts to make this process intelligent by selecting a recovery strategy based on payment and customer context.**



**---**



**## ✨ Key Features**



**### 💳 Payment Failure Detection**



**Automatically identifies whether a payment requires recovery and determines the failure reason.**



**### 🤖 Machine Learning Prediction**



**Predicts the probability that a failed payment can be successfully recovered.**



**Example:**



**```text**

**Recovery Probability: 27%**

**Predicted Success: No**

**Risk Level: HIGH**

**```**



**### 👤 Customer Intelligence**



**Analyzes customer payment behavior including:**



**\* Total payments**

**\* Successful payments**

**\* Failed payments**

**\* Success rate**

**\* Customer value**

**\* Reliability**

**\* Subscription plan**



**### 📊 Recovery Scoring**



**Calculates a recovery score and priority level to help determine which failed payments deserve attention first.**



**### 🎯 Intelligent Recovery Recommendation**



**The Recovery Engine recommends an action based on the available payment and customer context.**



**Supported recovery strategies include:**



**```text**

**Retry Payment**

**Send Payment Link**

**Contact Customer**

**Escalate**

**No Action**

**```**



**### 🛡️ Policy Engine**



**Before executing an action, Recovr validates whether the recommended action is allowed according to the current recovery policy.**



**### ⚡ Action Executor**



**Executes approved recovery actions.**



**Currently implemented actions include:**



**\* Payment link generation**

**\* Payment retry simulation**

**\* Manual escalation**



**### 📜 Recovery History**



**Every recovery action is recorded and can be viewed through the Recovery History dashboard.**



**### 👥 Customer Risk Analysis**



**Customers are categorized according to their payment behavior and recovery risk.**



**---**



**# 🏗️ System Architecture**



**```text**

&#x20;                   **┌─────────────────────────┐**

&#x20;                   **│      React Frontend     │**

&#x20;                   **│     Recovr Dashboard    │**

&#x20;                   **└────────────┬────────────┘**

&#x20;                                **│**

&#x20;                                **│ REST API**

&#x20;                                **▼**

&#x20;                   **┌─────────────────────────┐**

&#x20;                   **│     FastAPI Backend     │**

&#x20;                   **└────────────┬────────────┘**

&#x20;                                **│**

&#x20;            **┌───────────────────┼───────────────────┐**

&#x20;            **│                   │                   │**

&#x20;            **▼                   ▼                   ▼**

&#x20;     **┌─────────────┐    ┌───────────────┐   ┌──────────────┐**

&#x20;     **│   Failure   │    │   Customer    │   │ ML Predictor │**

&#x20;     **│  Detection  │    │ Intelligence  │   │              │**

&#x20;     **└──────┬──────┘    └───────┬───────┘   └──────┬───────┘**

&#x20;            **│                   │                  │**

&#x20;            **└───────────────────┼──────────────────┘**

&#x20;                                **▼**

&#x20;                   **┌─────────────────────────┐**

&#x20;                   **│    Recovery Scoring    │**

&#x20;                   **└────────────┬────────────┘**

&#x20;                                **▼**

&#x20;                   **┌─────────────────────────┐**

&#x20;                   **│    Recovery Engine      │**

&#x20;                   **│ Action Recommendation  │**

&#x20;                   **└────────────┬────────────┘**

&#x20;                                **▼**

&#x20;                   **┌─────────────────────────┐**

&#x20;                   **│     Policy Engine       │**

&#x20;                   **│   Validate Action       │**

&#x20;                   **└────────────┬────────────┘**

&#x20;                                **▼**

&#x20;                   **┌─────────────────────────┐**

&#x20;                   **│    Action Executor      │**

&#x20;                   **└────────────┬────────────┘**

&#x20;                                **▼**

&#x20;                   **┌─────────────────────────┐**

&#x20;                   **│       PostgreSQL        │**

&#x20;                   **│     Recovery History   │**

&#x20;                   **└─────────────────────────┘**

**```**



**---**



**# 🤖 AI / ML Workflow**



**Recovr follows an end-to-end recovery decision pipeline:**



**```text**

**Failed Payment**

&#x20;     **│**

&#x20;     **▼**

**Failure Detection**

&#x20;     **│**

&#x20;     **▼**

**Customer Intelligence**

&#x20;     **│**

&#x20;     **▼**

**Feature Engineering**

&#x20;     **│**

&#x20;     **▼**

**ML Recovery Prediction**

&#x20;     **│**

&#x20;     **▼**

**Recovery Score**

&#x20;     **│**

&#x20;     **▼**

**Recovery Recommendation**

&#x20;     **│**

&#x20;     **▼**

**Policy Validation**

&#x20;     **│**

&#x20;     **▼**

**Action Execution**

&#x20;     **│**

&#x20;     **▼**

**Recovery History**

**```**



**---**



**# 🧠 Example AI Decision**



**Consider a failed payment:**



**```text**

**Payment ID: 6**

**Customer ID: 1**

**Amount: ₹2,499**



**Failure Reason:**

**insufficient\_funds**

**```**



**The system analyzes the payment and generates:**



**```text**

**Recovery Probability: 27%**

**Risk Level: HIGH**

**Recovery Score: 70**

**Priority: HIGH**

**```**



**The Recovery Engine determines:**



**```text**

**Recommended Action:**

**Send Payment Link**



**Reason:**

**Retry limit reached for insufficient funds**



**Confidence:**

**92%**

**```**



**The Policy Engine evaluates the action:**



**```text**

**Policy Decision:**

**ALLOWED**

**```**



**The Action Executor then generates a payment recovery link.**



**```text**

**Action:**

**payment\_link**



**Status:**

**completed**



**Message:**

**Payment link generated**

**```**



**Finally, the recovery action is stored in the PostgreSQL database.**



**---**



**# 🛠️ Technology Stack**



**## Backend**



**\* Python**

**\* FastAPI**

**\* SQLAlchemy**

**\* PostgreSQL**

**\* Uvicorn**

**\* Scikit-learn**

**\* NumPy**

**\* Pandas**



**## Frontend**



**\* React**

**\* JavaScript**

**\* Vite**

**\* HTML**

**\* CSS**



**## Machine Learning**



**\* Scikit-learn**

**\* Feature Engineering**

**\* Classification / Recovery Prediction**

**\* Probability-based recovery scoring**



**## Database**



**\* PostgreSQL**

**\* SQLAlchemy ORM**



**---**



**# 📁 Project Structure**



**```text**

**recovr-ai-revenue-recovery/**

**│**

**├── backend/**

**│   ├── app/**

**│   │   ├── ml/**

**│   │   │   ├── feature\_engineering.py**

**│   │   │   ├── predictor.py**

**│   │   │   ├── train\_model.py**

**│   │   │   └── recovery\_model.pkl**

**│   │   │**

**│   │   ├── models/**

**│   │   │   ├── customer.py**

**│   │   │   ├── payment.py**

**│   │   │   ├── payment\_attempt.py**

**│   │   │   ├── recovery\_action.py**

**│   │   │   └── subscription.py**

**│   │   │**

**│   │   ├── routes/**

**│   │   │   └── payments.py**

**│   │   │**

**│   │   ├── services/**

**│   │   │   ├── action\_executor.py**

**│   │   │   ├── ai\_agent.py**

**│   │   │   ├── customer\_intelligence.py**

**│   │   │   ├── failure\_detector.py**

**│   │   │   ├── policy\_engine.py**

**│   │   │   ├── recovery\_engine.py**

**│   │   │   └── scoring\_engine.py**

**│   │   │**

**│   │   ├── database.py**

**│   │   └── main.py**

**│   │**

**│   └── .gitignore**

**│**

**├── frontend/**

**│   ├── src/**

**│   │   ├── App.jsx**

**│   │   ├── App.css**

**│   │   ├── Payments.jsx**

**│   │   └── main.jsx**

**│   │**

**│   ├── public/**

**│   ├── package.json**

**│   └── vite.config.js**

**│**

**├── .gitignore**

**└── README.md**

**```**



**---**



**# 🔌 API Endpoints**



**## Payments**



**### Get all payments**



**```http**

**GET /payments/**

**```**



**### Get a single payment**



**```http**

**GET /payments/{payment\_id}**

**```**



**### Get payment context**



**```http**

**GET /payments/{payment\_id}/context**

**```**



**### Analyze payment**



**```http**

**POST /payments/{payment\_id}/analyze**

**```**



**### Execute recovery**



**```http**

**POST /payments/{payment\_id}/recover**

**```**



**### Get recovery history**



**```http**

**GET /payments/{payment\_id}/recovery-history**

**```**



**---**



**# ⚙️ Installation**



**## 1. Clone the repository**



**```bash**

**git clone https://github.com/13swati/recovr-ai-revenue-recovery.git**

**cd recovr-ai-revenue-recovery**

**```**



**---**



**# 🐍 Backend Setup**



**Navigate to the backend:**



**```bash**

**cd backend**

**```**



**Create a virtual environment:**



**```bash**

**python -m venv .venv**

**```**



**Activate it on Windows:**



**```powershell**

**.venv\\Scripts\\activate**

**```**



**Install dependencies:**



**```bash**

**pip install fastapi uvicorn sqlalchemy psycopg2-binary pandas numpy scikit-learn**

**```**



**Configure your PostgreSQL database and update the database connection through environment variables.**



**Start the FastAPI server:**



**```bash**

**cd app**

**uvicorn main:app --reload**

**```**



**The backend will run at:**



**```text**

**http://127.0.0.1:8000**

**```**



**FastAPI documentation:**



**```text**

**http://127.0.0.1:8000/docs**

**```**



**---**



**# ⚛️ Frontend Setup**



**Open another terminal and navigate to:**



**```bash**

**cd frontend**

**```**



**Install dependencies:**



**```bash**

**npm install**

**```**



**Start the development server:**



**```bash**

**npm run dev**

**```**



**The frontend will normally be available at:**



**```text**

**http://localhost:5173**

**```**



**---**



**# 🔐 Environment Variables**



**Sensitive configuration should be stored in `.env` files and should \*\*never be committed to GitHub\*\*.**



**Example:**



**```env**

**DATABASE\_URL=postgresql://username:password@localhost:5432/recovr**

**```**



**The repository `.gitignore` is configured to prevent `.env` files from being committed.**



**---**



**# 📊 Dashboard**



**The Recovr dashboard provides an overview of:**



**\* Total payments**

**\* Recovery probability**

**\* Recovery score**

**\* Risk level**

**\* Customer intelligence**

**\* Recommended recovery actions**

**\* Recovery history**



**The AI Recovery page provides detailed information about the selected failed payment.**



**---**



**# 🔄 Recovery Decision Logic**



**The current system follows this general decision flow:**



**```text**

**Payment Failed**

&#x20;     **│**

&#x20;     **▼**

**Is Recovery Required?**

&#x20;     **│**

&#x20;     **├── No ──► Stop**

&#x20;     **│**

&#x20;     **▼**

**Customer Analysis**

&#x20;     **│**

&#x20;     **▼**

**ML Prediction**

&#x20;     **│**

&#x20;     **▼**

**Recovery Score**

&#x20;     **│**

&#x20;     **▼**

**Recommended Action**

&#x20;     **│**

&#x20;     **▼**

**Policy Validation**

&#x20;     **│**

&#x20;     **├── Blocked ──► Do Not Execute**

&#x20;     **│**

&#x20;     **▼**

**Execute Action**

&#x20;     **│**

&#x20;     **▼**

**Store Recovery Action**

**```**



**---**



**# 🚧 Current Implementation Status**



**### Completed**



**\* \[x] FastAPI backend**

**\* \[x] React frontend**

**\* \[x] PostgreSQL integration**

**\* \[x] SQLAlchemy database models**

**\* \[x] Payment failure detection**

**\* \[x] Customer intelligence**

**\* \[x] ML recovery prediction**

**\* \[x] Recovery scoring**

**\* \[x] Intelligent recovery recommendation**

**\* \[x] Policy validation**

**\* \[x] Recovery action execution**

**\* \[x] Payment-link generation**

**\* \[x] Recovery history**

**\* \[x] Customer risk dashboard**

**\* \[x] GitHub repository**



**### Currently Improving**



**\* \[ ] Production-grade payment provider integration**

**\* \[ ] More realistic ML training data**

**\* \[ ] Improved ML evaluation metrics**

**\* \[ ] Automated recovery campaigns**

**\* \[ ] Customer communication system**

**\* \[ ] Advanced analytics**

**\* \[ ] Production deployment**

**\* \[ ] Authentication and authorization**



**---**



**# 🔮 Future Scope**



**## 1. Real Payment Gateway Integration**



**Integrate real payment providers such as Stripe or Razorpay to perform actual payment retries and recovery operations instead of simulated actions.**



**## 2. Automated Customer Communication**



**Automatically send:**



**\* Email reminders**

**\* SMS notifications**

**\* WhatsApp messages**

**\* Payment links**



**based on the recommended recovery strategy.**



**## 3. Advanced Machine Learning**



**Improve the prediction model using larger real-world datasets and features such as:**



**\* Historical recovery success**

**\* Customer lifetime value**

**\* Payment method**

**\* Failure frequency**

**\* Time since previous payment**

**\* Subscription history**

**\* Customer engagement**



**## 4. Adaptive Recovery Strategies**



**The system could learn which recovery strategy works best for each customer segment.**



**For example:**



**```text**

**Customer Segment A**

**→ Retry**



**Customer Segment B**

**→ Payment Link**



**Customer Segment C**

**→ Customer Contact**



**Customer Segment D**

**→ Manual Escalation**

**```**



**## 5. Real-Time Recovery**



**Introduce event-driven processing so failed payments can automatically enter the recovery pipeline without requiring manual analysis.**



**## 6. Recovery Analytics**



**Add analytics such as:**



**\* Revenue recovered**

**\* Recovery rate**

**\* Failed payment rate**

**\* Recovery success by strategy**

**\* Customer lifetime value**

**\* Recovery ROI**



**## 7. Authentication and Role-Based Access**



**Introduce secure authentication for:**



**\* Admins**

**\* Finance teams**

**\* Support teams**

**\* Recovery managers**



**## 8. Production Deployment**



**Deploy the platform using cloud infrastructure and containerization.**



**Potential technologies:**



**```text**

**Docker**

**AWS / Azure / GCP**

**PostgreSQL Cloud**

**CI/CD**

**Monitoring**

**Logging**

**```**



**---**



**# 🎯 Project Goal**



**The long-term goal of Recovr is to evolve from a payment failure dashboard into an \*\*autonomous AI-driven revenue recovery platform\*\* capable of:**



**```text**

**Detect → Predict → Decide → Validate → Recover → Learn**

**```**



**---**



**# 📌 Project Status**



**\*\*Current Status:\*\* Active Development**



**Recovr currently demonstrates the complete recovery decision pipeline from failed payment detection to intelligent recovery action execution and historical tracking.**



**---**



**# 👩‍💻 Author**



**\*\*Swati Gupta\*\***



**B.Tech — Information Technology**



**GitHub: \[@13swati](https://github.com/13swati)**



**---**



**## ⭐ If you find this project interesting**



**Consider giving the repository a star and following the project as it evolves.**



