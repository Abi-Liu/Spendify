/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo } from "react";
import { Container, Text } from "@mantine/core";
import useTransactionsContext from "../contexts/TransactionsContext";
import CategoryChart from "./CategoryChart";
import TopVendors from "./TopVendors";

const SpendingAnalysis = () => {
  const { transactions } = useTransactionsContext();

  // we only want the current months transactions
  const currentDate = new Date();
  const transactionsArray = Object.values(transactions).filter(
    (transaction) => {
      // Parse the date string from the transaction object
      const transactionDate = new Date(transaction.date);

      // Check if the transaction date is in the current month
      return (
        transactionDate.getMonth() === currentDate.getMonth() &&
        transactionDate.getFullYear() === currentDate.getFullYear()
      );
    }
  );

  const { categories, names }: any = useMemo(() => {
    const categories: any = {};
    const names: any = {};
    for (const transaction of transactionsArray) {
      const amount = Number(transaction.amount);
      // if the category already exists, add the total, if not create a new key in the object and set the value to the amount.
      if (categories[transaction.personal_finance_category]) {
        categories[transaction.personal_finance_category] += amount;
      } else {
        categories[transaction.personal_finance_category] = amount;
      }

      if (names[transaction.name]) {
        names[transaction.name] += amount;
      } else {
        names[transaction.name] = amount;
      }
    }
    return { categories, names };
  }, [transactionsArray]);

  return (
    <Container>
      <Text ta="center">A Monthly Breakdown of Your Spending</Text>
      <CategoryChart categories={categories} />
      <TopVendors names={names} />
    </Container>
  );
};

export default SpendingAnalysis;
