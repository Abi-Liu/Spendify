import { Code, Stack, Text } from "@mantine/core";

const CredentialsModule = () => {
  return (
    <Stack>
      <Text size="sm">
        This demo is using Plaid's sandbox mode to allow users to test and play
        around with the application in a controlled environment. You will{" "}
        <strong>NOT</strong> need to enter your financial institution
        credentials.
      </Text>
      <Text size="sm">
        To link your account to your designated financial institution, simply
        click on the turqoise <Code>+</Code> icon on the side bar to initialize
        the link flow.
      </Text>
      <Text size="sm">
        When prompted for credentials, in most cases you can leave the fields
        blank and just proceed through the authentication flow. However, if you
        are required to enter credentials, you can use the credentials listed
        below:
      </Text>
      <Code>
        username: user_good <br />
        password: pass_good <br />
        pin: credential_good (when required)
      </Code>
    </Stack>
  );
};

export default CredentialsModule;
