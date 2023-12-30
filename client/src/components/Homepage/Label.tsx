import { Button, Stack, Text, em } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

export const Label = () => {
  const isMobile = useMediaQuery(`(max-width: ${em(375)})`);
  const isTablet = useMediaQuery(`(max-width: ${em(834)})`);

  return (
    <Stack align={isTablet && !isMobile ? "center" : "flex-start"}>
      <div>
        <Text
          size="3.3rem"
          fw={700}
          style={{ lineHeight: "normal", letterSpacing: 0 }}
        >
          Manage Your Finances
          <br />
          Like an Expert
        </Text>
      </div>
      <div>
        <Text
          ta={isTablet && !isMobile ? "center" : "left"}
          size="1rem"
          style={{ lineHeight: "2rem" }}
        >
          Empowering Your Financial Journey, Simplifying Your Life. BudgetBuddy
          helps you take control of your finances with ease. Your ultimate
          partner for a stress-free financial management experience.
        </Text>
      </div>
      <Button radius="lg" style={{ width: "11rem" }}>
        Get Started
      </Button>
    </Stack>
  );
};
