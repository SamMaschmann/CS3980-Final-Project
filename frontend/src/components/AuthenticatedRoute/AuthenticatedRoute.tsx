import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router";
import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";
import axios from "axios";
import "./auth.css"

function AuthenticatedRoute() {
  // TODO: replace this with something more secure
  const [verified, setVerified] = useState(true);
  useEffect(() => {
    async function checkToken() {
      const data = await axios.post("http://localhost:8000/check_token", {
        token: localStorage.getItem("token")
      }).catch((err)=> {
        setVerified(false)
      }) 
      
    }
    checkToken();
  }, []);
  const isAuthorized = localStorage.getItem("token");
  const location = useLocation();
  console.log(isAuthorized);
  if (!verified) {
    //redirect to this route after login
    return (
      <Navigate
        to={"/login"}
        replace
        state={{
          redirectTo: location,
        }}
      />
    );
  }

  return (
    <div>
      <Header />
      <div className="body-container">
        <Sidebar />
        <div className="page-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AuthenticatedRoute;
