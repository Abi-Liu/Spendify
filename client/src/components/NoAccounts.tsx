import { Container, Flex, Text } from "@mantine/core";

// component will be shown whenever a user has not yet linked an account
const NoAccounts = () => {
  return (
    <Container mt={15}>
      <Flex
        direction="column"
        style={{ width: "100%", height: "100vh" }}
        gap={15}
      >
        <Text size="2rem">You have no linked accounts</Text>
        <Text size="1.5rem">Link an account to get started</Text>
      </Flex>
    </Container>
  );
};

export default NoAccounts;
