import axios from "axios";
import { useState, useEffect } from "react";
import BannerOffer from "./homepageComponents/BannerOffer";
import Header from "./homepageComponents/Header";
import Footer from "./homepageComponents/Footer";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);
    try {
      if (formData.email && formData.password) {
        const response = await axios.post(
          "http://localhost:5000/api/user/login",
          formData
        );
        if (response.data.message) {
          setSuccessMessage(response.data.message);
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("firstname", response.data.firstname);
          localStorage.setItem("email", response.data.email);
          localStorage.setItem("role", response.data.role);
          localStorage.setItem("loginTime", Date.now());
          localStorage.setItem("id", response.data.id);

          // Auto logout after 1 hour (3600000 ms)
          setTimeout(() => {
            localStorage.clear();
            navigate("/login");
          }, 3600000);
          if (response.data.role === "admin") {
            navigate("/admin-dashboard");
          } else {
            navigate("/");
          }
        }
      }
    } catch (error) {
      if (error.response?.data?.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("Sorry, unable to connect to server.");
      }
    }
  };
  return (
    <>
      <BannerOffer />
      <Header />
      <div className="form">
        <div className="form__container">
          <p>login page</p>
          <form
            className="form__container__inputsContainer"
            onSubmit={handleFormSubmit}
          >
            {successMessage && <p>{successMessage}</p>}
            <input
              type="email"
              name="email"
              placeholder="email"
              value={formData.email}
              onChange={handleFormChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="password"
              value={formData.password}
              onChange={handleFormChange}
              required
            />
            <button type="submit">login</button>
            {errorMessage && <p>{errorMessage}</p>}
          </form>
          <p
            onClick={() => {
              navigate("/register");
            }}
          >
            <span style={{ color: "black", cursor: "pointer" }}>
              {" "}
              or register new account
            </span>
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}
