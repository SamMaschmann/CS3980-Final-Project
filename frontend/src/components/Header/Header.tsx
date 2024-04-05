import React from "react";
import "./Header.css";
import Button from "../Common/Button/Button";

function Header() {
  return (
    <div className="header-container">
      <div className="header-name">Richify</div>
      <div />
      <Button text="Logout" bg_color="red"/>
    </div>
  );
}

export default Header;
