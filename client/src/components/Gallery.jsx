import { useEffect, useState } from "react";
import axios from "axios";

function Gallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL =
    import.meta.env.VITE_API_URL || "https://naaz-makeover-api.onrender.com";

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      console.log("Fetching gallery from:", `${API_URL}/api/gallery`);

      const res = await axios.get(`${API_URL}/api/gallery`);

      console.log("Gallery API response:", res.data);

      setImages(res.data.data || []);
    } catch (error) {
      console.log("Gallery fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p style={{ textAlign: "center" }}>Loading gallery...</p>;
  }

  return (
    <section className="gallery-section" id="gallery">
      <div className="container">
        <div className="section-header">
          <p className="section-subtitle">Our Portfolio</p>
          <h2>Real Transformations</h2>
        </div>

        {images.length === 0 ? (
          <p style={{ textAlign: "center" }}>No gallery images found.</p>
        ) : (
          <div className="gallery-grid">
            {images.map((item) => (
              <div className="gallery-card" key={item._id}>
                <img src={item.imageUrl} alt={item.title} />
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