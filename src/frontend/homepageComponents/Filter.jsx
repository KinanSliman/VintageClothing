import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setPriceRange,
  setCategory,
  setSize,
  setColor,
  setFit,
  fetchProducts,
  fetchMaxPrice,
} from "../../app/productsSlice";
import filterIcon from "../../assets/images/filter.png";

export default function Filter() {
  const dispatch = useDispatch();
  const { priceRange, maxPrice, category, size, fit, isLoading } = useSelector(
    (state) => state.products
  );

  const [localPrice, setLocalPrice] = useState([0, 0]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // ✅ Fetch max price on mount
  useEffect(() => {
    dispatch(fetchMaxPrice());
  }, [dispatch]);

  // ✅ Initialize localPrice once maxPrice is available
  useEffect(() => {
    if (maxPrice > 0) {
      setLocalPrice(priceRange);
    }
  }, [maxPrice, priceRange]);

  // ✅ Fetch products whenever filters change
  useEffect(() => {
    if (maxPrice > 0) {
      dispatch(fetchProducts());
    }
  }, [priceRange, category, size, fit, maxPrice, dispatch]);

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    const updated = [...localPrice];
    if (name === "min") updated[0] = Number(value);
    if (name === "max") updated[1] = Number(value);
    setLocalPrice(updated);
  };

  const handlePriceCommit = () => {
    dispatch(setPriceRange(localPrice));
  };

  const toggleArrayValue = (arr, value) =>
    arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];

  const resetFilters = () => {
    dispatch(setCategory(""));
    dispatch(setSize([]));
    dispatch(setColor([]));
    dispatch(setFit(""));
    dispatch(setPriceRange([0, maxPrice]));
    setLocalPrice([0, maxPrice]);
  };

  const handleFilterClick = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  useEffect(() => {
    const openingTheFilterForBigScreen = () => {
      const currentWidth = window.innerWidth;
      if (currentWidth > 550) {
        setIsFilterOpen(true);
      }
    };

    window.addEventListener("resize", openingTheFilterForBigScreen);

    openingTheFilterForBigScreen();

    // Cleanup
    return () => {
      window.removeEventListener("resize", openingTheFilterForBigScreen);
    };
  }, []);

  return (
    <div className="filter">
      <div className="title" onClick={handleFilterClick}>
        <h3>Filters</h3>
        <img src={filterIcon} alt="filterIcon" />
      </div>
      {isFilterOpen && (
        <>
          {/* Price Filter */}
          <div className="filter__section">
            <h4>Price Range</h4>
            {isLoading && maxPrice === 0 ? (
              <div className="loading">Loading...</div>
            ) : (
              <>
                <div className="price-inputs">
                  <input
                    type="number"
                    name="min"
                    value={localPrice[0]}
                    min="0"
                    max={localPrice[1]}
                    onChange={handlePriceChange}
                    onBlur={handlePriceCommit}
                  />
                  <span> - </span>
                  <input
                    type="number"
                    name="max"
                    value={localPrice[1]}
                    min={localPrice[0]}
                    max={maxPrice}
                    onChange={handlePriceChange}
                    onBlur={handlePriceCommit}
                  />
                </div>
                <p className="price-label">
                  ${localPrice[0]} - ${localPrice[1]}
                </p>
              </>
            )}
          </div>

          <hr />

          {/* Category Filter */}
          <div className="filter__section">
            <h4>Category</h4>
            {["New Arrivals", "Dresses", "Tops", "Shoes"].map((cat) => (
              <label key={cat} className="radio-label">
                <input
                  type="radio"
                  name="category"
                  value={cat}
                  checked={category === cat}
                  onChange={(e) => dispatch(setCategory(e.target.value))}
                />
                {cat}
              </label>
            ))}
          </div>

          <hr />

          {/* Size Filter */}
          <div className="filter__section">
            <h4>Size</h4>
            {["XS", "S", "M", "L", "XL", "XXL"].map((s) => (
              <label key={s} className="radio-label">
                <input
                  type="checkbox"
                  checked={size.includes(s)}
                  onChange={() => dispatch(setSize(toggleArrayValue(size, s)))}
                />
                {s}
              </label>
            ))}
          </div>

          <hr />

          {/* Fit Filter */}
          <div className="filter__section">
            <h4>Fit</h4>
            {["Slim", "Regular", "Oversized"].map((f) => (
              <label key={f} className="radio-label">
                <input
                  type="radio"
                  name="fit"
                  value={f}
                  checked={fit === f}
                  onChange={(e) => dispatch(setFit(e.target.value))}
                />
                {f}
              </label>
            ))}
          </div>

          <hr />

          {/* Reset Button */}
          <button onClick={resetFilters}>Reset Filters</button>
        </>
      )}
    </div>
  );
}
