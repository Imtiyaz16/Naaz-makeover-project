import { motion } from "framer-motion";

function Hero() {
  return (
    <section className="hero">
      <div className="overlay" />
      <div className="container hero-content">
        <motion.p
          className="hero-tag"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Luxury Bridal & Event Makeup
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Elegance that makes every look unforgettable
        </motion.h1>

        <motion.p
          className="hero-text"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Bridal, party and occasion makeup crafted with premium artistry,
          flawless finishing and a luxurious experience.
        </motion.p>

        <motion.div
          className="hero-actions"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
        >
          <a href="#contact" className="primary-btn">
            Book Appointment
          </a>
          <a href="#gallery" className="secondary-btn">
            View Portfolio
          </a>
        </motion.div>
      </div>
    </section>
  );
}

export default Hero;