import { useEffect, useState } from "react";
import api from "../api";
import "./Transactions.css";

function Transactions() {
   const [transactions, setTransactions] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState("");

   const [search, setSearch] = useState("");
   const [riskFilter, setRiskFilter] = useState("ALL");
   const [decisionFilter, setDecisionFilter] = useState("ALL");

   const loadTransactions = async () => {
      try {
         setLoading(true);
         setError("");

         const response = await api.get("/transactions/history");

         const data = Array.isArray(response.data)
            ? response.data
            : response.data?.transactions || [];

         setTransactions(data);
      } catch (err) {
         console.error("Transactions error:", err);

         setError(
            err.response?.data?.detail ||
            "Unable to load transactions."
         );
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      loadTransactions();
   }, []);

   const filteredTransactions = transactions.filter(
      (transaction) => {
         const searchText = search.toLowerCase();

         const matchesSearch =
            String(transaction.id || "")
               .toLowerCase()
               .includes(searchText) ||
            String(transaction.amount || "")
               .toLowerCase()
               .includes(searchText) ||
            String(transaction.risk_level || "")
               .toLowerCase()
               .includes(searchText) ||
            String(transaction.decision || "")
               .toLowerCase()
               .includes(searchText);

         const matchesRisk =
            riskFilter === "ALL" ||
            String(transaction.risk_level || "").toUpperCase() ===
            riskFilter;

         const matchesDecision =
            decisionFilter === "ALL" ||
            String(transaction.decision || "").toUpperCase() ===
            decisionFilter;

         return (
            matchesSearch &&
            matchesRisk &&
            matchesDecision
         );
      }
   );

   return (
      <div className="transactions-page">

         <div className="transactions-header">
            <div>
               <h1>Transactions</h1>

               <p>
                  View and monitor analyzed payment transactions.
               </p>
            </div>

            <button
               type="button"
               className="refresh-button"
               onClick={loadTransactions}
            >
               Refresh
            </button>
         </div>

         <div className="filters-card">

            <div className="search-box">
               <label>Search</label>

               <input
                  type="text"
                  placeholder="Search transaction..."
                  value={search}
                  onChange={(e) =>
                     setSearch(e.target.value)
                  }
               />
            </div>

            <div className="filter-box">
               <label>Risk Level</label>

               <select
                  value={riskFilter}
                  onChange={(e) =>
                     setRiskFilter(e.target.value)
                  }
               >
                  <option value="ALL">
                     All Risk Levels
                  </option>

                  <option value="LOW">
                     Low
                  </option>

                  <option value="MEDIUM">
                     Medium
                  </option>

                  <option value="HIGH">
                     High
                  </option>
               </select>
            </div>

            <div className="filter-box">
               <label>Decision</label>

               <select
                  value={decisionFilter}
                  onChange={(e) =>
                     setDecisionFilter(e.target.value)
                  }
               >
                  <option value="ALL">
                     All Decisions
                  </option>

                  <option value="APPROVED">
                     Approved
                  </option>

                  <option value="REVIEW">
                     Review
                  </option>

                  <option value="BLOCKED">
                     Blocked
                  </option>
               </select>
            </div>

            <div className="transaction-count">
               <span>Showing</span>

               <strong>
                  {filteredTransactions.length}
               </strong>

               <span>transactions</span>
            </div>

         </div>

         {error && (
            <div className="transactions-error">
               <strong>Error</strong>

               <p>{error}</p>
            </div>
         )}

         <div className="transactions-card">

            {loading ? (
               <div className="transactions-loading">
                  <p>Loading transactions...</p>
               </div>
            ) : filteredTransactions.length === 0 ? (
               <div className="transactions-empty">

                  <div className="empty-icon">
                     TX
                  </div>

                  <h3>
                     No Transactions Found
                  </h3>

                  <p>
                     Analyze a transaction from the
                     Risk Analysis page to see it here.
                  </p>

               </div>
            ) : (
               <div className="transactions-table-wrapper">

                  <table className="transactions-table">

                     <thead>
                        <tr>
                           <th>ID</th>
                           <th>Amount</th>
                           <th>Risk Score</th>
                           <th>Risk Level</th>
                           <th>Fraud Probability</th>
                           <th>Decision</th>
                           <th>Date</th>
                        </tr>
                     </thead>

                     <tbody>
                        {filteredTransactions.map(
                           (transaction) => (
                              <tr key={transaction.id}>

                                 <td>
                                    <strong>
                                       #{transaction.id}
                                    </strong>
                                 </td>

                                 <td>
                                    ₹
                                    {Number(
                                       transaction.amount || 0
                                    ).toLocaleString("en-IN")}
                                 </td>

                                 <td>
                                    {transaction.risk_score ?? "-"}
                                 </td>

                                 <td>
                                    <span
                                       className={`transaction-badge risk-${String(
                                          transaction.risk_level || ""
                                       ).toLowerCase()}`}
                                    >
                                       {transaction.risk_level || "-"}
                                    </span>
                                 </td>

                                 <td>
                                    {transaction.fraud_probability != null
                                       ? `${Number(
                                          transaction.fraud_probability
                                       ).toFixed(2)}%`
                                       : "-"}
                                 </td>

                                 <td>
                                    <span
                                       className={`transaction-badge decision-${String(
                                          transaction.decision || ""
                                       ).toLowerCase()}`}
                                    >
                                       {transaction.decision || "-"}
                                    </span>
                                 </td>

                                 <td>
                                    {transaction.created_at
                                       ? new Date(
                                          transaction.created_at
                                       ).toLocaleString()
                                       : "-"}
                                 </td>

                              </tr>
                           )
                        )}
                     </tbody>

                  </table>

               </div>
            )}

         </div>

      </div>
   );
}

export default Transactions;