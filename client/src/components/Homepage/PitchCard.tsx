import { Stack, Text, em } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

const PitchCard = () => {
  const isMobile = useMediaQuery(`(max-width: ${em(375)})`);

  return (
    <Stack w={"23.4rem"} align="center">
      <Text ta="center" size="1rem" c={"#f75c4e"} fw={700}>
        WORK BETTER
      </Text>
      <Text size={isMobile ? "1.75rem" : "2.25rem"} fw={700}>
        For Your Business
      </Text>
      <Text ta={"center"} c="dimmed">
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Molestias
        asdfsd saldkfjsdlk sdaflkjl
      </Text>
    </Stack>
  );
};

export default PitchCard;
