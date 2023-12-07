import React, { useState } from "react";
import { Item } from "../contexts/ItemsContext";
import { Accordion } from "@mantine/core";
import ItemCard from "./ItemCard";

const ItemAccordion = ({ items }: { items: Item[] }) => {
  const [value, setValue] = useState<string[]>([]);
  return (
    <Accordion multiple={true} value={value} onChange={setValue}>
      {items.map((item) => (
        <ItemCard item={item} />
      ))}
    </Accordion>
  );
};

export default ItemAccordion;
