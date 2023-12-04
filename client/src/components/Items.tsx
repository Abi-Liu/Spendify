import { useEffect } from "react";
import useInstitutionsContext from "../contexts/InstitutionsContext";
import useItemsContext from "../contexts/ItemsContext";
import useUserContext from "../contexts/UserContext";

const ItemCard = () => {
  const { itemsArray, getItemsByUser } = useItemsContext();
  const { user } = useUserContext();
  const { institutions } = useInstitutionsContext();

  // get items
  useEffect(() => {
    if (user) {
      getItemsByUser(user.id);
    }
  }, [user]);
  // get accounts

  // get institutions

  return (
    <div>
      {itemsArray.map((item) => (
        <li>{item.id}</li>
      ))}
    </div>
  );
};

export default ItemCard;
