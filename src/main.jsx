import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.jsx";
import HomePage from "./frontend/HomePage.jsx";
import Register from "./frontend/Register.jsx";
import Login from "./frontend/Login.jsx";

import Dashboard from "./dashboard-components/Dashboard.jsx";
import "./dashboard-components/dashboardStyle/style.css";
import "./frontend/homepageStyle/style.css";

import { QueriesProvider } from "./frontend/homepageComponents/HeroSearchQueriesProvider";
import ProductPreview from "./frontend/homepageComponents/ProductPreview.jsx";
import { store } from "./app/store";
import { Provider } from "react-redux";
import Checkout from "./frontend/homepageComponents/Checkout.jsx";

// setting paths
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/preview",
    element: <ProductPreview />,
  },

  {
    path: "/admin-dashboard",
    element: <Dashboard />,
  },
  {
    path: "/checkout",
    element: <Checkout />,
  },
  {
    path: "/homepage",
    element: <HomePage />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <QueriesProvider>
        <RouterProvider router={router} />
      </QueriesProvider>
    </Provider>
  </StrictMode>
);
