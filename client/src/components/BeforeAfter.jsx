import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeftRight, Sparkles } from "lucide-react";
import api from "../utils/api";

function BeforeAfterCard({ item, index }) {
  const [sliderValue, setSliderValue] = useState(50);

  return (
    <motion.div
      className="before-after-card premium-before-after-card"
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      viewport={{ once: true }}
    >
      <div className="before-after-card-head premium-before-after-head">
        <div>
          <span className="before-after-chip">
            <Sparkles size={14} strokeWidth={2} />
            Real Transformation
          </span>

          <h3>{item.title}</h3>
          <p>{item.category}</p>
        </div>
      </div>

      <div className="before-after-wrapper premium-before-after-wrapper">
        <img
          src={item.beforeImageUrl}
          alt={`${item.title} before`}
          className="before-after-image"
          loading="lazy"
          referrerPolicy="no-referrer"
        />

        <div
          className="after-image-wrap"
          style={{ width: `${sliderValue}%` }}
        >
          <img
            src={item.afterImageUrl}
            alt={`${item.title} after`}
            className="before-after-image"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="slider-line" style={{ left: `${sliderValue}%` }}>
          <div className="slider-handle">
            <ArrowLeftRight size={18} strokeWidth={2.2} />
          </div>
        </div>

        <input
          type="range"
          min="0"
          max="100"
          value={sliderValue}
          onChange={(e) => setSliderValue(e.target.value)}
          className="before-after-range"
        />

        <span className="before-label">Before</span>
        <span className="after-label">After</span>

        <div className="before-after-swipe-hint">Drag to compare</div>
      </div>
    </motion.div>
  );
}

function BeforeAfter() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/before-after");
      setItems(res.data.items || []);
    } catch (error) {
      console.log("Before / After fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  if (loading) {
    return (
      <section className="before-after-section">
        <div className="container">
          <div className="before-after-header">
            <p className="before-after-tag">Transformation</p>
            <h2>See the Beauty Difference</h2>
            <p>Loading transformations...</p>
          </div>
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <section className="before-after-section" id="before-after">
      <div className="container">
        <div className="before-after-header premium-before-after-header">
          <p className="before-after-tag">Transformation</p>
          <h2>See the Beauty Difference</h2>
          <p>
            Explore real makeover comparisons that highlight the elegance,
            precision and premium finishing touch behind every look.
          </p>
        </div>

        <div className="before-after-grid">
          {items.map((item, index) => (
            <BeforeAfterCard item={item} key={item._id} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default BeforeAfter;