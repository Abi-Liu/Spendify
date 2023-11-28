import React, { useEffect } from "react";
import useItemsContext from "../contexts/ItemsContext";
import useUserContext from "../contexts/UserContext";

const Items = () => {
  const { getItemsByUser, items } = useItemsContext();
  const { user } = useUserContext();

  useEffect(() => {
    console.log("useEffect");
    if (user) {
      getItemsByUser(user.id);
    }
  }, [user]);

  console.log(items);

  return (
    <div>
      {Object.keys(items).map((key) => {
        const numKey = Number(key);
        return <li>{items[numKey].id}</li>;
      })}
    </div>
  );
};

export default Items;
