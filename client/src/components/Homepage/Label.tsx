import { Button, Stack, Text, em } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

export const Label = () => {
  const isMobile = useMediaQuery(`(max-width: ${em(700)})`);
  const isTablet = useMediaQuery(`(max-width: ${em(834)})`);
  console.log(isTablet);
  return (
    <Stack align={isTablet && !isMobile ? "center" : "flex-start"}>
      <div style={{ height: isMobile ? "7.125rem" : "10.375rem" }}>
        <Text
          size="3.438rem"
          fw={700}
          style={{ lineHeight: "normal", letterSpacing: 0 }}
        >
          Manage Payroll
          <br />
          Like an Expert
        </Text>
      </div>
      <div style={{ height: "4rem", width: "26.25rem" }}>
        <Text
          ta={isTablet && !isMobile ? "center" : "left"}
          size="1rem"
          style={{ lineHeight: "2rem" }}
        >
          Payna is helping you to setting up the payroll without
          <br />
          required any finance skills or knowledge before
        </Text>
      </div>
      <Button radius="lg" style={{ width: "11rem" }}>
        Get Started
      </Button>
    </Stack>
  );
};
