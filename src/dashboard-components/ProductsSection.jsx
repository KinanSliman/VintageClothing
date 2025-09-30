import axios from "axios";
import { useState, useEffect } from "react";
import SearchIcon from "../assets/images/search.png";
import ProductModal from "./ProductModal";
import UpdateProduct from "./UpdateProduct";

function ProductsSection() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalProducts, setTotalProducts] = useState(0);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isEditFormActive, setIsEditFormActive] = useState(false);
  const [isAddFormActive, setIsAddFormActive] = useState(false);
  const [productToBeUpdated, setProductToBeUpdated] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setErrorMessage(null);
    try {
      const response = await axios.get(
        "http://localhost:5000/api/products/getAllProducts",
        { params: { page, limit } }
      );
      setProducts(response.data.fetchedProducts);
      setTotalProducts(response.data.totalProducts);
    } catch (error) {
      setProducts([]);
      setErrorMessage(error);
    }
  };

  const handleDeleteClick = async (productID) => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios
        .delete(
          `http://localhost:5000/api/products/deleteProductByID/${productID}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // 👈 attach token
            },
          }
        )
        .then(() => fetchData());
    } catch (error) {
      setErrorMessage("Unable to delete product");
    }
  };

  const handleEditClick = (product) => {
    setProductToBeUpdated(product);
    setIsEditFormActive(!isEditFormActive);
  };

  return (
    <div className="productsSection">
      <p>this is products section</p>
      {errorMessage && <p>{errorMessage}</p>}
      {totalProducts && <p>total products: {totalProducts}</p>}
      <div className="container">
        <div className="searchBox">
          <img src={SearchIcon} alt="Search" />
          <input type="text" placeholder="Search products" />
        </div>
        <div
          className="addProduct"
          onClick={() => {
            setIsAddFormActive(!isAddFormActive);
          }}
        >
          <p>add product</p>
        </div>
      </div>
      {isAddFormActive && (
        <ProductModal
          onClose={() => {
            setIsAddFormActive(false);
            fetchData();
          }}
        />
      )}
      {isEditFormActive && (
        <UpdateProduct
          productToBeUpdated={productToBeUpdated}
          onClose={() => {
            setIsEditFormActive(false);
            setProductToBeUpdated(null);
            fetchData();
          }}
        />
      )}
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>name</th>
            <th>price</th>
            <th>category</th>
            <th>stock</th>
            <th colSpan={2}>actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map((product, index) => (
              <tr key={index}>
                <td>{(page - 1) * limit + index + 1}</td>
                <td>{product.name}</td>
                <td>{product.price}</td>
                <td>{product.category}</td>
                <td>{product.stock}</td>
                <td
                  className="delete"
                  onClick={() => {
                    handleDeleteClick(product._id);
                  }}
                >
                  delete
                </td>
                <td
                  className="edit"
                  onClick={() => {
                    handleEditClick(product);
                  }}
                >
                  edit
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No products found.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="pagination">
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>
          Previous
        </button>

        <span>Page: {page}</span>

        <button
          disabled={page >= Math.ceil(totalProducts / limit)}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
export default ProductsSection;
