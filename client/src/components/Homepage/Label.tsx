import { Button, Stack, Text, em } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import useUserContext from "../../contexts/UserContext";
import { useNavigate } from "react-router-dom";

export const Label = () => {
  const isMobile = useMediaQuery(`(max-width: ${em(415)})`);
  const isTablet = useMediaQuery(`(max-width: ${em(834)})`);
  const { user } = useUserContext();
  const navigate = useNavigate();

  function google() {
    window.open("http://localhost:8000/auth/google", "_self");
  }

  function handleClick() {
    if (user) {
      navigate("/dashboard");
    } else {
      google();
    }
  }

  return (
    <Stack align={isTablet && !isMobile ? "center" : "flex-start"}>
      <div>
        <Text
          size={isMobile ? "2.45rem" : "3.3rem"}
          fw={700}
          ta={isTablet && !isMobile ? "center" : "left"}
          style={{ lineHeight: "normal", letterSpacing: 0 }}
        >
          Manage Your Finances
          <br />
          Like an{" "}
          <Text
            component="span"
            fw={750}
            variant="gradient"
            gradient={{ from: "cyan", to: "indigo", deg: 45 }}
          >
            Expert
          </Text>
        </Text>
      </div>
      <div style={{ width: "90%" }}>
        <Text
          ta={isTablet && !isMobile ? "center" : "left"}
          size="1rem"
          style={{ lineHeight: "2rem" }}
        >
          Empowering Your Financial Journey. Simplifying Your Life. BudgetBuddy
          helps you take control of your finances with ease. Your ultimate
          partner for a stress-free financial management experience.
        </Text>
      </div>
      <Button onClick={handleClick} radius="lg" style={{ width: "11rem" }}>
        {user ? "Dashboard" : "Get Started"}
      </Button>
    </Stack>
  );
};
