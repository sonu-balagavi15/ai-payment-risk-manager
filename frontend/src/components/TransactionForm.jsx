import { useState } from "react";
import api from "../api";

function TransactionForm({ onTransactionAnalyzed }) {
   const [formData, setFormData] = useState({
      amount: "",
      new_device: false,
      foreign_location: false,
      failed_attempts: 0,
      transaction_hour: 12,
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

   const handleSubmit = async (e) => {
      e.preventDefault();

      setLoading(true);
      setError("");
      setResult(null);

      try {
         const payload = {
            amount: Number(formData.amount),
            new_device: Boolean(formData.new_device),
            foreign_location: Boolean(formData.foreign_location),
            failed_attempts: Number(formData.failed_attempts),
            transaction_hour: Number(formData.transaction_hour),
         };

         const response = await api.post(
            "/transactions/analyze",
            payload
         );

         setResult(response.data);

         if (onTransactionAnalyzed) {
            onTransactionAnalyzed(response.data);
         }
      } catch (err) {
         console.error(
            "Transaction analysis error:",
            err
         );

         if (err.response?.status === 401) {
            setError(
               "Session expired. Please login again."
            );
         } else if (err.response?.status === 422) {
            setError(
               "Please enter valid transaction details."
            );
         } else {
            setError(
               "Cannot connect to FastAPI. Make sure the backend is running on port 8000."
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
         foreign_location: false,
         failed_attempts: 0,
         transaction_hour: 12,
      });

      setResult(null);
      setError("");
   };

   return (
      <div className="transaction-form-container">

         <div className="form-header">
            <h1>Analyze Transaction</h1>

            <p>
               Analyze payment risk using the AI Risk Engine.
            </p>
         </div>

         <form onSubmit={handleSubmit}>

            <div className="form-section">

               <h2>Transaction Details</h2>

               <div className="form-group">
                  <label>
                     Transaction Amount
                  </label>

                  <input
                     type="number"
                     name="amount"
                     value={formData.amount}
                     onChange={handleChange}
                     placeholder="Enter amount"
                     min="1"
                     step="0.01"
                     required
                  />
               </div>

               <div className="form-group">
                  <label>
                     Failed Attempts
                  </label>

                  <input
                     type="number"
                     name="failed_attempts"
                     value={formData.failed_attempts}
                     onChange={handleChange}
                     min="0"
                     required
                  />
               </div>

               <div className="form-group">
                  <label>
                     Transaction Hour
                  </label>

                  <input
                     type="number"
                     name="transaction_hour"
                     value={formData.transaction_hour}
                     onChange={handleChange}
                     min="0"
                     max="23"
                     required
                  />

                  <small>
                     Enter a value from 0 to 23.
                  </small>
               </div>

               <div className="checkbox-group">

                  <label>
                     <input
                        type="checkbox"
                        name="new_device"
                        checked={formData.new_device}
                        onChange={handleChange}
                     />

                     <span>
                        New Device
                     </span>
                  </label>

                  <label>
                     <input
                        type="checkbox"
                        name="foreign_location"
                        checked={formData.foreign_location}
                        onChange={handleChange}
                     />

                     <span>
                        Foreign Location
                     </span>
                  </label>

               </div>

            </div>

            {error && (
               <div className="error-message">

                  <strong>
                     Analysis Failed
                  </strong>

                  <p>
                     {error}
                  </p>

               </div>
            )}

            <button
               type="submit"
               disabled={loading}
               className="analyze-button"
            >
               {loading
                  ? "Analyzing..."
                  : "Analyze Transaction"}
            </button>

         </form>

         {result && (
            <div className="analysis-result">

               <h2>
                  Analysis Result
               </h2>

               <div className="result-grid">

                  <div className="result-item">
                     <span>
                        Risk Score
                     </span>

                     <strong>
                        {result.risk_score}
                     </strong>
                  </div>

                  <div className="result-item">
                     <span>
                        Risk Level
                     </span>

                     <strong>
                        {result.risk_level}
                     </strong>
                  </div>

                  <div className="result-item">
                     <span>
                        Decision
                     </span>

                     <strong>
                        {result.decision}
                     </strong>
                  </div>

                  <div className="result-item">
                     <span>
                        ML Risk Score
                     </span>

                     <strong>
                        {result.ml_risk_score}
                     </strong>
                  </div>

                  <div className="result-item">
                     <span>
                        Fraud Probability
                     </span>

                     <strong>
                        {Number(
                           result.fraud_probability || 0
                        ).toFixed(2)}
                        %
                     </strong>
                  </div>

               </div>

               <div className="reasons-section">

                  <h3>
                     Risk Reasons
                  </h3>

                  {result.reasons &&
                     result.reasons.length > 0 ? (

                     <ul>
                        {result.reasons.map(
                           (reason, index) => (
                              <li key={index}>
                                 {reason}
                              </li>
                           )
                        )}
                     </ul>

                  ) : (

                     <p>
                        No major risk indicators detected.
                     </p>

                  )}

               </div>

               <button
                  type="button"
                  onClick={resetForm}
                  className="secondary-button"
               >
                  Analyze Another Transaction
               </button>

            </div>
         )}

      </div>
   );
}

export default TransactionForm;