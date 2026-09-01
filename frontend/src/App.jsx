
import { useState, useEffect } from "react";
import "./App.css";
import Payments from "./Payments";

const API_URL = "http://127.0.0.1:8000";

function App() {
  const [paymentId, setPaymentId] = useState(6);

  const [payments, setPayments] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [history, setHistory] = useState([]);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [currentPage, setCurrentPage] = useState("dashboard");

  // =====================================================
  // LOAD PAYMENTS
  // =====================================================

  const getPayments = async () => {
    try {
      setLoading(true);
      setMessage("");

      // IMPORTANT: No space between API_URL and /payments
      const response = await fetch(`${API_URL}/payments/`);

      if (!response.ok) {
        throw new Error("Failed to load payments");
      }

      const data = await response.json();
      setPayments(data);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOAD PAYMENTS WHEN APP STARTS
  // =====================================================

  useEffect(() => {
    getPayments();
  }, []);

  // =====================================================
  // ANALYZE PAYMENT
  // =====================================================

  const analyzePayment = async (id = paymentId) => {
    try {
      setLoading(true);
      setMessage("");

      // IMPORTANT: Correct URL - NO SPACES
      const response = await fetch(
        `${API_URL}/payments/${id}/analyze`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);

        throw new Error(
          errorData?.detail || "Failed to analyze payment"
        );
      }

      const data = await response.json();

      setPaymentId(id);
      setAnalysis(data);
      setCurrentPage("recovery");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // GET INTELLIGENT RECOVERY BUTTON LABEL
  // =====================================================

  const getRecoveryButton = () => {
    if (!analysis?.recommendation?.action) {
      return "⚡ Execute Recovery";
    }

    const action = analysis.recommendation.action;

    const labels = {
      retry: "🔄 Retry Payment",
      payment_link: "💳 Send Payment Link",
      contact_customer: "📞 Contact Customer",
      no_action: "✓ No Action Required",
    };

    return (
      labels[action] ||
      `⚡ ${action.replace(/_/g, " ")}`
    );
  };

  // =====================================================
  // CHECK WHETHER RECOVERY IS ALLOWED
  // =====================================================

  const isRecoveryAllowed = () => {
    if (!analysis) {
      return false;
    }

    const policyDecision =
      analysis.policy?.decision?.toLowerCase();

    const recommendedAction =
      analysis.recommendation?.action;

    if (policyDecision !== "allowed") {
      return false;
    }

    if (recommendedAction === "no_action") {
      return false;
    }

    return true;
  };

  // =====================================================
  // RECOVER PAYMENT
  // =====================================================

  const recoverPayment = async () => {
    if (!analysis) {
      setMessage("Please analyze the payment first.");
      return;
    }

    if (!isRecoveryAllowed()) {
      setMessage(
        "Recovery action is not allowed by the current policy."
      );
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const response = await fetch(
        `${API_URL}/payments/${paymentId}/recover`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);

        throw new Error(
          errorData?.detail ||
          "Failed to recover payment"
        );
      }

      const data = await response.json();

      setAnalysis(data);

      if (data.execution) {
        setMessage(
          `Recovery action "${data.execution.action}" ${data.execution.status} successfully.`
        );
      } else {
        setMessage(
          "Recovery action executed successfully."
        );
      }

      await getHistory(paymentId, false);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // RECOVERY HISTORY
  // =====================================================

  const getHistory = async (
    id = paymentId,
    navigate = true
  ) => {
    try {
      setLoading(true);
      setMessage("");

      const response = await fetch(
        `${API_URL}/payments/${id}/recovery-history`
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);

        throw new Error(
          errorData?.detail ||
          "Failed to load recovery history"
        );
      }

      const data = await response.json();

      setPaymentId(id);
      setHistory(data.recovery_history || []);

      if (navigate) {
        setCurrentPage("history");
      }
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // DASHBOARD
  // =====================================================

  const openDashboard = async () => {
    setCurrentPage("dashboard");
    setMessage("");

    if (payments.length === 0) {
      await getPayments();
    }
  };

  // =====================================================
  // PAYMENTS
  // =====================================================

  const openPayments = () => {
    setCurrentPage("payments");
    setMessage("");
  };

  // =====================================================
  // CUSTOMERS
  // =====================================================

  const openCustomers = async () => {
    setCurrentPage("customers");
    setMessage("");

    if (payments.length === 0) {
      await getPayments();
    }
  };

  // =====================================================
  // AI RECOVERY
  // =====================================================

  const openRecovery = async () => {
    setCurrentPage("recovery");

    if (!analysis) {
      await analyzePayment(paymentId);
    }
  };

  // =====================================================
  // SIDEBAR
  // =====================================================

  const Sidebar = () => (
    <aside className="sidebar">

      <div className="logo">
        <div className="logo-icon">R</div>

        <div>
          <h2>Recovr</h2>
          <span>AI Revenue Recovery</span>
        </div>
      </div>

      <nav>

        <button
          className={`nav-item ${currentPage === "dashboard" ? "active" : ""
            }`}
          onClick={openDashboard}
        >
          📊 Dashboard
        </button>

        <button
          className={`nav-item ${currentPage === "payments" ? "active" : ""
            }`}
          onClick={openPayments}
        >
          💳 Payments
        </button>

        <button
          className={`nav-item ${currentPage === "customers" ? "active" : ""
            }`}
          onClick={openCustomers}
        >
          👥 Customers
        </button>

        <button
          className={`nav-item ${currentPage === "recovery" ? "active" : ""
            }`}
          onClick={openRecovery}
        >
          🤖 AI Recovery
        </button>

        <button
          className={`nav-item ${currentPage === "history" ? "active" : ""
            }`}
          onClick={() => getHistory()}
        >
          📜 Recovery History
        </button>

      </nav>

      <div className="sidebar-bottom">
        <span>AI Agent</span>

        <div className="status">
          <span className="status-dot"></span>
          System Online
        </div>
      </div>

    </aside>
  );

  // =====================================================
  // HEADER
  // =====================================================

  const Header = ({ title, subtitle }) => (
    <header className="header">

      <div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>

      <div className="header-status">
        <span className="status-dot"></span>
        Backend Connected
      </div>

    </header>
  );

  // =====================================================
  // DASHBOARD PAGE
  // =====================================================

  const Dashboard = () => (
    <>
      <Header
        title="Revenue Recovery Dashboard"
        subtitle="AI-powered payment recovery and customer intelligence"
      />

      <section className="welcome-card">

        <div>
          <h2>Welcome to Recovr 👋</h2>

          <p>
            Monitor failed payments and let AI determine
            the best recovery strategy.
          </p>
        </div>

        <div className="agent-badge">
          🤖 AI Agent Online
        </div>

      </section>

      <section className="stats">

        <div className="stat-card">
          <span>Total Payments</span>

          <strong>
            {payments.length || "—"}
          </strong>

          <small>Payments in system</small>
        </div>

        <div className="stat-card">
          <span>Recovery Probability</span>

          <strong>
            {analysis
              ? `${Math.round(
                analysis.ml_prediction.recovery_probability * 100
              )}%`
              : "—"}
          </strong>

          <small>Current payment</small>
        </div>

        <div className="stat-card">
          <span>Recovery Score</span>

          <strong>
            {analysis
              ? analysis.recovery_profile.score
              : "—"}
          </strong>

          <small>AI priority score</small>
        </div>

        <div className="stat-card">
          <span>Risk Level</span>

          <strong className="risk">
            {analysis
              ? analysis.ml_prediction.risk_level.toUpperCase()
              : "—"}
          </strong>

          <small>Current payment</small>
        </div>

      </section>

      <section className="card quick-card">

        <h2>⚡ Quick Recovery</h2>

        <p>
          Enter a payment ID to analyze its recovery potential.
        </p>

        <div className="quick-actions">

          <input
            type="number"
            value={paymentId}
            onChange={(e) =>
              setPaymentId(Number(e.target.value))
            }
          />

          <button
            className="primary-btn"
            onClick={() => analyzePayment()}
            disabled={loading}
          >
            🔍 Analyze Payment
          </button>

          <button
            className="recover-btn"
            onClick={recoverPayment}
            disabled={
              loading ||
              !analysis ||
              !isRecoveryAllowed()
            }
          >
            {analysis
              ? getRecoveryButton()
              : "⚡ Analyze First"}
          </button>

        </div>

      </section>

      {analysis && (
        <section className="grid">

          <div className="card">

            <h2>🤖 AI Prediction</h2>

            <div className="prediction">

              <div className="probability">
                {Math.round(
                  analysis.ml_prediction.recovery_probability * 100
                )}%
              </div>

              <div>

                <h3>Recovery Probability</h3>

                <p>
                  Predicted Success:{" "}
                  <strong>
                    {analysis.ml_prediction.predicted_success
                      ? "Yes"
                      : "No"}
                  </strong>
                </p>

                <p>
                  Risk:{" "}
                  <strong>
                    {analysis.ml_prediction.risk_level}
                  </strong>
                </p>

              </div>

            </div>

          </div>

          <div className="card">

            <h2>🎯 Recommended Action</h2>

            <div className="recommendation">

              <div className="action-icon">
                💳
              </div>

              <div>

                <h3>
                  {getRecoveryButton()}
                </h3>

                <p>
                  {analysis.recommendation.reason}
                </p>

                <span>
                  Confidence:{" "}
                  {Math.round(
                    analysis.recommendation.confidence * 100
                  )}%
                </span>

              </div>

            </div>

          </div>

        </section>
      )}

    </>
  );

  // =====================================================
  // CUSTOMERS PAGE
  // =====================================================

  const Customers = () => {

    const customerMap = {};

    payments.forEach((payment) => {

      const customerId = payment.customer_id;

      if (!customerMap[customerId]) {

        customerMap[customerId] = {
          customer_id: customerId,
          total_payments: 0,
          successful_payments: 0,
          failed_payments: 0,
          total_amount: 0,
          failed_amount: 0,
        };

      }

      const customer = customerMap[customerId];

      customer.total_payments += 1;

      customer.total_amount += Number(
        payment.amount || 0
      );

      if (
        payment.status?.toLowerCase() === "success"
      ) {
        customer.successful_payments += 1;
      }

      if (
        payment.status?.toLowerCase() === "failed"
      ) {
        customer.failed_payments += 1;

        customer.failed_amount += Number(
          payment.amount || 0
        );
      }

    });

    const customers = Object.values(customerMap);

    return (
      <>
        <Header
          title="Customers"
          subtitle="Customer intelligence and payment behavior"
        />

        <section className="stats">

          <div className="stat-card">
            <span>Total Customers</span>

            <strong>
              {customers.length}
            </strong>

            <small>Unique customers</small>
          </div>

          <div className="stat-card">
            <span>Active Customers</span>

            <strong>
              {
                customers.filter(
                  (customer) =>
                    customer.successful_payments > 0
                ).length
              }
            </strong>

            <small>
              At least one successful payment
            </small>
          </div>

          <div className="stat-card">
            <span>Customers at Risk</span>

            <strong className="risk">
              {
                customers.filter(
                  (customer) =>
                    customer.failed_payments > 0
                ).length
              }
            </strong>

            <small>Have failed payments</small>
          </div>

          <div className="stat-card">
            <span>Total Customer Value</span>

            <strong>
              ₹
              {customers
                .reduce(
                  (total, customer) =>
                    total + customer.total_amount,
                  0
                )
                .toLocaleString("en-IN")}
            </strong>

            <small>
              Payment transaction value
            </small>
          </div>

        </section>

        <section className="card">

          <div className="section-header">

            <div>
              <h2>👥 Customer Intelligence</h2>

              <p>
                Analyze customer payment behavior
                and recovery risk.
              </p>
            </div>

            <span>
              {customers.length} customers
            </span>

          </div>

          {customers.length === 0 ? (

            <div className="empty-state">

              <div className="coming-icon">
                👥
              </div>

              <h2>No Customer Data</h2>

              <p>
                Customer information will appear
                when payments are available.
              </p>

            </div>

          ) : (

            <div className="table-container">

              <table>

                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Total Payments</th>
                    <th>Successful</th>
                    <th>Failed</th>
                    <th>Success Rate</th>
                    <th>Payment Value</th>
                    <th>Risk</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>

                  {customers.map((customer) => {

                    const successRate =
                      customer.total_payments > 0
                        ? Math.round(
                          (customer.successful_payments /
                            customer.total_payments) *
                          100
                        )
                        : 0;

                    const risk =
                      customer.failed_payments === 0
                        ? "Low"
                        : successRate >= 50
                          ? "Medium"
                          : "High";

                    return (
                      <tr
                        key={customer.customer_id}
                      >

                        <td>
                          <strong>
                            Customer #{customer.customer_id}
                          </strong>
                        </td>

                        <td>
                          {customer.total_payments}
                        </td>

                        <td>
                          <span className="status-success">
                            {customer.successful_payments}
                          </span>
                        </td>

                        <td>
                          <span className="status-blocked">
                            {customer.failed_payments}
                          </span>
                        </td>

                        <td>
                          <strong>
                            {successRate}%
                          </strong>
                        </td>

                        <td>
                          ₹
                          {customer.total_amount.toLocaleString(
                            "en-IN"
                          )}
                        </td>

                        <td>
                          <span
                            className={`status-badge ${risk.toLowerCase()}`}
                          >
                            {risk}
                          </span>
                        </td>

                        <td>

                          {customer.failed_payments > 0 ? (

                            <button
                              className="table-btn"
                              onClick={() => {

                                const failedPayment =
                                  payments.find(
                                    (payment) =>
                                      payment.customer_id ===
                                      customer.customer_id &&
                                      payment.status?.toLowerCase() ===
                                      "failed"
                                  );

                                if (failedPayment) {
                                  analyzePayment(
                                    failedPayment.payment_id
                                  );
                                }

                              }}
                            >
                              🔍 Analyze
                            </button>

                          ) : (

                            <span
                              style={{
                                color: "#16a34a",
                                fontWeight: "600",
                                fontSize: "13px",
                              }}
                            >
                              ✓ Healthy
                            </span>

                          )}

                        </td>

                      </tr>
                    );

                  })}

                </tbody>

              </table>

            </div>

          )}

        </section>

        {customers.length > 0 && (

          <section className="grid">

            <div className="card">

              <h2>📊 Customer Risk Overview</h2>

              <div className="customer-grid">

                <div>
                  <span>High Risk</span>

                  <strong className="status-blocked">
                    {
                      customers.filter((customer) => {

                        const rate =
                          customer.total_payments > 0
                            ? (customer.successful_payments /
                              customer.total_payments) *
                            100
                            : 0;

                        return rate < 50;

                      }).length
                    }
                  </strong>
                </div>

                <div>
                  <span>Medium Risk</span>

                  <strong>
                    {
                      customers.filter((customer) => {

                        const rate =
                          customer.total_payments > 0
                            ? (customer.successful_payments /
                              customer.total_payments) *
                            100
                            : 0;

                        return rate >= 50 && rate < 100;

                      }).length
                    }
                  </strong>
                </div>

                <div>
                  <span>Low Risk</span>

                  <strong className="status-success">
                    {
                      customers.filter(
                        (customer) =>
                          customer.failed_payments === 0
                      ).length
                    }
                  </strong>
                </div>

              </div>

            </div>

            <div className="card">

              <h2>🤖 AI Recovery Insight</h2>

              <p
                style={{
                  color: "#6b7280",
                  lineHeight: "1.6",
                }}
              >
                Customers with failed payments can
                be analyzed by the AI Recovery Agent
                to determine the probability of
                successful recovery and the most
                suitable recovery strategy.
              </p>

              <button
                className="primary-btn"
                style={{
                  marginTop: "18px",
                }}
                onClick={() => {

                  const failedPayment =
                    payments.find(
                      (payment) =>
                        payment.status?.toLowerCase() ===
                        "failed"
                    );

                  if (failedPayment) {
                    analyzePayment(
                      failedPayment.payment_id
                    );
                  }

                }}
              >
                🤖 Analyze At-Risk Customer
              </button>

            </div>

          </section>

        )}

      </>
    );
  };

  // =====================================================
  // AI RECOVERY PAGE
  // =====================================================

  const Recovery = () => {

    if (!analysis) {

      return (
        <>
          <Header
            title="AI Recovery"
            subtitle="AI-powered payment recovery and customer intelligence"
          />

          <section className="card empty-state">

            <h2>🤖 No Payment Selected</h2>

            <p>
              Enter a payment ID to start AI recovery analysis.
            </p>

            <button
              className="primary-btn"
              onClick={() => analyzePayment()}
              disabled={loading}
            >
              Analyze Payment #{paymentId}
            </button>

          </section>
        </>
      );
    }

    return (
      <>
        <Header
          title="AI Recovery"
          subtitle="AI-powered payment recovery and customer intelligence"
        />

        {message && (
          <div className="message">
            {message}
          </div>
        )}

        <section className="stats">

          <div className="stat-card">
            <span>Recovery Probability</span>

            <strong>
              {Math.round(
                analysis.ml_prediction.recovery_probability * 100
              )}%
            </strong>
          </div>

          <div className="stat-card">
            <span>Risk</span>

            <strong className="risk">
              {analysis.ml_prediction.risk_level.toUpperCase()}
            </strong>
          </div>

          <div className="stat-card">
            <span>Recovery Score</span>

            <strong>
              {analysis.recovery_profile.score}
            </strong>
          </div>

          <div className="stat-card">
            <span>Recovery Priority</span>

            <strong className="risk">
              {analysis.recovery_profile.priority?.toUpperCase() || "—"}
            </strong>
          </div>

          <div className="stat-card">
            <span>Amount</span>

            <strong>
              ₹
              {Number(
                analysis.recovery_profile.payment_amount || 0
              ).toLocaleString("en-IN")}
            </strong>
          </div>

        </section>

        <section className="grid">

          <div className="card">

            <h2>🤖 AI Prediction</h2>

            <div className="prediction">

              <div className="probability">
                {Math.round(
                  analysis.ml_prediction.recovery_probability * 100
                )}%
              </div>

              <div>

                <h3>Recovery Probability</h3>

                <p>
                  Predicted Success:{" "}
                  <strong>
                    {analysis.ml_prediction.predicted_success
                      ? "Yes"
                      : "No"}
                  </strong>
                </p>

                <p>
                  Risk:{" "}
                  <strong>
                    {analysis.ml_prediction.risk_level}
                  </strong>
                </p>

              </div>

            </div>

          </div>

          <div className="card">

            <h2>🎯 Recommended Action</h2>

            <div className="recommendation">

              <div className="action-icon">

                {analysis.recommendation.action === "retry"
                  ? "🔄"
                  : analysis.recommendation.action ===
                    "payment_link"
                    ? "💳"
                    : analysis.recommendation.action ===
                      "contact_customer"
                      ? "📞"
                      : "🤖"}

              </div>

              <div>

                <h3>
                  {getRecoveryButton()}
                </h3>

                <p>
                  {analysis.recommendation.reason}
                </p>

                <span>
                  Confidence:{" "}
                  {Math.round(
                    analysis.recommendation.confidence * 100
                  )}%
                </span>

              </div>

            </div>

          </div>

        </section>

        {analysis.execution &&
          analysis.execution.payment_link && (

            <section className="card recovery-link-card">

              <h2>💳 Payment Recovery Link</h2>

              <p>
                Customer can complete the payment manually.
              </p>

              <a
                href={analysis.execution.payment_link}
                target="_blank"
                rel="noreferrer"
                className="payment-link"
              >
                Open Payment Link →
              </a>

            </section>

          )}

        <section className="card">

          <h2>👤 Customer Intelligence</h2>

          <div className="customer-grid">

            <div>
              <span>Customer ID</span>

              <strong>
                {analysis.customer_profile.customer_id}
              </strong>
            </div>

            <div>
              <span>Customer Value</span>

              <strong>
                {
                  analysis.customer_profile.customer_profile
                    .customer_value
                }
              </strong>
            </div>

            <div>
              <span>Reliability</span>

              <strong>
                {
                  analysis.customer_profile.customer_profile
                    .reliability
                }
              </strong>
            </div>

            <div>
              <span>Success Rate</span>

              <strong>
                {
                  analysis.customer_profile.payment_history
                    .success_rate
                }%
              </strong>
            </div>

            <div>
              <span>Total Payments</span>

              <strong>
                {
                  analysis.customer_profile.payment_history
                    .total_payments
                }
              </strong>
            </div>

            <div>
              <span>Subscription</span>

              <strong>
                {
                  analysis.customer_profile.subscription
                    .plan_name
                }
              </strong>
            </div>

          </div>

        </section>

        <section className="card policy-card">

          <h2>🛡️ Policy Decision</h2>

          <div className="policy-content">

            <div>

              <span>Decision</span>

              <strong>
                {analysis.policy.decision.toUpperCase()}
              </strong>

            </div>

            <p>
              {analysis.policy.reason}
            </p>

          </div>

        </section>

        {analysis.execution && (

          <section className="card">

            <h2>⚡ Execution Result</h2>

            <div className="execution-grid">

              <div>
                <span>Action</span>

                <strong>
                  {analysis.execution.action}
                </strong>
              </div>

              <div>
                <span>Status</span>

                <strong>
                  {analysis.execution.status}
                </strong>
              </div>

              <div>
                <span>Message</span>

                <strong>
                  {analysis.execution.message}
                </strong>
              </div>

            </div>

          </section>

        )}

        <section className="action-bar">

          <button
            className="primary-btn"
            onClick={() => analyzePayment()}
            disabled={loading}
          >
            🔍 Re-analyze
          </button>

          <button
            className="recover-btn"
            onClick={recoverPayment}
            disabled={
              loading ||
              !isRecoveryAllowed()
            }
          >
            {getRecoveryButton()}
          </button>

          <button
            className="history-btn"
            onClick={() => getHistory()}
          >
            📜 View History
          </button>

        </section>

      </>
    );
  };

  // =====================================================
  // HISTORY PAGE
  // =====================================================

  const History = () => (
    <>
      <Header
        title="Recovery History"
        subtitle="Track every AI recovery decision and execution"
      />

      {message && (
        <div className="message">
          {message}
        </div>
      )}

      <section className="card">

        <div className="section-header">

          <div>

            <h2>📜 Recovery Actions</h2>

            <p>
              Payment #{paymentId}
            </p>

          </div>

          <button
            className="history-btn"
            onClick={() => getHistory()}
          >
            ↻ Refresh
          </button>

        </div>

        {loading ? (

          <div className="empty-state">
            Loading recovery history...
          </div>

        ) : history.length === 0 ? (

          <div className="empty-state">
            No recovery actions found for payment #{paymentId}.
          </div>

        ) : (

          <div className="history">

            {history.map((item) => (

              <div
                className="history-item"
                key={item.action_id}
              >

                <div>

                  <strong>
                    {item.action_type.replace("_", " ")}
                  </strong>

                  <span>
                    {item.outcome}
                  </span>

                </div>

                <div className="history-right">

                  <span>
                    Confidence:{" "}
                    {Math.round(item.confidence * 100)}%
                  </span>

                  <small>
                    {item.execution_status}
                  </small>

                </div>

              </div>

            ))}

          </div>

        )}

      </section>
    </>
  );

  // =====================================================
  // MAIN PAGE ROUTER
  // =====================================================

  const renderPage = () => {

    if (currentPage === "dashboard") {
      return <Dashboard />;
    }

    if (currentPage === "payments") {
      return (
        <Payments
          onAnalyze={(id) => {
            setPaymentId(id);
            analyzePayment(id);
          }}
        />
      );
    }

    if (currentPage === "customers") {
      return <Customers />;
    }

    if (currentPage === "recovery") {
      return <Recovery />;
    }

    if (currentPage === "history") {
      return <History />;
    }

    return <Dashboard />;
  };

  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <div className="app">

      <Sidebar />

      <main className="main">

        {message && currentPage !== "recovery" && (
          <div className="message">
            {message}
          </div>
        )}

        {renderPage()}

      </main>

    </div>
  );
}

export default App;
