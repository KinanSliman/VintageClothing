import axios from "axios";
import { useState, useEffect } from "react";

export default function Offers() {
  const [activeOffers, setActiveOffers] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setErrorMessage(null);
      const response = await axios.get(
        "http://localhost:5000/api/offers/getOffers"
      );
      setActiveOffers(response.data.fetchedOffers);
    } catch (error) {
      setErrorMessage("couldn't connect to server");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    console.log("formData", formData);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);

    const token = localStorage.getItem("token"); // 👈 retrieve token
    console.log("token: ", token);

    try {
      const response = await axios.post(
        "https://vintageclothingserver.onrender.com/api/offers/addOffer",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // 👈 attach token
          },
        }
      );
      setSuccessMessage("offer has been added");
      fetchData(); // refresh offers
    } catch (error) {
      console.error("Error adding offer:", error);
      setErrorMessage("couldn't add the offer to server");
    }
  };

  return (
    <div className="offers">
      <div className="offers__wrapper">
        <h2>offers section</h2>
        <div className="addOffer">
          <form onSubmit={handleFormSubmit}>
            <input
              type="text"
              name="name"
              value={formData.name}
              placeholder="enter offer name"
              onChange={handleInputChange}
              required
            />
            <br />
            <input
              type="text"
              name="description"
              value={formData.description}
              placeholder="enter offer description"
              onChange={handleInputChange}
              required
            />
            <br />
            <button type="submit">Add offer</button>
          </form>
        </div>
        <h4>active offers</h4>
        {successMessage && <p>{successMessage}</p>}
        {errorMessage && <p>{errorMessage}</p>}
        {activeOffers.length > 0 ? (
          activeOffers.map((offer, index) => (
            <ul key={index}>
              <li>{offer.name}</li>
              <li>{offer.description}</li>
            </ul>
          ))
        ) : (
          <p>there are no offers for now Client Side</p>
        )}
      </div>
    </div>
  );
}
