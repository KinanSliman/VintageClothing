import Overview from "./OverviewSection";
import Customers from "./CustomersSection";
import Products from "./ProductsSection";
import Settings from "./SettingsSection";
import Orders from "./Orders";
import Offers from "./Offers";
import { useSideBarHumburger } from "./SideBarHumburgerProvider";

export default function DashboardBody() {
  const { activeSection } = useSideBarHumburger();

  const renderSection = () => {
    switch (activeSection) {
      case "Customers":
        return <Customers />;
      case "Offers":
        return <Offers />;
      case "Settings":
        return <Settings />;

      case "Products":
        return <Products />;
      case "Orders":
        return <Orders />;
      default:
        return <Overview />;
    }
  };

  return <div className="dashboardBody">{renderSection()}</div>;
}
