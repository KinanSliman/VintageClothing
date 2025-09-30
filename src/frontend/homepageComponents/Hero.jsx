import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, setPage } from "../../app/productsSlice";
import { useEffect, useRef } from "react";
import { useQueriesContext } from "./HeroSearchQueriesProvider";
import heroImage from "../../assets/images/sizzling-september-sale-homepage-banner.jpg";
import heroAnnivarsaryImage from "../../assets/images/anniversary-25-off-homepage.webp";
import heroDisneyImage from "../../assets/images/disney-swim.webp";
import { useNavigate } from "react-router-dom";
import Spinner from "../../assets/images/Spinner.svg";
import Filter from "./Filter";

export default function Hero() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { activeSearchQuery } = useQueriesContext();

  const { products, isLoading, totalPages, page, priceRange } = useSelector(
    (state) => state.products
  );
  const cardsRef = useRef(null);
  // Set the search query and reset page to 1 when search changes
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch, page, activeSearchQuery, priceRange]);

  const handleScroll = () => {
    cardsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="hero">
      <img
        src={heroImage}
        onClick={handleScroll}
        style={{ cursor: "pointer" }}
        alt=""
      />
      <p className="productsTitle">
        {activeSearchQuery
          ? `check our ${activeSearchQuery} collection`
          : "check our large collection that suits every style"}
      </p>
      <div className="container">
        <div className="container__wrapper">
          <Filter />

          <div className="showProducts">
            {isLoading ? (
              <div className="spinner">
                <img src={Spinner} alt="loading" />
              </div>
            ) : (
              <div className="cardsContainer" ref={cardsRef}>
                <div className="cards">
                  {products &&
                    products.map((product, index) => (
                      <div
                        key={index}
                        className="card"
                        onClick={() =>
                          navigate("/preview", { state: { product } })
                        }
                      >
                        <div className="cardData">
                          <div className="imageContainer">
                            <img src={product.images[0]} alt="" />
                          </div>
                          <h4>{product.name}</h4>
                          <p>price {product.price} $</p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="pagination">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              onClick={() => dispatch(setPage(num))}
              className={num === page ? "active" : ""}
            >
              {num}
            </button>
          ))}
        </div>
      </div>

      <div className="imagesContainer">
        <img src={heroAnnivarsaryImage} alt="" />
        <img src={heroDisneyImage} alt="" />
      </div>
    </div>
  );
}
