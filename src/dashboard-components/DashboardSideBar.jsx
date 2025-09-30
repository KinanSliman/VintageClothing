import { useEffect, useState } from "react";
import { useSideBarHumburger } from "./SideBarHumburgerProvider";

function DashboardSideBar() {
  const {
    isHumburgerActive,
    setIsHumburgerActive,
    activeSection,
    setActiveSection,
  } = useSideBarHumburger();

  const sections = [
    "Overview",
    "Offers",
    "Orders",
    "Products",
    "Customers",
    "Settings",
  ];

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSectionClick = (section) => {
    setActiveSection(section);
    setIsHumburgerActive(false);
  };

  return (
    <>
      {isHumburgerActive || windowWidth > 768 ? (
        <div className="DashboardSideBar">
          <h3>Vintage Clothing Dashboard</h3>
          <div className="options">
            <ul>
              {sections.map((section, index) => (
                <li
                  key={index}
                  className={activeSection === section ? "active" : ""}
                  onClick={() => handleSectionClick(section)}
                >
                  {section}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default DashboardSideBar;
