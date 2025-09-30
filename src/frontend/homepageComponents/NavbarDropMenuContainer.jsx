import axios from "axios";
export default function NavbarDropMenuContainer({ activeItemDropDown }) {
  return (
    <div className="navbarDropMenuContainer">
      <p>{activeItemDropDown}</p>
      <h3>View all {activeItemDropDown} </h3>
    </div>
  );
}
