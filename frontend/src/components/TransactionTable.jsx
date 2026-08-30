function TransactionTable({ transactions }) {
   if (!transactions || transactions.length === 0) {
      return (
         <div className="empty-state">
            <p>No transactions found.</p>
         </div>
      );
   }

   return (
      <div className="transaction-table-container">
         <table className="transaction-table">
            <thead>
               <tr>
                  <th>Amount</th>
                  <th>Risk Score</th>
                  <th>Risk Level</th>
                  <th>Decision</th>
                  <th>New Device</th>
                  <th>Foreign Location</th>
                  <th>Failed Attempts</th>
                  <th>Hour</th>
               </tr>
            </thead>

            <tbody>
               {transactions.map((transaction, index) => (
                  <tr key={transaction.id || index}>
                     <td>
                        ₹{Number(transaction.amount || 0).toFixed(2)}
                     </td>

                     <td>
                        {transaction.risk_score ?? 0}
                     </td>

                     <td>
                        <span
                           className={`risk-badge ${String(
                              transaction.risk_level || "UNKNOWN"
                           ).toLowerCase()}`}
                        >
                           {transaction.risk_level || "UNKNOWN"}
                        </span>
                     </td>

                     <td>
                        <span
                           className={`decision-badge ${String(
                              transaction.decision || "UNKNOWN"
                           ).toLowerCase()}`}
                        >
                           {transaction.decision || "UNKNOWN"}
                        </span>
                     </td>

                     <td>
                        {transaction.new_device ? "Yes" : "No"}
                     </td>

                     <td>
                        {transaction.foreign_location ? "Yes" : "No"}
                     </td>

                     <td>
                        {transaction.failed_attempts ?? 0}
                     </td>

                     <td>
                        {transaction.transaction_hour ?? "-"}
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
   );
}

export default TransactionTable;