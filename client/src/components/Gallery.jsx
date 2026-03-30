import { useEffect, useState } from "react";
import axios from "axios";

function Gallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_URL =
    import.meta.env.VITE_API_URL || "https://naaz-makeover-api.onrender.com";

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async (retryCount = 0) => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.get(`${API_URL}/api/gallery`, {
        timeout: 30000,
      });

      setImages(res.data.data || []);
    } catch (err) {
      console.log("Gallery fetch error:", err);

      if (retryCount < 2) {
        setTimeout(() => {
          fetchGallery(retryCount + 1);
        }, 2500);
        return;
      }

      setError("Gallery failed to load. Please try again.");
    } finally {
      if (retryCount >= 2 || images.length > 0) {
        setLoading(false);
      } else {
        setLoading(false);
      }
    }
  };

  return (
    <section id="gallery" className="gallery-section">
      <div className="container">
        <div className="section-header">
          <p className="section-subtitle">Our Portfolio</p>
          <h2>Real Transformations</h2>
        </div>

        {loading && <p style={{ textAlign: "center" }}>Loading gallery...</p>}

        {!loading && error && (
          <div style={{ textAlign: "center" }}>
            <p>{error}</p>
            <button onClick={() => fetchGallery()}>Retry</button>
          </div>
        )}

        {!loading && !error && images.length === 0 && (
          <p style={{ textAlign: "center" }}>No gallery images found.</p>
        )}

        {!loading && !error && images.length > 0 && (
          <div className="gallery-grid">
            {images.map((item) => (
              <div className="gallery-card" key={item._id}>
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <div className="gallery-overlay">
                  <h3>{item.title}</h3>
                  <p>{item.category}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Gallery;