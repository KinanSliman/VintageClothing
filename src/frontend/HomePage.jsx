import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BannerOffer from "./homepageComponents/BannerOffer";
import Header from "./homepageComponents/Header";
import Hero from "./homepageComponents/Hero";
import Footer from "./homepageComponents/Footer";

export default function HomePage() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token && role === "admin") {
      navigate("/admin-dashboard");
    }
  }, []);

  return (
    <div className="homepage">
      <BannerOffer />
      <Header />
      <Hero />
      <Footer />
    </div>
  );
}
