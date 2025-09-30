import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchOffers } from "../../app/offersSlice";

export default function BannerOffer() {
  const dispatch = useDispatch();
  const { offers, isLoading, error } = useSelector((state) => state.offers);

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    dispatch(fetchOffers()); // fetch offers from Redux
  }, [dispatch]);

  useEffect(() => {
    if (offers.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) =>
          prevIndex === offers.length - 1 ? 0 : prevIndex + 1
        );
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [offers]);

  if (isLoading) {
    return (
      <>
        <div className="bannerOffer">
          <p>Loading offers...</p>;
        </div>
      </>
    );
  }

  return (
    <div className="bannerOffer">
      {offers.length > 0 ? (
        <p>
          {offers[currentIndex]?.name}: {offers[currentIndex]?.description}
        </p>
      ) : (
        <p>{error || "No offers available"}</p>
      )}
    </div>
  );
}
