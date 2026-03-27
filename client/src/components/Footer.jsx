import { FaInstagram, FaWhatsapp, FaFacebookF, FaPhoneAlt } from "react-icons/fa";
import { HiOutlineLocationMarker, HiOutlineMail } from "react-icons/hi";

function Footer() {
  return (
    <footer className="premium-footer">
      <div className="premium-footer__top-glow"></div>

      <div className="container premium-footer__container">
        <div className="premium-footer__grid">
          <div className="premium-footer__brand">
            <p className="premium-footer__label">Luxury Beauty Studio</p>
            <h2>Naaz Makeover</h2>
            <p className="premium-footer__text">
              Premium bridal, engagement, reception and party makeup services
              crafted with elegance, detail and a flawless finish.
            </p>

            <div className="premium-footer__socials">
              <a href="https://www.instagram.com/naaz.makeupartist_/" target="_blank" rel="noreferrer" aria-label="Instagram">
                <FaInstagram />
              </a>
              <a
                href="https://wa.me/916372430568?text=Hello%20I%20want%20to%20book%20a%20makeup%20appointment"
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp"
              >
                <FaWhatsapp />
              </a>
              <a href="https://facebook.com/" target="_blank" rel="noreferrer" aria-label="Facebook">
                <FaFacebookF />
              </a>
            </div>
          </div>

          <div className="premium-footer__links">
            <h3>Quick Links</h3>
            <a href="/">Home</a>
            <a href="#services">Services</a>
            <a href="#gallery">Gallery</a>
            <a href="#testimonials">Reviews</a>
            <a href="#contact">Contact</a>
          </div>

          <div className="premium-footer__links">
            <h3>Services</h3>
            <a href="#services">Bridal Makeup</a>
            <a href="#services">Engagement Makeup</a>
            <a href="#services">Reception Makeup</a>
            <a href="#services">Party Makeup</a>
            <a href="#contact">Book Appointment</a>
          </div>

          <div className="premium-footer__contact">
            <h3>Contact Info</h3>

            <div className="premium-footer__contact-item">
              <FaPhoneAlt />
              <span>+91 63724 30568</span>
            </div>

            <div className="premium-footer__contact-item">
              <HiOutlineMail />
              <span>naazmakeover@gmail.com</span>
            </div>

            <div className="premium-footer__contact-item">
              <HiOutlineLocationMarker />
              <span>Bisra, Odisha, India</span>
            </div>
          </div>
        </div>

        <div className="premium-footer__bottom">
          <p>© 2026 Naaz Makeover. All rights reserved.</p>
          <div className="premium-footer__bottom-links">
            <a href="/">Privacy Policy</a>
            <a href="/">Terms & Conditions</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;