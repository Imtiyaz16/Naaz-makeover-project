import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Camera, Sparkles, RefreshCcw } from "lucide-react";
import api from "../utils/api";
import "../styles/gallery.css"

function Gallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async (retryCount = 0) => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/api/gallery");

      setImages(res.data.data || []);
    } catch (err) {
      console.log("Gallery fetch error:", err);

      if (retryCount < 2) {
        setTimeout(() => {
          fetchGallery(retryCount + 1);
        }, 2000);
        return;
      }

      setError("Gallery failed to load. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="gallery" className="gallery-section premium-gallery-section">
      <div className="container">
        <div className="section-header premium-gallery-header">
          <p className="section-subtitle">Our Portfolio</p>
          <h2>Signature Looks & Real Beauty Stories</h2>
          <p className="gallery-subtext">
            A curated showcase of elegant transformations, soft glam looks, and
            premium finishes crafted for brides, events, and memorable moments.
          </p>

          {!loading && !error && images.length > 0 && (
            <div className="gallery-count-badge">
              <Camera size={15} strokeWidth={2} />
              <span>{images.length}+ Looks Showcased</span>
            </div>
          )}
        </div>

        {loading && (
          <div className="gallery-grid premium-gallery-grid">
            {[...Array(6)].map((_, index) => (
              <div className="gallery-card gallery-skeleton" key={index}></div>
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="gallery-state-box">
            <p>{error}</p>
            <button onClick={() => fetchGallery()} className="gallery-retry-btn">
              <RefreshCcw size={16} strokeWidth={2} />
              Retry
            </button>
          </div>
        )}

        {!loading && !error && images.length === 0 && (
          <div className="gallery-state-box">
            <p>No gallery images found.</p>
          </div>
        )}

        {!loading && !error && images.length > 0 && (
          <div className="gallery-grid premium-gallery-grid">
            {images.map((item, index) => (
              <motion.div
                className={`gallery-card premium-gallery-card ${
                  index % 5 === 0 ? "gallery-card-tall" : ""
                }`}
                key={item._id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: index * 0.05 }}
                viewport={{ once: true }}
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />

                <div className="gallery-overlay premium-gallery-overlay">
                  <div className="gallery-chip">
                    <Sparkles size={14} strokeWidth={2} />
                    {item.category || "Premium Look"}
                  </div>

                  <div className="gallery-overlay-content">
                    <h3>{item.title}</h3>
                    <p>
                      Elegant finishing, refined detailing and a soft luxury
                      touch for every special moment.
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Gallery;