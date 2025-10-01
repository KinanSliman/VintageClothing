import axios from "axios";
import { useState, useEffect } from "react";

function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);
  const fetchOrders = async () => {
    try {
      const response = await axios.get(
        "https://vintageclothingserver.onrender.com/api/orders/getAllOrders"
      );
      setOrders(response.data.result); // <- Access the correct nested data
      console.log("retrieved orders are:", response.data.result);
    } catch (error) {
      console.error("failed to connect to server api", error);
    }
  };

  return (
    <div className="orders">
      <p>orders section</p>
      {orders.length !== 0 ? (
        orders.map((order, index) => (
          <ul key={index}>
            <li>{order.firstname}</li>
            <li>{order.lastname}</li>
            <li>{order.email}</li>
            <li>{order.address}</li>
            <li>{order.city}</li>
            <li>{order.country}</li>
            <li>{order.phone}</li>
            <li>{order.date}</li>
          </ul>
        ))
      ) : (
        <p> no orders are available</p>
      )}
    </div>
  );
}
export default Orders;
