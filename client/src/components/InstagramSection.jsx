import { FaInstagram } from "react-icons/fa";
import { motion } from "framer-motion";

function InstagramSection() {
  return (
    <section className="instagram-section">
      <div className="container instagram-box">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <p className="section-subtitle">Instagram Presence</p>
          <h2>See more beauty looks on Instagram</h2>
          <p>
            Follow our page for bridal looks, premium glam transformations,
            client reels and latest makeup artistry updates.
          </p>

          <a
            href="https://www.instagram.com/naaz.makeupartist_/"
            target="_blank"
            rel="noreferrer"
            className="instagram-btn"
          >
            <FaInstagram />
            Follow on Instagram
          </a>
        </motion.div>
      </div>
    </section>
  );
}

export default InstagramSection;