import useItemsContext from "../contexts/ItemsContext";

const Items = () => {
  const { itemsArray } = useItemsContext();

  return (
    <div>
      {itemsArray.map((item) => (
        <li>{item.id}</li>
      ))}
    </div>
  );
};

export default Items;
