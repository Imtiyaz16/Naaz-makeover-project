import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, MessageCircle, CalendarCheck } from "lucide-react";
import "../styles/faqcta.css"

const faqData = [
  {
    question: "How do I book an appointment?",
    answer:
      "You can book your appointment by checking availability on the website and submitting your booking request. Once submitted, the request will be reviewed and confirmed.",
  },
  {
    question: "How many bookings are accepted per day?",
    answer:
      "We accept limited bookings per day to maintain premium quality and proper attention for every client. If slots are full, you can contact us on WhatsApp for more details.",
  },
  {
    question: "Do you take bridal and event bookings?",
    answer:
      "Yes, bridal, engagement, reception, and party makeup bookings are available. You can contact us in advance for special event dates and detailed discussion.",
  },
  {
    question: "How will I know if my booking is confirmed?",
    answer:
      "After submitting your request, you can track your booking status from the website. The status will show whether it is pending, confirmed, completed, or cancelled.",
  },
  {
    question: "Can I contact directly on WhatsApp?",
    answer:
      "Yes, you can contact directly on WhatsApp for quick queries, slot availability, and booking-related assistance.",
  },
];

function FaqItem({ item, isOpen, onClick, index }) {
  return (
    <motion.div
      className={`faq-item ${isOpen ? "active" : ""}`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      viewport={{ once: true }}
    >
      <button className="faq-question" onClick={onClick}>
        <span>{item.question}</span>
        <ChevronDown
          size={20}
          className={`faq-icon ${isOpen ? "rotate" : ""}`}
        />
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            className="faq-answer-wrap"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p className="faq-answer">{item.answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function FaqCta() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="faq-cta-section" id="faq">
      <div className="container">
        <div className="faq-cta-grid">
          <div className="faq-block">
            <div className="section-head faq-head">
              <p className="section-tag">FAQ</p>
              <h2>Everything you may want to know before booking</h2>
              <p className="faq-subtext">
                Quick answers to the most common questions, so your booking
                process feels smooth, easy and stress-free.
              </p>
            </div>

            <div className="faq-list">
              {faqData.map((item, index) => (
                <FaqItem
                  key={index}
                  item={item}
                  index={index}
                  isOpen={openIndex === index}
                  onClick={() =>
                    setOpenIndex(openIndex === index ? null : index)
                  }
                />
              ))}
            </div>
          </div>

          <motion.div
            className="cta-card"
            initial={{ opacity: 0, x: 28 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45 }}
            viewport={{ once: true }}
          >
            <div className="cta-badge">Limited Slots</div>

            <h3>Ready to book your premium makeover session?</h3>
            <p>
              Secure your preferred date early and avoid last-minute slot
              unavailability. For quick help, connect directly on WhatsApp.
            </p>

            <div className="cta-points">
              <div className="cta-point">
                <CalendarCheck size={18} />
                <span>Check date availability instantly</span>
              </div>

              <div className="cta-point">
                <MessageCircle size={18} />
                <span>Get quick booking help on WhatsApp</span>
              </div>
            </div>

            <div className="cta-actions">
              <a href="#availability" className="cta-btn primary">
                Check Availability
              </a>

              <a
                href="https://wa.me/916372430568"
                target="_blank"
                rel="noreferrer"
                className="cta-btn secondary"
              >
                WhatsApp Now
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default FaqCta;