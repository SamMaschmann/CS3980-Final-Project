import React from "react";
import "./Header.css";
import Button from "../Common/Button/Button";
import { redirect, useNavigate } from "react-router";


function Header() {

  const navigate = useNavigate()


  function logOut() {
    console.log("hello")
    localStorage.setItem("token", "")
    navigate("/login")
  }
  return (
    <div className="header-container">
      <div className="header-name">Richify</div>
      <div />
      <Button action={()=> logOut()} text="Logout" bg_color="red"/>
    </div>
  );
}

export default Header;
