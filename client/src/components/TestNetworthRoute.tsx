import useUserContext from "../contexts/UserContext";
import api from "../utils/axios";

interface TestNetworthRouteProps {
  depository: number;
  credit: number;
  loan: number;
  investment: number;
  assetsTotal: number;
}

const TestNetworthRoute = ({
  depository,
  credit,
  loan,
  investment,
  assetsTotal,
}: TestNetworthRouteProps) => {
  const { user } = useUserContext();

  async function fetchNetworth() {
    const networth = depository + investment + assetsTotal - credit - loan;
    const date = new Date().toISOString().split("T")[0];
    const { data } = await api.post("/networth/", {
      userId: user!.id,
      date,
      networth,
    });
    console.log(data);
  }
  return <button onClick={fetchNetworth}>test networth</button>;
};

export default TestNetworthRoute;
