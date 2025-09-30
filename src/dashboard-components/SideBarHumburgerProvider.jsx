import { createContext, useContext, useState } from "react";
const SidebarHumburgerContext = createContext();

export const SidebarHumburgerProvider = ({ children }) => {
  const [isHumburgerActive, setIsHumburgerActive] = useState(false);
  const [activeSection, setActiveSection] = useState("Overview");

  return (
    <SidebarHumburgerContext.Provider
      value={{
        isHumburgerActive,
        setIsHumburgerActive,
        activeSection,
        setActiveSection,
      }}
    >
      {children}
    </SidebarHumburgerContext.Provider>
  );
};

export const useSideBarHumburger = () => useContext(SidebarHumburgerContext);
