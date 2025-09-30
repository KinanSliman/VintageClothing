import { useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../app/cartSlice";

export default function ProductPreview() {
  const dispatch = useDispatch();
  const location = useLocation();
  const product = location.state?.product;

  const [mainImage, setMainImage] = useState(null);
  const [subImages, setSubImages] = useState([]);
  const [selectedSize, setSelectedSize] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (product && Array.isArray(product.images) && product.images.length > 0) {
      setMainImage(product.images[0]);
      setSubImages(product.images.slice(1));
    }
  }, [product]);

  const handleSubImageClick = (clickedImage, index) => {
    const newSubImages = [...subImages];
    newSubImages[index] = mainImage;
    setSubImages(newSubImages);
    setMainImage(clickedImage);
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size before adding to cart");
      return;
    }
    dispatch(addToCart({ product, size: selectedSize }));
  };

  return (
    <>
      <Header />
      <div className="preview">
        {product ? (
          <div className="preview__container">
            {/* Images */}
            <div className="preview__container__images">
              <div className="wrapper">
                <div className="mainImage">
                  {mainImage && <img src={mainImage} alt="main image" />}
                </div>
                <div className="subImages">
                  {subImages.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`sub image ${index + 1}`}
                      onClick={() => handleSubImageClick(image, index)}
                      style={{ cursor: "pointer" }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="preview__container__text">
              <h2>{product.name}</h2>
              <p>Price: ${product.price}</p>

              {/* Sizes */}
              <p>
                Sizes:
                {product.size && product.size.length > 0 ? (
                  product.size.map((s) => (
                    <span
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      style={{
                        display: "inline-block",
                        padding: "6px 12px",
                        margin: "4px",
                        border: "2px solid #333",
                        borderRadius: "6px",
                        fontSize: "0.9em",
                        cursor: "pointer",
                        backgroundColor: selectedSize === s ? "#333" : "#fff",
                        color: selectedSize === s ? "#fff" : "#000",
                        fontWeight: selectedSize === s ? "bold" : "normal",
                        transition: "all 0.2s ease",
                      }}
                    >
                      {s}
                    </span>
                  ))
                ) : (
                  <span>N/A</span>
                )}
              </p>

              <p>Description: {product.description}</p>
              <p>Category: {product.category}</p>
              <p>Tags: {product.tags}</p>

              <button onClick={handleAddToCart}>Add to Cart</button>
            </div>
          </div>
        ) : (
          <p>No product data available.</p>
        )}
      </div>
      <Footer />
    </>
  );
}
