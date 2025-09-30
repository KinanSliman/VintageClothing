import Navbar from "./Navbar";
import { useEffect, useState } from "react";
import profileIcon from "../../assets/images/user-icon.png";
import shoppingCartIcon from "../../assets/images/shoppingCart.png";
import notificationIcon from "../../assets/images/notifications.png";
import { useNavigate } from "react-router-dom";
import Cart from "./Cart";
import { useDispatch, useSelector } from "react-redux";
import { toggleCartState } from "../../app/cartSlice";
import { fetchUserOrders } from "../../app/userOrdersSlice";

export default function Header() {
  const dispatch = useDispatch();
  const cartState = useSelector((state) => state.cart.isCartActive);

  const navigate = useNavigate();
  const [activeNavbarState, setActiveNavbarState] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const orders = useSelector((state) => state.orders?.orders || []);
  const [showUserOrders, setShowUsersOrders] = useState(false);

  const toggleNavbarMenu = () => {
    setActiveNavbarState(!activeNavbarState);
  };

  const handleSignupClick = () => {
    navigate("/login");
  };
  useEffect(() => {
    setShowUsersOrders(false);
  }, []);

  useEffect(() => {
    const firstname = localStorage.getItem("firstname");
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (firstname && token && role === "user") {
      setIsUserLoggedIn(true);
    }
  }, []);

  const handleUserLogout = () => {
    localStorage.removeItem("firstname");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setIsUserLoggedIn(false);
    navigate("/");
  };

  useEffect(() => {
    if (isUserLoggedIn) {
      fetchNotifications();
    }
  }, [isUserLoggedIn]);

  const fetchNotifications = () => {
    const userID = localStorage.getItem("id");
    if (userID) {
      dispatch(fetchUserOrders(userID));
    }
  };

  return (
    <div className="header">
      <div className="container">
        <div className="humburger" onClick={toggleNavbarMenu}>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div
          className="logo"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/homepage")}
        >
          Vintage Store
        </div>
        <div className="options">
          {/*this section manages notifications state: */}
          <div
            className="notifications"
            onClick={() => setShowUsersOrders(!showUserOrders)}
          >
            <img src={notificationIcon} alt="notification Icon" />
            <div className="data">
              {isUserLoggedIn ? <p>{orders.length}</p> : <p>0</p>}
            </div>

            {showUserOrders && isUserLoggedIn && (
              <div className="notifications__details">
                <p> you have {orders.length} order</p>
                <button>click to view details</button>
              </div>
            )}
          </div>

          <div className="cartIcon">
            <img
              src={shoppingCartIcon}
              alt="shopping cart icon"
              onClick={() => dispatch(toggleCartState())}
            />
            {cartState && <Cart />}
          </div>
          {!isUserLoggedIn ? (
            <div className="signupContainer" onClick={handleSignupClick}>
              <img src={profileIcon} alt="" />
              <p>signup</p>
            </div>
          ) : (
            <div>
              <p onClick={handleUserLogout}>logout</p>{" "}
            </div>
          )}
        </div>
      </div>
      <Navbar
        activeNavbarState={activeNavbarState}
        setActiveNavbarState={setActiveNavbarState}
      />
    </div>
  );
}
