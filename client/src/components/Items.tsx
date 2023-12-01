import React, { useEffect } from "react";
import useItemsContext from "../contexts/ItemsContext";
import useUserContext from "../contexts/UserContext";

const Items = () => {
  const { getItemsByUser, itemsArray } = useItemsContext();
  const { user } = useUserContext();

  useEffect(() => {
    console.log("useEffect");
    if (user) {
      getItemsByUser(user.id);
    }
  }, [user]);

  console.log(itemsArray);

  return (
    <div>
      {itemsArray.map((item) => (
        <li>{item.id}</li>
      ))}
    </div>
  );
};

export default Items;
