import Header from "../../components/Header/Header";
import Sidebar from "../../components/Sidebar/Sidebar";
import "./root.css";
import { Outlet } from "react-router-dom";

function Root() {
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

export default Root;
