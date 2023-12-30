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
      <Flex gap={15}>
        <Avatar src={Money} size={60} />
        <Stack gap={8}>
          <Text fw={600} size="1.25rem">
            Track Expenses
          </Text>
          <Text c="dimmed" size="1rem">
            Automatically track your transactions throughout all of your bank
            and credit card accounts
          </Text>
        </Stack>
      </Flex>
      <Flex gap={15}>
        <Avatar src={PiggyBank} size={60} />
        <Stack gap={8}>
          <Text fw={600} size="1.25rem">
            Maintain Budget
          </Text>
          <Text c="dimmed" size="1rem">
            Keep your spending in check with a monthly budgeting system
          </Text>
        </Stack>
      </Flex>
      <Flex gap={15}>
        <Avatar src={Networth} size={60} />
        <Stack gap={8}>
          <Text fw={600} size="1.25rem">
            Monitor Networth
          </Text>
          <Text c="dimmed" size="1rem">
            View changes in your networth
          </Text>
        </Stack>
      </Flex>
    </SimpleGrid>
  );
};

export default InfoCards;
