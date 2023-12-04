import useInstitutionsContext from "../contexts/InstitutionsContext";
import useItemsContext from "../contexts/ItemsContext";

const Items = () => {
  const { itemsArray } = useItemsContext();
  const { institutions } = useInstitutionsContext();
  console.log(institutions);

  return (
    <div>
      {itemsArray.map((item) => (
        <li>{item.id}</li>
      ))}
    </div>
  );
};

export default Items;
