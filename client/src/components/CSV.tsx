import { useExportCsv } from "../hooks/useExportCsv";
import { Transactions } from "../contexts/TransactionsContext";
import { CSVLink } from "react-csv";

interface CSVProps {
  transactions: Transactions[];
}
const CSV = ({ transactions }: CSVProps) => {
  const { csvData, headers } = useExportCsv(transactions);
  return (
    <CSVLink
      data={csvData}
      headers={headers}
      filename="Transactions"
      target="_blank"
      style={{ textDecoration: "none", color: "inherit", fontSize: ".9rem" }}
    >
      Export to CSV
    </CSVLink>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export default CSV;
