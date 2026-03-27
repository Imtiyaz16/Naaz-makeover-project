import { Sparkles } from "lucide-react";

function Navbar() {
  return (
    <header className="navbar">
      <div className="container nav-inner">
        <div className="brand">
          <Sparkles size={18} />
          <span>Naaz Makeover</span>
        </div>

        <nav className="nav-links">
          <a href="#services">Services</a>
          <a href="#gallery">Gallery</a>
          <a href="#testimonials">Reviews</a>
          <a href="#contact">Contact</a>
        </nav>

        <a
          href="https://wa.me/6372430568"
          target="_blank"
          rel="noreferrer"
          className="book-btn"
        >
          Book Now
        </a>
      </div>
    </header>
  );
}

export default Navbar;