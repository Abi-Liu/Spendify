import { em, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import React from "react";

const Analytics = () => {
  const isTablet = useMediaQuery(`(max-width: ${em(834)})`);

  return (
    <div
      style={{
        height: "10rem",
        width: "13.3rem",
        display: isTablet ? "none" : "",
      }}
    >
      <Text size="1rem" style={{ lineHeight: "normal" }}>
        Analytics
      </Text>
      <Text c="dimmed">Real time reporting</Text>
    </div>
  );
};

export default Analytics;
