import { Account } from "../contexts/AccountsContext";

// calculates networth across total balances for linked accounts. depository and investment are assets, while credit and loans are liabilities.
// net worth is calculated with assets-liabilities
export default function calculateNetworth(accounts: Account[]) {
  let depository = 0;
  let investment = 0;
  let credit = 0;
  let loan = 0;
  for (const account of accounts) {
    if (account.type === "depository") {
      depository += account.current_balance;
    } else if (account.type === "investment") {
      investment += account.current_balance;
    } else if (account.type === "credit") {
      credit += account.current_balance;
    } else {
      loan += account.current_balance;
    }
  }
  return { depository, investment, credit, loan };
}
