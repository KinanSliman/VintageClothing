import BannerOffer from "./homepageComponents/BannerOffer";
import Header from "./homepageComponents/Header";
import Hero from "./homepageComponents/Hero";
import Footer from "./homepageComponents/Footer";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    country: "",
  });
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isFormSubmitted, setIsFormSubmitted] = useState(null);

  const gulfCountries = [
    "United Arab Emirates",
    "Saudi Arabia",
    "Kuwait",
    "Qatar",
    "Bahrain",
    "Oman",
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    // console.log("formData: ", formData);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    if (!isFormSubmitted) {
      if (formData.password !== formData.confirmPassword) {
        setErrorMessage("passwords don't match");
      }
      try {
        const response = await axios.post(
          "http://localhost:5000/api/user/register",
          formData
        );
        setSuccessMessage(response.data.message);
        setIsFormSubmitted(true);
        navigate("/login");
      } catch (error) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          setErrorMessage(error.response.data.message);
        } else {
          setErrorMessage("Something went wronggg!");
        }
      }
    } else {
      return;
    }
  };
  return (
    <>
      <BannerOffer />
      <Header />
      <div className="form">
        <div className="form__container">
          <p>create new account</p>
          <form
            className="form__container__inputsContainer"
            onSubmit={handleFormSubmit}
          >
            <input
              type="text"
              name="firstName"
              placeholder="enter your first name"
              value={formData.firstName}
              onChange={handleInputChange}
            />
            <br />
            <input
              type="text"
              name="lastName"
              placeholder="enter your last name"
              value={formData.lastName}
              onChange={handleInputChange}
            />
            <br />
            <input
              type="email"
              name="email"
              placeholder="enter email"
              value={formData.email}
              onChange={handleInputChange}
            />
            <br />
            <input
              type="text"
              name="password"
              placeholder="enter password"
              value={formData.password}
              onChange={handleInputChange}
            />
            <br />

            <select
              name="country"
              value={formData.country}
              onChange={handleInputChange}
            >
              <option value="">select your country</option>
              {gulfCountries.map((country, index) => (
                <option key={index} value={country}>
                  {country}
                </option>
              ))}
            </select>
            <br />

            <button type="submit">register</button>
            {errorMessage && <p>{errorMessage}</p>}
            {successMessage && (
              <p style={{ color: "green" }}>{successMessage}</p>
            )}
          </form>
          <p
            onClick={() => {
              navigate("/login");
            }}
          >
            <span style={{ color: "black", cursor: "pointer" }}> or login</span>
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}
