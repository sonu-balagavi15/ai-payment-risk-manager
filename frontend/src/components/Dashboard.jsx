import { useEffect, useState } from "react";

import {
   BarChart,
   Bar,
   PieChart,
   Pie,
   Cell,
   XAxis,
   YAxis,
   CartesianGrid,
   Tooltip,
   Legend,
   ResponsiveContainer,
} from "recharts";

import api from "../api";

function Dashboard() {
   const [stats, setStats] = useState(null);
   const [transactions, setTransactions] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState("");

   // =========================
   // LOAD DASHBOARD DATA
   // =========================

   const loadDashboard = async () => {
      try {
         setLoading(true);
         setError("");

         const [statsResponse, historyResponse] =
            await Promise.all([
               api.get("/transactions/stats"),
               api.get("/transactions/history"),
            ]);

         const statsData = statsResponse.data;

         const historyData = Array.isArray(historyResponse.data)
            ? historyResponse.data
            : historyResponse.data?.transactions || [];

         setStats(statsData);
         setTransactions(historyData);

         console.log("Dashboard stats:", statsData);
         console.log("Dashboard transactions:", historyData);
      } catch (err) {
         console.error("Dashboard error:", err);

         setError(
            err.response?.data?.detail ||
            "Unable to load dashboard data."
         );
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      loadDashboard();
   }, []);

   // =========================
   // RISK DISTRIBUTION
   // Calculate directly from transactions
   // =========================

   const lowRiskCount = transactions.filter(
      (transaction) =>
         String(transaction.risk_level || "")
            .trim()
            .toUpperCase() === "LOW"
   ).length;

   const mediumRiskCount = transactions.filter(
      (transaction) =>
         String(transaction.risk_level || "")
            .trim()
            .toUpperCase() === "MEDIUM"
   ).length;

   const highRiskCount = transactions.filter(
      (transaction) =>
         String(transaction.risk_level || "")
            .trim()
            .toUpperCase() === "HIGH"
   ).length;

   const riskData = [
      {
         name: "Low",
         value: lowRiskCount,
      },
      {
         name: "Medium",
         value: mediumRiskCount,
      },
      {
         name: "High",
         value: highRiskCount,
      },
   ];

   // =========================
   // DECISION DISTRIBUTION
   // Calculate directly from transactions
   // =========================

   const approvedCount = transactions.filter(
      (transaction) => {
         const decision = String(
            transaction.decision || ""
         )
            .trim()
            .toUpperCase();

         return (
            decision === "APPROVE" ||
            decision === "APPROVED"
         );
      }
   ).length;

   const reviewCount = transactions.filter(
      (transaction) =>
         String(transaction.decision || "")
            .trim()
            .toUpperCase() === "REVIEW"
   ).length;

   const blockedCount = transactions.filter(
      (transaction) => {
         const decision = String(
            transaction.decision || ""
         )
            .trim()
            .toUpperCase();

         return (
            decision === "BLOCK" ||
            decision === "BLOCKED"
         );
      }
   ).length;

   const decisionData = [
      {
         name: "Approved",
         value: approvedCount,
      },
      {
         name: "Review",
         value: reviewCount,
      },
      {
         name: "Blocked",
         value: blockedCount,
      },
   ];

   // =========================
   // COLORS
   // =========================

   const riskColors = [
      "#22c55e",
      "#f59e0b",
      "#ef4444",
   ];

   const decisionColors = [
      "#22c55e",
      "#f59e0b",
      "#ef4444",
   ];

   // =========================
   // RISK SCORE TREND
   // =========================

   const transactionTrend = [...transactions]
      .slice(0, 10)
      .reverse()
      .map((transaction, index) => ({
         name: `#${transaction.id ?? index + 1}`,
         risk: Number(
            transaction.risk_score ?? 0
         ),
         amount: Number(
            transaction.amount ?? 0
         ),
      }));

   // =========================
   // LOADING
   // =========================

   if (loading) {
      return (
         <div className="dashboard-page">
            <h1>Dashboard</h1>
            <p>Loading dashboard...</p>
         </div>
      );
   }

   // =========================
   // RETURN
   // =========================

   return (
      <div className="dashboard-page">

         {/* ================= HEADER ================= */}

         <div className="dashboard-header">

            <div>
               <h1>Dashboard</h1>

               <p>
                  AI Payment Risk Manager overview
               </p>
            </div>

            <button
               type="button"
               onClick={loadDashboard}
               className="refresh-button"
            >
               Refresh Data
            </button>

         </div>

         {/* ================= ERROR ================= */}

         {error && (
            <div className="error-message">
               <strong>Dashboard Error</strong>

               <p>{error}</p>
            </div>
         )}

         {/* ================= STAT CARDS ================= */}

         <div className="stats-grid">

            <div className="stat-card">
               <span>Total Transactions</span>

               <strong>
                  {stats?.total_transactions ??
                     transactions.length}
               </strong>

               <small>
                  Analyzed payments
               </small>
            </div>

            <div className="stat-card">
               <span>Average Risk Score</span>

               <strong>
                  {Number(
                     stats?.average_risk_score ?? 0
                  ).toFixed(2)}
               </strong>

               <small>
                  Overall risk score
               </small>
            </div>

            <div className="stat-card">
               <span>High Risk</span>

               <strong>
                  {stats?.high_risk_percentage ??
                     (
                        transactions.length > 0
                           ? (
                              (highRiskCount /
                                 transactions.length) *
                              100
                           ).toFixed(0)
                           : 0
                     )}
                  %
               </strong>

               <small>
                  High-risk transactions
               </small>
            </div>

            <div className="stat-card">
               <span>Approved</span>

               <strong>
                  {stats?.approved ??
                     approvedCount}
               </strong>

               <small>
                  Approved payments
               </small>
            </div>

            <div className="stat-card">
               <span>Review</span>

               <strong>
                  {stats?.review ??
                     reviewCount}
               </strong>

               <small>
                  Need review
               </small>
            </div>

            <div className="stat-card">
               <span>Blocked</span>

               <strong>
                  {stats?.blocked ??
                     blockedCount}
               </strong>

               <small>
                  Blocked payments
               </small>
            </div>

         </div>

         {/* ================= CHARTS ================= */}

         <div className="charts-grid">

            {/* ================= RISK DISTRIBUTION ================= */}

            <div className="chart-card">

               <div className="chart-header">

                  <h2>
                     Risk Distribution
                  </h2>

                  <span>
                     Transactions by risk level
                  </span>

               </div>

               <div className="chart-container">

                  {transactions.length === 0 ? (

                     <div className="empty-state">
                        <h3>
                           No transaction data
                        </h3>

                        <p>
                           Analyze a transaction to
                           see the risk distribution.
                        </p>
                     </div>

                  ) : (

                     <ResponsiveContainer
                        width="100%"
                        height={300}
                     >

                        <PieChart>

                           <Pie
                              data={riskData}
                              dataKey="value"
                              nameKey="name"
                              cx="50%"
                              cy="50%"
                              outerRadius={100}
                              label={({ name, value }) =>
                                 `${name}: ${value}`
                              }
                           >

                              {riskData.map(
                                 (entry, index) => (
                                    <Cell
                                       key={`risk-${index}`}
                                       fill={
                                          riskColors[index]
                                       }
                                    />
                                 )
                              )}

                           </Pie>

                           <Tooltip />

                           <Legend />

                        </PieChart>

                     </ResponsiveContainer>

                  )}

               </div>

            </div>

            {/* ================= DECISION DISTRIBUTION ================= */}

            <div className="chart-card">

               <div className="chart-header">

                  <h2>
                     Decision Distribution
                  </h2>

                  <span>
                     Payment decisions
                  </span>

               </div>

               <div className="chart-container">

                  {transactions.length === 0 ? (

                     <div className="empty-state">
                        <h3>
                           No transaction data
                        </h3>

                        <p>
                           Analyze a transaction to
                           see payment decisions.
                        </p>
                     </div>

                  ) : (

                     <ResponsiveContainer
                        width="100%"
                        height={300}
                     >

                        <PieChart>

                           <Pie
                              data={decisionData}
                              dataKey="value"
                              nameKey="name"
                              cx="50%"
                              cy="50%"
                              outerRadius={100}
                              label={({ name, value }) =>
                                 `${name}: ${value}`
                              }
                           >

                              {decisionData.map(
                                 (entry, index) => (
                                    <Cell
                                       key={`decision-${index}`}
                                       fill={
                                          decisionColors[index]
                                       }
                                    />
                                 )
                              )}

                           </Pie>

                           <Tooltip />

                           <Legend />

                        </PieChart>

                     </ResponsiveContainer>

                  )}

               </div>

            </div>

            {/* ================= RISK SCORE TREND ================= */}

            <div className="chart-card chart-wide">

               <div className="chart-header">

                  <h2>
                     Risk Score Trend
                  </h2>

                  <span>
                     Latest transactions
                  </span>

               </div>

               <div className="chart-container">

                  {transactionTrend.length === 0 ? (

                     <div className="empty-state">

                        <h3>
                           No transaction data
                        </h3>

                        <p>
                           Analyze transactions to
                           see the risk score trend.
                        </p>

                     </div>

                  ) : (

                     <ResponsiveContainer
                        width="100%"
                        height={320}
                     >

                        <BarChart
                           data={transactionTrend}
                        >

                           <CartesianGrid
                              strokeDasharray="3 3"
                           />

                           <XAxis
                              dataKey="name"
                           />

                           <YAxis />

                           <Tooltip />

                           <Legend />

                           <Bar
                              dataKey="risk"
                              name="Risk Score"
                              fill="#2563eb"
                              radius={[
                                 5,
                                 5,
                                 0,
                                 0,
                              ]}
                           />

                        </BarChart>

                     </ResponsiveContainer>

                  )}

               </div>

            </div>

         </div>

         {/* ================= RECENT TRANSACTIONS ================= */}

         <div className="dashboard-section">

            <div className="section-header">

               <h2>
                  Recent Transactions
               </h2>

               <span>
                  Latest 10 transactions
               </span>

            </div>

            {transactions.length === 0 ? (

               <div className="empty-state">

                  <h3>
                     No transaction data available
                  </h3>

                  <p>
                     Analyze your first payment
                     transaction to see results here.
                  </p>

               </div>

            ) : (

               <div className="table-container">

                  <table>

                     <thead>

                        <tr>
                           <th>ID</th>
                           <th>Amount</th>
                           <th>Risk Score</th>
                           <th>Risk Level</th>
                           <th>Decision</th>
                           <th>Fraud Probability</th>
                           <th>Date</th>
                        </tr>

                     </thead>

                     <tbody>

                        {transactions
                           .slice(0, 10)
                           .map((transaction, index) => (

                              <tr
                                 key={
                                    transaction.id ??
                                    index
                                 }
                              >

                                 <td>
                                    #
                                    {transaction.id ??
                                       index + 1}
                                 </td>

                                 <td>
                                    ₹
                                    {Number(
                                       transaction.amount ??
                                       0
                                    ).toLocaleString(
                                       "en-IN"
                                    )}
                                 </td>

                                 <td>
                                    {transaction.risk_score ??
                                       "-"}
                                 </td>

                                 <td>

                                    <span
                                       className={`risk-badge ${String(
                                          transaction.risk_level ||
                                          ""
                                       ).toLowerCase()}`}
                                    >
                                       {transaction.risk_level ??
                                          "-"}
                                    </span>

                                 </td>

                                 <td>

                                    <span
                                       className={`decision-badge ${String(
                                          transaction.decision ||
                                          ""
                                       ).toLowerCase()}`}
                                    >
                                       {transaction.decision ??
                                          "-"}
                                    </span>

                                 </td>

                                 <td>
                                    {transaction.fraud_probability !=
                                       null
                                       ? `${Number(
                                          transaction.fraud_probability
                                       ).toFixed(2)}%`
                                       : "-"}
                                 </td>

                                 <td>
                                    {transaction.created_at
                                       ? new Date(
                                          transaction.created_at
                                       ).toLocaleString()
                                       : "-"}
                                 </td>

                              </tr>

                           ))}

                     </tbody>

                  </table>

               </div>

            )}

         </div>

      </div>
   );
}

export default Dashboard;
