/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from "react";
import { Card, Container, Flex, Image, Stack, Text, em } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import useTransactionsContext from "../contexts/TransactionsContext";
import CategoryChart from "./graphs/CategoryChart";
import TopVendors from "./TopVendors";
import NoData from "../assets/NoData.png";

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
      <Text size="2.5rem" ta="center" fw={600} style={{ margin: "1rem 0rem" }}>
        Monthly Summary
      </Text>
      <Text ta="center" size="xl" c="dimmed" style={{ marginBottom: "1rem" }}>
        A breakdown of your monthly spending habits
      </Text>
      <Flex
        direction={isMedium ? "column" : "row"}
        justify="space-around"
        gap={isMedium ? "lg" : "xs"}
      >
        {transactionsArray.length > 0 ? (
          <>
            <CategoryChart categories={categories} isMedium={isMedium} />
            <TopVendors names={names} isMedium={isMedium} />
          </>
        ) : (
          <Card withBorder shadow="lg">
            <Stack align="center" gap="4rem">
              <Text size="xl" ta="center" pt={"1rem"}>
                No transactions recorded this month. Check back later!
              </Text>
              <Image h={200} w="auto" fit="contain" src={NoData} />
            </Stack>
          </Card>
        )}
      </Flex>
    </Container>
  );
};

export default SpendingAnalysis;
