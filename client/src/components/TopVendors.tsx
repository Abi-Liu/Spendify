/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo } from "react";
import { Flex, Text, Title } from "@mantine/core";
import formatCurrency from "../utils/formatDollar";

interface TopVendorsProps {
  names: { [key: string]: number };
}

const TopVendors = ({ names }: TopVendorsProps) => {
  // converts the object into a 2D array containing the name and amount.
  // we can then sort the array and get the top 5 vendors
  const topFive = useMemo(() => {
    const namesArray: any = [];
    for (const name in names) {
      namesArray.push([name, names[name]]);
    }
    namesArray.sort((a: any[], b: any[]) => b[1] - a[1]);
    return namesArray.slice(0, 5);
  }, [names]);

  return (
    <Flex direction="column" align="center">
      <Title order={3} ta="center">
        Top 5 Vendors
      </Title>
      {topFive.map((vendor: [string, number]) => (
        <Flex justify="space-between">
          <Text>{vendor[0]}</Text>
          <Text>{formatCurrency(vendor[1])}</Text>
        </Flex>
      ))}
    </Flex>
  );
};

export default TopVendors;
