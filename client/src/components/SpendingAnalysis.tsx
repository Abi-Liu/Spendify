/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo } from "react";
import { Container, Flex, Title, Text, em } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import useTransactionsContext from "../contexts/TransactionsContext";
import CategoryChart from "./CategoryChart";
import TopVendors from "./TopVendors";

const SpendingAnalysis = () => {
  const { transactions } = useTransactionsContext();

  const isMedium = useMediaQuery(`(max-width: ${em(1050)})`);

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
      // we do not want to include negatives into this calculation.
      if (amount > 0) {
        categories[transaction.personal_finance_category] =
          categories[transaction.personal_finance_category] + amount || amount;

        names[transaction.name] = names[transaction.name] + amount || amount;
      }
    }
    return { categories, names };
  }, [transactionsArray]);

  return (
    <Container>
      <Title order={1} ta="center" style={{ margin: "1rem 0rem" }}>
        Monthly Spending
      </Title>
      <Text ta="center" size="xl" style={{ marginBottom: "1rem" }}>
        A breakdown of your monthly spending
      </Text>
      <Flex
        direction={isMedium ? "column" : "row"}
        justify="space-between"
        gap={10}
      >
        <CategoryChart categories={categories} isMedium={isMedium} />
        <TopVendors names={names} isMedium={isMedium} />
      </Flex>
    </Container>
  );
};

export default SpendingAnalysis;
