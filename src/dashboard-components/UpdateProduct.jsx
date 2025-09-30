import { useState, useEffect } from "react";
import axios from "axios";

const AVAILABLE_SIZES = ["XS", "S", "M", "L", "XL"];
const AVAILABLE_COLORS = ["black", "white", "red", "blue", "green", "yellow"];

export default function UpdateProduct({ productToBeUpdated, onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    size: [],
    color: [],
    stock: "",
    tags: "",
    fit: "",
  });

  const [successMessage, setSuccessMessage] = useState(null);
  const [errors, setErrors] = useState({});

  // Pre-fill form when productToBeUpdated changes
  useEffect(() => {
    if (productToBeUpdated) {
      setFormData({
        name: productToBeUpdated.name || "",
        description: productToBeUpdated.description || "",
        price: productToBeUpdated.price || "",
        category: productToBeUpdated.category || "",
        size: productToBeUpdated.size || [],
        color: productToBeUpdated.color || [],
        stock: productToBeUpdated.stock || "",
        tags: productToBeUpdated.tags || "",
        fit: productToBeUpdated.fit || "",
      });
      setSuccessMessage(null);
      setErrors({});
    }
  }, [productToBeUpdated]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSizeChange = (size) => {
    setFormData((prev) => ({
      ...prev,
      size: prev.size.includes(size)
        ? prev.size.filter((s) => s !== size)
        : [...prev.size, size],
    }));
  };

  const handleColorChange = (color) => {
    setFormData((prev) => ({
      ...prev,
      color: prev.color.includes(color)
        ? prev.color.filter((c) => c !== color)
        : [...prev.color, color],
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.description || formData.description.length < 5)
      newErrors.description = "Description must be at least 5 characters";
    if (!formData.price) newErrors.price = "Price is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.size.length) newErrors.size = "At least one size is required";
    if (!formData.color.length)
      newErrors.color = "At least one color is required";
    if (!formData.stock) newErrors.stock = "Stock is required";
    if (!formData.tags) newErrors.tags = "Tags are required";
    if (!formData.fit) newErrors.fit = "Fit is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/products/updateProductByID/${productToBeUpdated._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccessMessage("Product updated successfully");
      onClose?.();
    } catch (error) {
      setErrors({ api: "Failed to update product. Please try again." });
    }
  };

  return (
    <div className="productModal">
      <h2>Update Product</h2>
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      {errors.api && <p style={{ color: "red" }}>{errors.api}</p>}

      <form
        onSubmit={handleSubmit}
        style={{ maxWidth: "500px", margin: "0 auto" }}
      >
        {/* Standard text fields */}
        {[
          "name",
          "price",
          "category",
          "stock",
          "tags",
          "fit",
          "description",
        ].map((field) => (
          <div key={field} style={{ marginBottom: "1rem" }}>
            <label
              htmlFor={field}
              style={{ display: "block", fontWeight: "bold" }}
            >
              {field.charAt(0).toUpperCase() + field.slice(1)}:
            </label>
            <input
              type="text"
              id={field}
              name={field}
              value={formData[field]}
              onChange={handleChange}
              style={{ width: "100%", padding: "8px" }}
            />
            {errors[field] && (
              <span style={{ color: "red", fontSize: "0.9em" }}>
                {errors[field]}
              </span>
            )}
          </div>
        ))}

        {/* Size checkboxes */}
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", fontWeight: "bold" }}>Sizes:</label>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {AVAILABLE_SIZES.map((size) => (
              <label key={size} style={{ cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={formData.size.includes(size)}
                  onChange={() => handleSizeChange(size)}
                />
                {size}
              </label>
            ))}
          </div>
          {errors.size && (
            <span style={{ color: "red", fontSize: "0.9em" }}>
              {errors.size}
            </span>
          )}
        </div>

        {/* Color swatches */}
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", fontWeight: "bold" }}>
            Colors:
          </label>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            {AVAILABLE_COLORS.map((color) => (
              <label key={color} style={{ cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={formData.color.includes(color)}
                  onChange={() => handleColorChange(color)}
                  style={{ display: "none" }}
                />
                <span
                  style={{
                    display: "inline-block",
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    backgroundColor: color,
                    border: formData.color.includes(color)
                      ? "3px solid #333"
                      : "1px solid #ccc",
                    transition: "transform 0.2s, border 0.2s",
                  }}
                ></span>
              </label>
            ))}
          </div>
          {errors.color && (
            <span style={{ color: "red", fontSize: "0.9em" }}>
              {errors.color}
            </span>
          )}
        </div>

        <button
          type="submit"
          style={{ padding: "10px 20px", marginRight: "10px" }}
        >
          Update Product
        </button>
        <button
          type="button"
          onClick={onClose}
          style={{ padding: "10px 20px" }}
        >
          Cancel
        </button>
      </form>
    </div>
  );
}
