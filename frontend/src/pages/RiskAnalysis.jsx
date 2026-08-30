import { useState } from "react";
import api from "../api";
import "./RiskAnalysis.css";

function RiskAnalysis() {
   const [formData, setFormData] = useState({
      amount: "",
      new_device: false,
      foreign_transaction: false,
      transaction_frequency: "",
      location_mismatch: false,
      account_age_days: "",
   });

   const [result, setResult] = useState(null);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState("");

   const handleChange = (e) => {
      const { name, value, type, checked } = e.target;

      setFormData((previous) => ({
         ...previous,
         [name]: type === "checkbox" ? checked : value,
      }));
   };

   const analyzeTransaction = async (e) => {
      e.preventDefault();

      setLoading(true);
      setError("");
      setResult(null);

      try {
         const payload = {
            amount: Number(formData.amount),
            new_device: formData.new_device,
            foreign_transaction: formData.foreign_transaction,
            transaction_frequency: Number(
               formData.transaction_frequency
            ),
            location_mismatch: formData.location_mismatch,
            account_age_days: Number(
               formData.account_age_days
            ),
         };

         const response = await api.post(
            "/transactions/analyze",
            payload
         );

         setResult(response.data);
      } catch (err) {
         console.error("Risk analysis error:", err);

         if (err.response?.data?.detail) {
            setError(
               typeof err.response.data.detail === "string"
                  ? err.response.data.detail
                  : JSON.stringify(err.response.data.detail)
            );
         } else {
            setError(
               "Unable to analyze transaction. Please check that the backend is running."
            );
         }
      } finally {
         setLoading(false);
      }
   };

   const resetForm = () => {
      setFormData({
         amount: "",
         new_device: false,
         foreign_transaction: false,
         transaction_frequency: "",
         location_mismatch: false,
         account_age_days: "",
      });

      setResult(null);
      setError("");
   };

   return (
      <div className="risk-analysis-page">

         {/* HEADER */}

         <div className="risk-header">
            <div>
               <h1>Risk Analysis</h1>

               <p>
                  Analyze a payment transaction using the AI
                  risk engine.
               </p>
            </div>
         </div>

         <div className="risk-layout">

            {/* ================= FORM ================= */}

            <div className="risk-card">

               <h2>Transaction Details</h2>

               <p className="card-description">
                  Enter the transaction information below.
               </p>

               <form onSubmit={analyzeTransaction}>

                  {/* AMOUNT */}

                  <div className="form-group">

                     <label htmlFor="amount">
                        Transaction Amount
                     </label>

                     <input
                        id="amount"
                        name="amount"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="Enter amount"
                        value={formData.amount}
                        onChange={handleChange}
                        required
                     />

                  </div>

                  {/* FREQUENCY */}

                  <div className="form-group">

                     <label htmlFor="transaction_frequency">
                        Transaction Frequency
                     </label>

                     <input
                        id="transaction_frequency"
                        name="transaction_frequency"
                        type="number"
                        min="0"
                        placeholder="Number of transactions"
                        value={formData.transaction_frequency}
                        onChange={handleChange}
                        required
                     />

                  </div>

                  {/* ACCOUNT AGE */}

                  <div className="form-group">

                     <label htmlFor="account_age_days">
                        Account Age
                     </label>

                     <input
                        id="account_age_days"
                        name="account_age_days"
                        type="number"
                        min="0"
                        placeholder="Account age in days"
                        value={formData.account_age_days}
                        onChange={handleChange}
                        required
                     />

                  </div>

                  {/* CHECKBOXES */}

                  <div className="checkbox-section">

                     <label className="checkbox-item">

                        <input
                           type="checkbox"
                           name="new_device"
                           checked={formData.new_device}
                           onChange={handleChange}
                        />

                        <span>
                           New device

                           <small>
                              Transaction from a new device
                           </small>
                        </span>

                     </label>

                     <label className="checkbox-item">

                        <input
                           type="checkbox"
                           name="foreign_transaction"
                           checked={formData.foreign_transaction}
                           onChange={handleChange}
                        />

                        <span>
                           Foreign transaction

                           <small>
                              Transaction from another country
                           </small>
                        </span>

                     </label>

                     <label className="checkbox-item">

                        <input
                           type="checkbox"
                           name="location_mismatch"
                           checked={formData.location_mismatch}
                           onChange={handleChange}
                        />

                        <span>
                           Location mismatch

                           <small>
                              User location differs from usual location
                           </small>
                        </span>

                     </label>

                  </div>

                  {/* BUTTONS */}

                  <div className="form-actions">

                     <button
                        type="submit"
                        className="analyze-button"
                        disabled={loading}
                     >
                        {loading
                           ? "Analyzing..."
                           : "Analyze Transaction"}
                     </button>

                     <button
                        type="button"
                        className="reset-button"
                        onClick={resetForm}
                     >
                        Reset
                     </button>

                  </div>

               </form>

            </div>

            {/* ================= RESULT ================= */}

            <div className="risk-card result-card">

               <h2>Analysis Result</h2>

               <p className="card-description">
                  AI-generated transaction risk assessment.
               </p>

               {/* ERROR */}

               {error && (
                  <div className="analysis-error">

                     <strong>
                        Analysis Failed
                     </strong>

                     <p>
                        {error}
                     </p>

                  </div>
               )}

               {/* EMPTY RESULT */}

               {!result && !error && (
                  <div className="result-empty">

                     <div className="result-icon">
                        AI
                     </div>

                     <h3>
                        No Analysis Yet
                     </h3>

                     <p>
                        Submit a transaction to see its
                        risk assessment.
                     </p>

                  </div>
               )}

               {/* RESULT */}

               {result && (
                  <div className="result-content">

                     {/* RISK LEVEL */}

                     <div className="result-main">

                        <span className="result-label">
                           Risk Level
                        </span>

                        <span
                           className={`result-risk ${String(
                              result.risk_level || ""
                           ).toLowerCase()}`}
                        >
                           {result.risk_level || "UNKNOWN"}
                        </span>

                     </div>

                     {/* RESULT GRID */}

                     <div className="result-grid">

                        <div className="result-item">

                           <span>
                              Risk Score
                           </span>

                           <strong>
                              {result.risk_score ?? "-"}
                           </strong>

                        </div>

                        <div className="result-item">

                           <span>
                              Fraud Probability
                           </span>

                           <strong>
                              {result.fraud_probability != null
                                 ? `${Number(
                                    result.fraud_probability
                                 ).toFixed(2)}%`
                                 : "-"}
                           </strong>

                        </div>

                        <div className="result-item">

                           <span>
                              Decision
                           </span>

                           <strong
                              className={`decision ${String(
                                 result.decision || ""
                              ).toLowerCase()}`}
                           >
                              {result.decision || "-"}
                           </strong>

                        </div>

                     </div>

                     {/* EXPLANATION */}

                     <div className="explanation-box">

                        <h3>
                           Risk Explanation
                        </h3>

                        <p>
                           {result.explanation ||
                              result.reason ||
                              "The AI model analyzed the supplied transaction features."}
                        </p>

                     </div>

                  </div>
               )}

            </div>

         </div>

      </div>
   );
}

export default RiskAnalysis;