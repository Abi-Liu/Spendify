import { Avatar, Flex, SimpleGrid, Stack, Text, em } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import Money from "../../assets/Money.png";
import PiggyBank from "../../assets/PiggyBank.png";
import Networth from "../../assets/Networth.png";

const InfoCards = () => {
  const isTablet = useMediaQuery(`(max-width: ${em(834)})`);

  let cols;

  if (isTablet) {
    cols = 1;
  } else {
    cols = 3;
  }

  return (
    <SimpleGrid cols={cols} pt={"10rem"}>
      <Flex gap={15} maw={370}>
        <Avatar src={Money} size={60} />
        <Stack gap={8}>
          <Text fw={600} size="1.25rem">
            Track Expenses
          </Text>
          <Text c="dimmed" size="1rem">
            Effortlessly monitor and record your financial transactions across
            multiple bank and credit card accounts
          </Text>
        </Stack>
      </Flex>
      <Flex gap={15} maw={370}>
        <Avatar src={PiggyBank} size={60} />
        <Stack gap={8}>
          <Text fw={600} size="1.25rem">
            Control Spending
          </Text>
          <Text c="dimmed" size="1rem">
            Keep your spending habits in check with an intuitive and
            user-friendly monthly budgeting system
          </Text>
        </Stack>
      </Flex>
      <Flex gap={15} maw={370}>
        <Avatar src={Networth} size={60} />
        <Stack gap={8}>
          <Text fw={600} size="1.25rem">
            Monitor Your Financial Growth
          </Text>
          <Text c="dimmed" size="1rem">
            Get insights into your financial growth by visualizing and tracking
            changes in your net worth over time
          </Text>
        </Stack>
      </Flex>
    </SimpleGrid>
  );
};

export default InfoCards;
