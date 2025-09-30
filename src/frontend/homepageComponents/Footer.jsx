import footerBannerImage from "../../assets/images/Site-Footer.jpg";
import facebookIcon from "../../assets/images/facebookIcon.png";

function Footer() {
  return (
    <div className="footer">
      <img src={footerBannerImage} alt="Site Footer image" />
      <div className="footer__icons">
        <div className="container">
          <img src={facebookIcon} alt="facebook icon" />
          <img src={facebookIcon} alt="facebook icon" />
          <img src={facebookIcon} alt="facebook icon" />
          <img src={facebookIcon} alt="facebook icon" />
          <img src={facebookIcon} alt="facebook icon" />
        </div>
      </div>
      <div className="footer__info">
        <div className="container">
          <div className="section">
            <h3>My Account</h3>
            <p>my info</p>
            <p>order status</p>
            <p>gift cards</p>
          </div>
          <div className="section">
            <h3>Help</h3>
            <p>my info</p>
            <p>order status</p>
            <p>gift cards</p>
            <p>my info</p>
            <p>order status</p>
            <p>gift cards</p>
          </div>
          <div className="section">
            <h3>Company</h3>
            <p>my info</p>
            <p>order status</p>
            <p>gift cards</p>
          </div>
          <div className="section">
            <h3>Contact us</h3>
            <p>my info</p>
            <p>order status</p>
            <p>gift cards</p>
            <p>my info</p>
            <p>order status</p>
            <p>gift cards</p>
            <p>my info</p>
            <p>order status</p>
            <p>gift cards</p>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Footer;
