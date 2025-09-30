import DashboardHeader from "./DashboardHeader";
import DashboardSideBar from "./DashboardSideBar";
import { SidebarHumburgerProvider } from "./SideBarHumburgerProvider";
import DashboardBody from "./DashboardBody";
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

function Dashboard() {
  const [isLogged, setIsLogged] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (token && role === "admin") {
      setIsLogged(true);
    } else {
      setIsLogged(false);
    }
  }, []); // Run only on initial mount

  if (isLogged === null) {
    return null; // or a loading spinner if you want
  }

  return isLogged ? (
    <div className="Dashboard">
      <SidebarHumburgerProvider>
        <DashboardHeader />
        <div className="container">
          <DashboardSideBar />
          <DashboardBody />
        </div>
      </SidebarHumburgerProvider>
    </div>
  ) : (
    <Navigate to="/login" />
  );
}

export default Dashboard;
