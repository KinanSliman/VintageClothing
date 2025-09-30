import { useSelector, useDispatch } from "react-redux";
import {
  hideCart,
  addToCart,
  removeFromCart,
  keepCartActive,
  clearCart,
} from "../../app/cartSlice";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Cart() {
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const [message, setMessage] = useState(null);

  const handleItemIncrement = (product, size) => {
    dispatch(addToCart({ product, size }));
  };

  const handleItemDecrement = (productId, size) => {
    dispatch(removeFromCart({ productId, size }));
  };

  const handleProceedToCheckoutClick = () => {
    try {
      const firstname = localStorage.getItem("firstname");
      const token = localStorage.getItem("token");

      if (!firstname || !token) {
        setMessage("Please login first");
      } else {
        navigate("/checkout");
      }
    } catch (error) {
      console.log("Encountered this error:", error);
    }
  };
  const handleClearCartClick = () => {
    dispatch(clearCart());
  };

  return (
    <div className="cart" onClick={() => dispatch(keepCartActive())}>
      <h2>Cart</h2>
      <div
        className="closeBtn"
        onClick={(e) => {
          e.stopPropagation(); // prevent parent click
          dispatch(hideCart());
        }}
      >
        <p>X</p>
      </div>
      {message && <p>{message}</p>}

      {cartItems.length > 0 ? (
        <>
          {cartItems.map(({ product, quantity, size }) => (
            <div className="cart__item" key={product._id + "-" + size}>
              <p className="itemname">
                {product.name} (Size: {size}) - Quantity: {quantity}
              </p>
              <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
                <button onClick={() => handleItemIncrement(product, size)}>
                  +
                </button>
                <button onClick={() => handleItemDecrement(product._id, size)}>
                  -
                </button>
              </div>
            </div>
          ))}

          <div className="proceedToCheckout" style={{ marginTop: "16px" }}>
            <button onClick={handleProceedToCheckoutClick}>
              Proceed to Checkout
            </button>
            <button onClick={handleClearCartClick}>Clear Cart</button>
          </div>
        </>
      ) : (
        <p>Your shopping cart is empty</p>
      )}
    </div>
  );
}
