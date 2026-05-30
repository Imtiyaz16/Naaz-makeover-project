import { motion } from "framer-motion";
import { Sparkles, Gem, Crown, Brush } from "lucide-react";

const services = [
  {
    title: "Bridal Makeup",
    desc: "A timeless and luxurious bridal look for your special day.",
    icon: Crown,
    tag: "Signature Look",
  },
  {
    title: "Engagement Makeup",
    desc: "Soft glam and elegant detailing for memorable celebrations.",
    icon: Gem,
    tag: "Elegant Finish",
  },
  {
    title: "Party Makeup",
    desc: "Glow-enhancing looks designed for events and special occasions.",
    icon: Sparkles,
    tag: "Radiant Glam",
  },
  {
    title: "Reception Makeup",
    desc: "Long-lasting premium finish with a graceful high-end touch.",
    icon: Brush,
    tag: "Luxury Blend",
  },
];

function Services() {
  return (
    <section id="services" className="section services-section">
      <div className="container">
        <div className="section-head services-head">
          <p className="section-tag">Our Services</p>
          <h2>Beauty services with a premium signature finish</h2>
          <p className="services-subtext">
            Curated makeup experiences designed to bring out elegance,
            confidence, and a flawless premium look for every occasion.
          </p>
        </div>

        <div className="service-grid premium-service-grid">
          {services.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.div
                className="service-card premium-service-card"
                key={index}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="service-card-glow"></div>

                <div className="service-icon-wrap">
                  <Icon size={22} strokeWidth={1.8} />
                </div>

                <div className="service-tagline">{item.tag}</div>

                <h3>{item.title}</h3>
                <p>{item.desc}</p>

                <div className="service-footer">
                  <span>Premium Finish</span>
                  <a href="#contact" className="service-btn">
                    Book Now
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Services;