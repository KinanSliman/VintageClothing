import { useSelector, useDispatch } from "react-redux";
import { addToCart, removeFromCart, clearCart } from "../../app/cartSlice";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    firstname: "",
    lastname: "",
    address: "",
    phone: "",
    apartmentORsuite: "",
    city: "",
    country: "",
    userID: "",
  });

  const [message, setMessage] = useState(null);
  const [errors, setErrors] = useState({});

  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();

  const validate = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.firstname) newErrors.firstname = "Firstname is required";
    if (!formData.lastname) newErrors.lastname = "Lastname is required";
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.phone) newErrors.phone = "Phone is required";
    if (!formData.apartmentORsuite)
      newErrors.apartmentORsuite = "Apartment or suite is required";
    if (!formData.city) newErrors.city = "City is required";
    if (!formData.country) newErrors.country = "Country is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onFormSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (validate()) {
      try {
        const token = localStorage.getItem("token");
        const userID = localStorage.getItem("id");
        formData.userID = userID;

        await axios.post(
          "http://localhost:5000/api/orders/addOrder",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        setMessage("Order placed successfully!");
        setFormData({
          email: "",
          firstname: "",
          lastname: "",
          address: "",
          phone: "",
          apartmentORsuite: "",
          city: "",
          country: "",
          id: "",
        });
      } catch (error) {
        setMessage(
          error.response?.data?.error ||
            "Error placing order. Please try again."
        );
      }
    }
  };

  const handleItemIncrement = (product, size) => {
    dispatch(addToCart({ product, size }));
  };

  const handleItemDecrement = (productId, size) => {
    dispatch(removeFromCart({ productId, size }));
  };

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) {
      setFormData((prev) => ({ ...prev, email: storedEmail }));
    }
  }, []);

  const totalPrice = cartItems.reduce(
    (accumulator, { product, quantity }) =>
      accumulator + product.price * quantity,
    0
  );

  const handleCancelClick = () => {
    dispatch(clearCart());
    navigate("/homepage");
  };

  return (
    <>
      <h2
        style={{
          color: "black",
          textAlign: "center",
          padding: "2rem",
          borderBottom: "1px solid black",
        }}
      >
        Vintage store checkout
      </h2>
      {message && <p>{message}</p>}

      <div className="checkout">
        <div className="sectionsContainer">
          <div className="section">
            <h3>Contact</h3>
            <input
              type="email"
              name="email"
              value={formData.email}
              placeholder="Email"
              onChange={onChange}
            />
            {errors.email && <p className="error">{errors.email}</p>}
          </div>

          <div className="section">
            <h3>Delivery</h3>
            <form onSubmit={onFormSubmit}>
              <select
                name="country"
                value={formData.country}
                onChange={onChange}
              >
                <option value="">Select country</option>
                <option value="germany">Germany</option>
                <option value="italy">Italy</option>
              </select>
              {errors.country && <p className="error">{errors.country}</p>}

              <input
                type="text"
                name="firstname"
                value={formData.firstname}
                placeholder="Firstname"
                onChange={onChange}
              />
              {errors.firstname && <p className="error">{errors.firstname}</p>}

              <input
                type="text"
                name="lastname"
                value={formData.lastname}
                placeholder="Lastname"
                onChange={onChange}
              />
              {errors.lastname && <p className="error">{errors.lastname}</p>}

              <input
                type="text"
                name="address"
                value={formData.address}
                placeholder="Address"
                onChange={onChange}
              />
              {errors.address && <p className="error">{errors.address}</p>}

              <input
                type="text"
                name="apartmentORsuite"
                value={formData.apartmentORsuite}
                placeholder="Apartment or suite"
                onChange={onChange}
              />
              {errors.apartmentORsuite && (
                <p className="error">{errors.apartmentORsuite}</p>
              )}

              <input
                type="text"
                name="city"
                value={formData.city}
                placeholder="City"
                onChange={onChange}
              />
              {errors.city && <p className="error">{errors.city}</p>}

              <input
                type="tel"
                name="phone"
                value={formData.phone}
                placeholder="Phone"
                onChange={onChange}
              />
              {errors.phone && <p className="error">{errors.phone}</p>}

              <button type="submit">Place order</button>
              <button onClick={handleCancelClick}>Cancel</button>
            </form>
          </div>
        </div>

        <div className="cartPreview">
          <div className="cartPreview__data">
            {cartItems.length > 0 ? (
              <>
                {cartItems.map(({ product, quantity, size }) => (
                  <div
                    className="cartPreview__data__cart__item"
                    key={product._id + "-" + size}
                  >
                    <img src={product.images[0]} alt="product" />
                    <p className="itemname">
                      {product.name} (Size: {size}) - Quantity: {quantity}
                    </p>
                    <p>Price: {product.price} $</p>
                    <div
                      style={{ display: "flex", gap: "8px", marginTop: "4px" }}
                    >
                      <button
                        onClick={() => handleItemIncrement(product, size)}
                      >
                        +
                      </button>
                      <button
                        onClick={() => handleItemDecrement(product._id, size)}
                      >
                        -
                      </button>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <p>Your shopping cart is empty</p>
            )}
          </div>
          <div className="totalPrice">
            <p>Total Price: {totalPrice} $</p>
          </div>
        </div>
      </div>
    </>
  );
}
