import { useState } from "react";
import axios from "axios";

export default function ProductModal({ onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    size: [], // multiple sizes
    color: [], // multiple colors
    stock: "",
    tags: "",
    fit: "",
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSizeChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) =>
      checked
        ? { ...prev, size: [...prev.size, value] }
        : { ...prev, size: prev.size.filter((s) => s !== value) }
    );
  };

  const handleColorChange = (value, checked) => {
    setFormData((prev) =>
      checked
        ? { ...prev, color: [...prev.color, value] }
        : { ...prev, color: prev.color.filter((c) => c !== value) }
    );
  };

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setImageFiles((prev) => [...prev, ...selectedFiles]);
  };

  const removeImage = (indexToRemove) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.description || formData.description.length < 5)
      newErrors.description = "Description must be at least 5 characters";
    if (!formData.price) newErrors.price = "Price is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (formData.size.length === 0) newErrors.size = "Select at least one size";
    if (formData.color.length === 0)
      newErrors.color = "Select at least one color";
    if (!formData.stock) newErrors.stock = "Stock is required";
    if (!formData.tags) newErrors.tags = "Tags are required";
    if (!formData.fit) newErrors.fit = "Fit is required";
    if (imageFiles.length === 0)
      newErrors.images = "At least one image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        const token = localStorage.getItem("token");
        const data = new FormData();

        // ✅ Append text fields (stringify arrays)
        Object.keys(formData).forEach((key) => {
          if (Array.isArray(formData[key])) {
            data.append(key, JSON.stringify(formData[key]));
          } else {
            data.append(key, formData[key]);
          }
        });

        // ✅ Append image files
        imageFiles.forEach((file) => {
          data.append("images", file);
        });

        await axios.post(
          "https://vintageclothingserver.onrender.com/api/products/addProduct",
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        setSuccessMessage("Product added successfully");
        setFormData({
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
        setImageFiles([]);
        onClose();
      } catch (error) {
        console.error("Upload error:", error);
      }
    }
  };

  const fitOptions = ["Slim", "Regular", "Relaxed", "Oversized", "Tailored"];
  const sizeOptions = ["XS", "S", "M", "L", "XL", "XXL"];
  const colorOptions = [
    { name: "Black", hex: "#000000" },
    { name: "White", hex: "#FFFFFF" },
    { name: "Red", hex: "#E50914" },
    { name: "Blue", hex: "#0071e3" },
    { name: "Green", hex: "#28a745" },
    { name: "Beige", hex: "#f5f5dc" },
  ];

  return (
    <div className="productModal">
      <p>Add New Product</p>
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}

      <form
        onSubmit={handleSubmit}
        style={{ maxWidth: "500px", margin: "0 auto" }}
        encType="multipart/form-data"
      >
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

            {field === "category" ? (
              <select
                id={field}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                style={{ width: "100%", padding: "8px" }}
              >
                <option value="">Select a category</option>
                {["tops", "bottoms", "dresses", "shoes"].map((option) => (
                  <option key={option} value={option}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </option>
                ))}
              </select>
            ) : field === "fit" ? (
              <select
                id={field}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                style={{ width: "100%", padding: "8px" }}
              >
                <option value="">Select a fit</option>
                {fitOptions.map((option) => (
                  <option key={option} value={option.toLowerCase()}>
                    {option}
                  </option>
                ))}
              </select>
            ) : field === "description" ? (
              <textarea
                id={field}
                name={field}
                value={formData[field]}
                placeholder={`Enter product ${field}`}
                onChange={handleChange}
                style={{ width: "100%", padding: "8px", minHeight: "80px" }}
              />
            ) : (
              <input
                type="text"
                id={field}
                name={field}
                value={formData[field]}
                placeholder={`Enter product ${field}`}
                onChange={handleChange}
                style={{ width: "100%", padding: "8px" }}
              />
            )}

            {errors[field] && (
              <span style={{ color: "red", fontSize: "0.9em" }}>
                {errors[field]}
              </span>
            )}
          </div>
        ))}

        {/* Sizes */}
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", fontWeight: "bold" }}>Sizes:</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {sizeOptions.map((size) => (
              <label key={size}>
                <input
                  type="checkbox"
                  value={size}
                  checked={formData.size.includes(size)}
                  onChange={handleSizeChange}
                  style={{ display: "none" }}
                />
                <span
                  style={{
                    display: "inline-block",
                    padding: "6px 12px",
                    border: "1px solid #ccc",
                    borderRadius: "6px",
                    cursor: "pointer",
                    background: formData.size.includes(size) ? "#333" : "#fff",
                    color: formData.size.includes(size) ? "#fff" : "#000",
                  }}
                >
                  {size}
                </span>
              </label>
            ))}
          </div>
          {errors.size && (
            <span style={{ color: "red", fontSize: "0.9em" }}>
              {errors.size}
            </span>
          )}
        </div>

        {/* Colors */}
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", fontWeight: "bold" }}>
            Colors:
          </label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
            {colorOptions.map((c) => (
              <label key={c.name} style={{ cursor: "pointer" }}>
                <input
                  type="checkbox"
                  value={c.name}
                  checked={formData.color.includes(c.name)}
                  onChange={(e) => handleColorChange(c.name, e.target.checked)}
                  style={{ display: "none" }}
                />
                <span
                  title={c.name}
                  style={{
                    display: "inline-block",
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    backgroundColor: c.hex,
                    border: "2px solid #ccc",
                    boxShadow: formData.color.includes(c.name)
                      ? "0 0 0 3px #333"
                      : "none",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  }}
                />
              </label>
            ))}
          </div>
          {errors.color && (
            <span style={{ color: "red", fontSize: "0.9em" }}>
              {errors.color}
            </span>
          )}
        </div>

        {/* Images */}
        <div style={{ marginBottom: "1rem" }}>
          <label
            htmlFor="images"
            style={{ display: "block", fontWeight: "bold" }}
          >
            Product Images:
          </label>
          <input
            type="file"
            id="images"
            name="images"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            style={{ width: "100%" }}
          />
          {errors.images && (
            <span style={{ color: "red", fontSize: "0.9em" }}>
              {errors.images}
            </span>
          )}
        </div>

        {/* Image previews */}
        {imageFiles.length > 0 && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
              marginBottom: "1rem",
            }}
          >
            {imageFiles.map((file, index) => (
              <div key={index} style={{ position: "relative" }}>
                <img
                  src={URL.createObjectURL(file)}
                  alt={`preview-${index}`}
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                    borderRadius: "5px",
                  }}
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    background: "red",
                    color: "white",
                    border: "none",
                    borderRadius: "50%",
                    width: "20px",
                    height: "20px",
                    cursor: "pointer",
                  }}
                  title="Remove"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        <button type="submit" style={{ padding: "10px 20px" }}>
          Add Product
        </button>
        <button
          type="button"
          onClick={onClose}
          style={{ marginLeft: "10px", padding: "10px 20px" }}
        >
          Cancel
        </button>
      </form>
    </div>
  );
}
