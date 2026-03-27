import { useEffect, useState } from "react";
import axios from "axios";

function Gallery() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/gallery");
      setImages(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className="gallery-section" id="gallery">
      <div className="container">
        <div className="section-header">
          <p className="section-subtitle">Our Portfolio</p>
          <h2>Real Transformations</h2>
        </div>

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
      </div>
    </section>
  );
}

export default Gallery;