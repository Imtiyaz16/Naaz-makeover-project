import { Sparkles } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleAvailabilityClick = (e) => {
    e.preventDefault();

    if (location.pathname === "/") {
      document.getElementById("availability")?.scrollIntoView({
        behavior: "smooth",
      });
    } else {
      navigate("/#availability");
    }
  };

  return (
    <header className="navbar">
      <div className="container nav-inner">
        <Link to="/" className="brand">
          <Sparkles size={18} />
          <span>Naaz Makeover</span>
        </Link>

        <nav className="nav-links">
          <a href="/#gallery">Gallery</a>
          <a href="/#services">Services</a>
          <a href="/#testimonials">Reviews</a>
          <a href="/#contact">Contact</a>

          <Link to="/track-booking">Track Booking</Link>
        </nav>

        <a
          href="/#availability"
          onClick={handleAvailabilityClick}
          className="book-btn"
        >
          Check Availability
        </a>
      </div>
    </header>
  );
}

export default Navbar;