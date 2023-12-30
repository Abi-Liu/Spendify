import { Table, Stack, Text, Divider, Group } from "@mantine/core";
import { Account } from "../contexts/AccountsContext";
import useAssetsContext from "../contexts/AssetsContext";
import useInstitutionsContext from "../contexts/InstitutionsContext";
import calculateNetworth from "../utils/calculateNetworth";
import formatCurrency from "../utils/formatDollar";
import formatTextCapitalization from "../utils/formatText";

interface AccountsTableProps {
  accountsArray: Account[];
}
const AccountsTable = ({ accountsArray }: AccountsTableProps) => {
  const { institutions } = useInstitutionsContext();
  const { assets } = useAssetsContext();

  const assetsArray = Object.values(assets);

  const { depository, investment, credit, loan, assetsTotal } =
    calculateNetworth(accountsArray, assetsArray);

  const cashArray = accountsArray.filter(
    (account) => account.type === "depository"
  );
  const investmentArray = accountsArray.filter(
    (account) => account.type === "investment"
  );
  const creditArray = accountsArray.filter(
    (account) => account.type === "credit"
  );
  const loanArray = accountsArray.filter((account) => account.type === "loan");

  return (
    <>
      <Table.ScrollContainer minWidth={650}>
        <Table my={10} mt={20} withRowBorders={false}>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Account</Table.Th>
              <Table.Th ta="left">Type</Table.Th>
              <Table.Th ta="right">Balance</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {cashArray.length > 0 && (
              <>
                <Table.Tr fw={500} style={{ background: "#EDEDED" }}>
                  <Table.Td>Cash</Table.Td>
                  <Table.Td></Table.Td>
                  <Table.Td ta="right">{formatCurrency(depository)}</Table.Td>
                </Table.Tr>
                {cashArray.map((item) => (
                  <Table.Tr key={item.id}>
                    <Table.Td>
                      <Stack gap={2}>
                        <Text>{institutions.byItemId[item.item_id].name}</Text>
                        <Text size="sm" c="dimmed">
                          {item.name}
                        </Text>
                      </Stack>
                    </Table.Td>
                    <Table.Td ta="left">
                      {formatTextCapitalization(item.subtype)}
                    </Table.Td>
                    <Table.Td ta="right">
                      {formatCurrency(Number(item.current_balance))}
                    </Table.Td>
                  </Table.Tr>
                ))}
              </>
            )}
            {investmentArray.length > 0 && (
              <>
                <Table.Tr fw={500} style={{ background: "#EDEDED" }}>
                  <Table.Td>Investments</Table.Td>
                  <Table.Td></Table.Td>
                  <Table.Td ta="right">{formatCurrency(investment)}</Table.Td>
                </Table.Tr>
                {investmentArray.map((item) => (
                  <Table.Tr key={item.id}>
                    <Table.Td>
                      <Stack gap={2}>
                        <Text>{institutions.byItemId[item.item_id].name}</Text>
                        <Text size="sm" c="dimmed">
                          {item.name}
                        </Text>
                      </Stack>
                    </Table.Td>
                    <Table.Td ta="left">
                      {formatTextCapitalization(item.subtype)}
                    </Table.Td>
                    <Table.Td ta="right">
                      {formatCurrency(Number(item.current_balance))}
                    </Table.Td>
                  </Table.Tr>
                ))}
              </>
            )}
            {creditArray.length > 0 && (
              <>
                <Table.Tr fw={500} style={{ background: "#EDEDED" }}>
                  <Table.Td>Credit</Table.Td>
                  <Table.Td></Table.Td>
                  <Table.Td ta="right">{formatCurrency(credit)}</Table.Td>
                </Table.Tr>
                {creditArray.map((item) => (
                  <Table.Tr key={item.id}>
                    <Table.Td>
                      <Stack gap={2}>
                        <Text>{institutions.byItemId[item.item_id].name}</Text>
                        <Text size="sm" c="dimmed">
                          {item.name}
                        </Text>
                      </Stack>
                    </Table.Td>
                    <Table.Td ta="left">
                      {formatTextCapitalization(item.subtype)}
                    </Table.Td>
                    <Table.Td ta="right">
                      {formatCurrency(Number(item.current_balance))}
                    </Table.Td>
                  </Table.Tr>
                ))}
              </>
            )}
            {loanArray.length > 0 && (
              <>
                <Table.Tr fw={500} style={{ background: "#EDEDED" }}>
                  <Table.Td>Loans</Table.Td>
                  <Table.Td></Table.Td>
                  <Table.Td ta="right">{formatCurrency(loan)}</Table.Td>
                </Table.Tr>
                {loanArray.map((item) => (
                  <Table.Tr key={item.id}>
                    <Table.Td>
                      <Stack gap={2}>
                        <Text>{institutions.byItemId[item.item_id].name}</Text>
                        <Text size="sm" c="dimmed">
                          {item.name}
                        </Text>
                      </Stack>
                    </Table.Td>
                    <Table.Td ta="left">
                      {formatTextCapitalization(item.subtype)}
                    </Table.Td>
                    <Table.Td ta="right">
                      {formatCurrency(Number(item.current_balance))}
                    </Table.Td>
                  </Table.Tr>
                ))}
              </>
            )}
            {assetsArray.length > 0 && (
              <>
                <Table.Tr fw={500} style={{ background: "#EDEDED" }}>
                  <Table.Td>Assets</Table.Td>
                  <Table.Td></Table.Td>
                  <Table.Td ta="right">{formatCurrency(assetsTotal)}</Table.Td>
                </Table.Tr>
                {assetsArray.map((item) => (
                  <Table.Tr key={item.id}>
                    <Table.Td>
                      <Stack gap={2}>
                        <Text>{formatTextCapitalization(item.name)}</Text>
                      </Stack>
                    </Table.Td>
                    <Table.Td ta="left">Asset</Table.Td>
                    <Table.Td ta="right">
                      {formatCurrency(Number(item.value))}
                    </Table.Td>
                  </Table.Tr>
                ))}
              </>
            )}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
      <Divider mt={10} />
      <Group px={6} py={10} justify="space-between">
        <Text fw={500}>Grand Total</Text>
        <Text fw={500}>
          {formatCurrency(
            depository + investment + assetsTotal - loan - credit
          )}
        </Text>
      </Group>
    </>
  );
};

export default AccountsTable;
