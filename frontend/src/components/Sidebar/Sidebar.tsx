import React, { useEffect, useState } from "react";
import "./Sidebar.css";
import { capitalizeFirstLetter } from "../../helpers/strings";

function Sidebar() {
  const [selected, setSelected] = useState("Transactions");

  useEffect(() => {
    const page = window.location.pathname.substring(1);

    // if url is "/" set Transactions as selected
    if (page) {
      setSelected(capitalizeFirstLetter(page));
    } else {
      setSelected("Transactions");
    }
  });

  const categories = [
    "Transactions",
    "Budget",
    "Friends",
    "Calendar",
    "Loans",
    "Requests",
  ];

  return (
    <div className="sidebar-container">
      {categories.map((category) => (
        <a href={category !== "" ? `/${category.toLowerCase()}` : "/"} key={category}>
          <button
            className={
              "sidebar-item" + (category === selected ? " selected" : "")
            }
            onClick={() => setSelected(category)}
          >
            {category}
          </button>
        </a>
      ))}
    </div>
  );
}

export default Sidebar;
