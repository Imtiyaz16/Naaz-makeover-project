import { motion } from "framer-motion";

const services = [
  {
    title: "Bridal Makeup",
    desc: "A timeless and luxurious bridal look for your special day.",
  },
  {
    title: "Engagement Makeup",
    desc: "Soft glam and elegant detailing for memorable celebrations.",
  },
  {
    title: "Party Makeup",
    desc: "Glow-enhancing looks designed for events and special occasions.",
  },
  {
    title: "Reception Makeup",
    desc: "Long-lasting premium finish with a graceful high-end touch.",
  },
];

function Services() {
  return (
    <section id="services" className="section">
      <div className="container">
        <div className="section-head">
          <p className="section-tag">Our Services</p>
          <h2>Beauty services with a premium signature finish</h2>
        </div>

        <div className="service-grid">
          {services.map((item, index) => (
            <motion.div
              className="service-card"
              key={index}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Services;