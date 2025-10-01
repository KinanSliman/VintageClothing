import axios from "axios";
import { useState, useEffect } from "react";
import SearchIcon from "../assets/images/search.png";

export default function CustomersSection() {
  const [customers, setCustomers] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchCustomers();
  }, [page, limit, searchQuery]);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get(
        "https://vintageclothingserver.onrender.com/api/user/getAllCustomers",
        {
          params: { page, limit, search: searchQuery },
        }
      );
      setCustomers(response.data.customers);
      setTotalCustomers(response.data.total);
    } catch (error) {
      console.error("Failed to fetch customers:", error);
    }
  };

  const handleDeleteCustomer = async (id) => {
    try {
      await axios.delete(
        `https://vintageclothingserver.onrender.com/api/user/deleteCustomerByID/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchCustomers();
    } catch (error) {
      console.error("Error deleting customer:", error);
    }
  };

  return (
    <div className="customersSection">
      <h2>Customers</h2>
      <p>Total customers: {totalCustomers}</p>

      {/* Search Box */}
      <div className="searchBox">
        <img src={SearchIcon} alt="Search" />
        <input
          type="text"
          placeholder="Search customers"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setPage(1); // Reset to page 1 on search
          }}
        />
      </div>

      {/* Customer Table */}
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Date Registered</th>
            <th>Country</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.length > 0 ? (
            customers.map((customer, index) => (
              <tr key={customer._id}>
                <td>{(page - 1) * limit + index + 1}</td>
                <td>{customer.firstName}</td>
                <td>{customer.lastName}</td>
                <td>{customer.email}</td>
                <td>{new Date(customer.createdAt).toLocaleDateString()}</td>
                <td>{customer.country}</td>
                <td
                  className="delete"
                  onClick={() => handleDeleteCustomer(customer._id)}
                >
                  Delete
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">No customers found.</td>
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
          disabled={page >= Math.ceil(totalCustomers / limit)}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
