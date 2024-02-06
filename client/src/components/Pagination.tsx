import { Group, Button, Text } from "@mantine/core";
import { Dispatch, SetStateAction } from "react";
import { TbArrowLeft, TbArrowRight } from "react-icons/tb";

interface PaginationProps {
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  hasNextPage: boolean;
}
const Pagination = ({ page, setPage, hasNextPage }: PaginationProps) => {
  function nextPage() {
    setPage((prev) => prev + 1);
  }

  function previousPage() {
    setPage((prev) => prev - 1);
  }

  return (
    <Group>
      <Button
        variant="transparent"
        color="gray"
        onClick={previousPage}
        disabled={page === 1}
      >
        <TbArrowLeft />
      </Button>
      <Text size="sm">{page}</Text>
      <Button
        variant="transparent"
        color="gray"
        onClick={nextPage}
        disabled={!hasNextPage}
      >
        <TbArrowRight />
      </Button>
    </Group>
  );
};

export default Pagination;
