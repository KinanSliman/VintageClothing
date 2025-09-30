import { useSideBarHumburger } from "./SideBarHumburgerProvider";
import notificationsIcon from "../assets/images/notifications.png";
import ProfileIcon from "../assets/images/profile.png";
import SearchIcon from "../assets/images/search.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function DashboardHeader() {
  const { isHumburgerActive, setIsHumburgerActive } = useSideBarHumburger();
  const [isProfilePicClicked, setIsProfilePicClicked] = useState(false);
  const navigate = useNavigate();

  const activateHumburger = () => {
    setIsHumburgerActive(!isHumburgerActive);
  };

  return (
    <div className="DashboardHeader">
      <div className="humburger" onClick={activateHumburger}>
        <div className={`firstDiv ${isHumburgerActive ? "active" : ""}`}></div>
        <div className={`secondDiv ${isHumburgerActive ? "active" : ""}`}></div>
        <div className={`thirdDiv ${isHumburgerActive ? "active" : ""}`}></div>
      </div>

      {/*   <div className="DashboardHeader__searchBox">
        <img src={SearchIcon} alt="SearchIcon" />
        <input type="text" />
      </div> */}
      <div className="DashboardHeader__options">
        <div className="notificationsOption">
          <img src={notificationsIcon} alt="notificationsIcon" />
          <p>5</p>
        </div>
        <div className="profileOption">
          <img
            src={ProfileIcon}
            alt="notificationsIcon"
            onClick={() => {
              setIsProfilePicClicked(!isProfilePicClicked);
              console.log("isProfilePicClicked", isProfilePicClicked);
            }}
          />
          {isProfilePicClicked && (
            <div className="logout">
              <p
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("firstname");
                  navigate("/login");
                }}
              >
                logout
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default DashboardHeader;
