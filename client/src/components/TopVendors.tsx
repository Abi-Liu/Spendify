/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo } from "react";
import { Container, Flex, Text, Title } from "@mantine/core";
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
    <Container style={{ width: "45%", border: "1px solid #808080" }}>
      <Flex
        direction="column"
        align="space-between"
        style={{ marginTop: "1rem", height: "100%" }}
      >
        <Text size="1.5rem" ta="center" style={{ marginTop: "1.25rem" }}>
          Top 5 Vendors
        </Text>
        <Flex
          style={{ marginTop: "1rem", height: "65%" }}
          direction="column"
          justify="space-between"
        >
          {topFive.map((vendor: [string, number]) => (
            <Flex justify="space-between" gap={10}>
              <Text>{vendor[0]}</Text>
              <Text>{formatCurrency(vendor[1])}</Text>
            </Flex>
          ))}
        </Flex>
      </Flex>
    </Container>
  );
};

export default TopVendors;
