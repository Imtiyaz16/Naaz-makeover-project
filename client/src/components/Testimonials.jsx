import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Ayesha Khan",
    event: "Bridal Makeup",
    rating: 5,
    text: "The final look was beyond beautiful. Everything felt so elegant, flawless and exactly how I wanted for my wedding day.",
  },
  {
    name: "Sana Shaikh",
    event: "Engagement Look",
    rating: 5,
    text: "Soft glam, premium finish and very neat work. The makeup looked gorgeous in person and in pictures as well.",
  },
  {
    name: "Hiba Patel",
    event: "Party Makeup",
    rating: 5,
    text: "Absolutely loved the detailing and overall glow. It stayed fresh for hours and I got so many compliments.",
  },
  {
    name: "Zoya Merchant",
    event: "Reception Makeup",
    rating: 5,
    text: "Very classy and graceful finish. The hairstyle and makeup both looked polished, balanced and premium.",
  },
];

function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 4500);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setActiveIndex((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  const activeItem = testimonials[activeIndex];

  return (
    <section id="testimonials" className="section premium-testimonials-section">
      <div className="container">
        <div className="section-head premium-testimonials-head">
          <p className="section-tag">Client Reviews</p>
          <h2>Words That Reflect Real Beauty Experiences</h2>
          <p className="testimonials-subtext">
            Real feedback from clients who trusted us for their most special
            days, events, and unforgettable moments.
          </p>
        </div>

        <div className="testimonials-carousel-wrap">
          <button
            className="testimonial-nav-btn left"
            onClick={prevSlide}
            aria-label="Previous testimonial"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="testimonial-carousel-card">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                className="testimonial-slide"
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -22 }}
                transition={{ duration: 0.4 }}
              >
                <div className="testimonial-quote-icon">
                  <Quote size={24} strokeWidth={2} />
                </div>

                <div className="testimonial-stars">
                  {[...Array(activeItem.rating)].map((_, i) => (
                    <Star key={i} size={18} fill="currentColor" />
                  ))}
                </div>

                <p className="testimonial-text">“{activeItem.text}”</p>

                <div className="testimonial-meta">
                  <div className="testimonial-avatar">
                    {activeItem.name.charAt(0)}
                  </div>

                  <div className="testimonial-user-info">
                    <h3>{activeItem.name}</h3>
                    <span className="testimonial-event-badge">
                      {activeItem.event}
                    </span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <button
            className="testimonial-nav-btn right"
            onClick={nextSlide}
            aria-label="Next testimonial"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="testimonial-dots">
          {testimonials.map((_, index) => (
            <button
              key={index}
              className={`testimonial-dot ${
                activeIndex === index ? "active" : ""
              }`}
              onClick={() => setActiveIndex(index)}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;