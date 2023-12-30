import { Stack, Text, em } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

const PitchCard = () => {
  const isMobile = useMediaQuery(`(max-width: ${em(415)})`);

  return (
    <Stack w={"23.4rem"} align="center">
      <Text ta="center" size="1rem" c={"#f75c4e"} fw={700}>
        OPTIMIZED SOLUTIONS
      </Text>
      <Text size={isMobile ? "1.75rem" : "2.25rem"} ta="center" fw={700}>
        Tailored to Suit You
      </Text>
      <Text ta={"center"} c="dimmed">
        Streamline your financial journey with tailor-made solutions designed to
        simplify your life. Discover effective tools and strategies to manage
        your finances effortlessly.
      </Text>
    </Stack>
  );
};

export default PitchCard;
