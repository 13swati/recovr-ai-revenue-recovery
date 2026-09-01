import { useEffect, useState } from "react";

const API_URL = "http://127.0.0.1:8000";

function Payments({ onAnalyze }) {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/payments/`);

      if (!response.ok) {
        throw new Error("Failed to load payments");
      }

      const data = await response.json();
      setPayments(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  // -----------------------------------------------------
  // PAYMENT STATISTICS
  // -----------------------------------------------------

  const totalPayments = payments.length;

  const failedPayments = payments.filter(
    (payment) => payment.status?.toLowerCase() === "failed"
  ).length;

  const successfulPayments = payments.filter(
    (payment) => payment.status?.toLowerCase() === "success"
  ).length;

  const failedAmount = payments
    .filter((payment) => payment.status?.toLowerCase() === "failed")
    .reduce((total, payment) => total + Number(payment.amount || 0), 0);

  return (
    <>
      {/* =================================================
          HEADER
         ================================================= */}

      <header className="header">

        <div>
          <h1>Payments</h1>

          <p>
            Monitor customer payments and identify recovery opportunities.
          </p>
        </div>

        <button
          className="history-btn"
          onClick={fetchPayments}
          disabled={loading}
        >
          🔄 Refresh
        </button>

      </header>

      {/* =================================================
          ERROR
         ================================================= */}

      {error && (
        <div className="message error">
          {error}
        </div>
      )}

      {/* =================================================
          LOADING
         ================================================= */}

      {loading ? (

        <section className="card empty-state">
          <h2>Loading Payments...</h2>
          <p>
            Fetching payment transactions from the Recovr backend.
          </p>
        </section>

      ) : (

        <>
          {/* =============================================
              PAYMENT STATISTICS
             ============================================= */}

          <section className="stats">

            <div className="stat-card">
              <span>Total Payments</span>

              <strong>
                {totalPayments}
              </strong>

              <small>
                Transactions in system
              </small>
            </div>


            <div className="stat-card">
              <span>Successful Payments</span>

              <strong>
                {successfulPayments}
              </strong>

              <small>
                Successfully completed
              </small>
            </div>


            <div className="stat-card">
              <span>Failed Payments</span>

              <strong className="risk">
                {failedPayments}
              </strong>

              <small>
                Recovery opportunities
              </small>
            </div>


            <div className="stat-card">
              <span>Amount at Risk</span>

              <strong className="risk">
                ₹{failedAmount.toLocaleString("en-IN")}
              </strong>

              <small>
                Failed payment value
              </small>
            </div>

          </section>



          {/* =============================================
              PAYMENT TABLE
             ============================================= */}

          <section className="card">

            <div className="section-header">

              <div>
                <h2>💳 Payment Transactions</h2>

                <p>
                  Review payment activity and analyze failed transactions.
                </p>
              </div>

              <span>
                {totalPayments} payments
              </span>

            </div>


            {payments.length === 0 ? (

              <div className="empty-state">

                <div className="coming-icon">
                  💳
                </div>

                <h2>No Payments Found</h2>

                <p>
                  No payment transactions are currently available.
                </p>

              </div>

            ) : (

              <div className="table-container">

                <table>

                  <thead>

                    <tr>
                      <th>Payment ID</th>
                      <th>Customer</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Failure Reason</th>
                      <th>Payment Method</th>
                      <th>Action</th>
                    </tr>

                  </thead>


                  <tbody>

                    {payments.map((payment) => {

                      const isFailed =
                        payment.status?.toLowerCase() === "failed";

                      return (

                        <tr key={payment.payment_id}>

                          {/* Payment ID */}

                          <td>
                            <strong>
                              #{payment.payment_id}
                            </strong>
                          </td>


                          {/* Customer */}

                          <td>
                            Customer #{payment.customer_id}
                          </td>


                          {/* Amount */}

                          <td>
                            <strong>
                              ₹
                              {Number(payment.amount || 0)
                                .toLocaleString("en-IN")}
                            </strong>
                          </td>


                          {/* Status */}

                          <td>

                            <span
                              className={`status-badge ${payment.status?.toLowerCase() || ""
                                }`}
                            >
                              {payment.status}
                            </span>

                          </td>


                          {/* Failure Reason */}

                          <td>
                            {payment.failure_reason || "—"}
                          </td>


                          {/* Payment Method */}

                          <td>
                            {payment.payment_method
                              ?.replace("_", " ")}
                          </td>


                          {/* Action */}

                          <td>

                            {isFailed ? (

                              <button
                                className="table-btn"
                                onClick={() =>
                                  onAnalyze(payment.payment_id)
                                }
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
                                ✓ No action
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


          {/* =============================================
              RECOVERY INFORMATION
             ============================================= */}

          {failedPayments > 0 && (

            <section className="card">

              <h2>🤖 Recovery Opportunities</h2>

              <p
                style={{
                  color: "#6b7280",
                  marginBottom: "18px",
                }}
              >
                Recovr identified{" "}
                <strong>
                  {failedPayments}
                </strong>{" "}
                failed payment
                {failedPayments !== 1 ? "s" : ""} with a total value of{" "}
                <strong>
                  ₹{failedAmount.toLocaleString("en-IN")}
                </strong>
                .
              </p>

              <button
                className="primary-btn"
                onClick={() => {
                  const firstFailedPayment = payments.find(
                    (payment) =>
                      payment.status?.toLowerCase() === "failed"
                  );

                  if (firstFailedPayment) {
                    onAnalyze(firstFailedPayment.payment_id);
                  }
                }}
              >
                🤖 Analyze Recovery Opportunity
              </button>

            </section>

          )}

        </>

      )}

    </>
  );
}

export default Payments;