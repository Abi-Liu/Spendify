import { useMemo } from "react";
import { Transactions } from "../contexts/TransactionsContext";
import formatCurrency from "../utils/formatDollar";

export function useExportCsv(transactions: Transactions[]) {
  const { csvData, headers } = useMemo(() => {
    if (transactions?.length) {
      const headers = [
        { label: "Date", key: "date" },
        { label: "Name", key: "name" },
        { label: "Category", key: "category" },
        { label: "Payment Channel", key: "payment_channel" },
        { label: "Amount", key: "amount" },
      ];
      const csvData = [];
      for (const transaction of transactions) {
        csvData.push({
          date: transaction.date,
          name: transaction.name,
          category: transaction.personal_finance_category,
          payment_channel: transaction.payment_channel,
          amount: formatCurrency(transaction.amount),
        });
      }
      return { csvData, headers };
    }
    return { csvData: "" };
  }, [transactions]);

  return { csvData, headers };
}
