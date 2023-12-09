import { Account } from "../contexts/AccountsContext";

// calculates networth across total balances for linked accounts. depository and investment are assets, while credit and loans are liabilities.
// net worth is calculated with assets-liabilities
export default function calculateNetworth(accounts: Account[]) {
  let depository = 0;
  let investment = 0;
  let credit = 0;
  let loan = 0;
  for (const account of accounts) {
    const currentBalace = Number(account.current_balance);
    if (account.type === "depository") {
      depository += currentBalace;
    } else if (account.type === "investment") {
      investment += currentBalace;
    } else if (account.type === "credit") {
      credit += currentBalace;
    } else {
      loan += currentBalace;
    }
  }

  return { depository, investment, credit, loan };
}
