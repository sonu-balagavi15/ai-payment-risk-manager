function ExportButton({ transactions }) {
   const exportCSV = () => {
      if (!transactions || transactions.length === 0) {
         alert("No transactions available to export.");
         return;
      }

      const headers = [
         "ID",
         "Amount",
         "New Device",
         "Foreign Location",
         "Failed Attempts",
         "Transaction Hour",
         "Risk Score",
         "Risk Level",
         "Decision",
         "Created At",
      ];

      const rows = transactions.map((transaction) => [
         transaction.id ?? "",
         transaction.amount ?? "",
         transaction.new_device ? "Yes" : "No",
         transaction.foreign_location ? "Yes" : "No",
         transaction.failed_attempts ?? "",
         transaction.transaction_hour ?? "",
         transaction.risk_score ?? "",
         transaction.risk_level ?? "",
         transaction.decision ?? "",
         transaction.created_at ?? "",
      ]);

      const csvContent = [
         headers,
         ...rows,
      ]
         .map((row) =>
            row
               .map((value) => {
                  const text = String(value ?? "");

                  return `"${text.replace(/"/g, '""')}"`;
               })
               .join(",")
         )
         .join("\n");

      const blob = new Blob(
         [csvContent],
         {
            type: "text/csv;charset=utf-8;",
         }
      );

      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;

      link.download =
         `payment-risk-report-${new Date()
            .toISOString()
            .slice(0, 10)}.csv`;

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      URL.revokeObjectURL(url);
   };

   return (
      <button
         className="export-button"
         onClick={exportCSV}
         disabled={
            !transactions ||
            transactions.length === 0
         }
      >
         Export CSV
      </button>
   );
}

export default ExportButton;