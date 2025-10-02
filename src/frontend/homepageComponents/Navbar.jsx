//import axios from "axios";
import { useEffect, useState, useRef } from "react";
import NavbarDropMenuContainer from "./NavbarDropMenuContainer";
import { useQueriesContext } from "./HeroSearchQueriesProvider";
import { setCategory } from "../../app/productsSlice";
import { useDispatch } from "react-redux";

export default function Navbar({ activeNavbarState, setActiveNavbarState }) {
  const [isDropDownOpened, setIsDropDownOpened] = useState(false);

  const navbarItems = ["New Arrivals", "Dresses", "Bottoms", "Tops", "Shoes"];
  const [activeItemDropDown, setActiveItemDropdown] = useState(navbarItems[0]);
  const { setActiveSearchQuery } = useQueriesContext();
  const dispatch = useDispatch(); // ✅ add dispatch
  const previousWidth = useRef(window.innerWidth); // ✅ valid placement

  useEffect(() => {
    const resetHumburgerForTablet = () => {
      const currentWidth = window.innerWidth;

      // If we moved from <=550 to >550
      if (previousWidth.current <= 550 && currentWidth > 550) {
        setActiveNavbarState(true);
      } else if (previousWidth.current >= 550 && currentWidth > 550) {
        setActiveNavbarState(true);
      } else if (currentWidth < 550) {
        setActiveNavbarState(false);
      }

      // Update previous width
      previousWidth.current = currentWidth;
    };

    window.addEventListener("resize", resetHumburgerForTablet);

    // Call once in case it's already >500 when component mounts
    resetHumburgerForTablet();

    // Cleanup
    return () => {
      window.removeEventListener("resize", resetHumburgerForTablet);
    };
  }, []);

  const handleMouseEnter = (item) => {
    setActiveItemDropdown(item);
    if (!isDropDownOpened) {
      setIsDropDownOpened(true);
    }
  };

  const handleMouseLeave = () => {
    setIsDropDownOpened(false);
  };
  const handleNavItemClick = (item) => {
    setActiveSearchQuery(item); // your context
    dispatch(setCategory(item)); // ✅ redux action
    setIsDropDownOpened(false);
    setActiveNavbarState(false);
  };

  return (
    <>
      {activeNavbarState && (
        <div className="navbar showNavbar" onMouseLeave={handleMouseLeave}>
          <ul>
            {navbarItems.map((item, index) => (
              <li
                key={index}
                onMouseEnter={() => handleMouseEnter(item)}
                onClick={() => handleNavItemClick(item)}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
