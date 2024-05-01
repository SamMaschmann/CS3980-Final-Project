import React from "react";
import "./Header.css";
import Button from "../Common/Button/Button";
import { redirect, useNavigate } from "react-router";
import { logout } from "../../store/authSlice";
import { useAppSelector, useAppDispatch } from "../../store/hooks";

function Header() {

  const navigate = useNavigate()
  const dispatch = useAppDispatch()


  function logOut() {
    console.log("hello")
    localStorage.setItem("token", "")
    dispatch(logout({}))
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
