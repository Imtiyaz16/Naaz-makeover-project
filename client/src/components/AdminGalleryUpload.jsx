import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../utils/api";

function AdminGalleryUpload({ onRefreshStats }) {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
  });
  const [image, setImage] = useState(null);
  const [imageName, setImageName] = useState("");
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [galleryItems, setGalleryItems] = useState([]);
  const [galleryLoading, setGalleryLoading] = useState(true);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const fetchGalleryItems = async () => {
    try {
      setGalleryLoading(true);
      const res = await api.get("/api/gallery");
      setGalleryItems(res.data.data || []);
    } catch (error) {
      toast.error("Failed to load gallery items");
    } finally {
      setGalleryLoading(false);
    }
  };

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    setImageName(file.name);
    setPreview(URL.createObjectURL(file));
  };

  const resetForm = () => {
    setFormData({
      title: "",
      category: "",
    });
    setImage(null);
    setImageName("");
    setPreview("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.category || !image) {
      toast.error("Please fill all fields and select an image");
      return;
    }

    try {
      setLoading(true);

      const uploadData = new FormData();
      uploadData.append("title", formData.title);
      uploadData.append("category", formData.category);
      uploadData.append("image", image);

      const res = await api.post(
        "/api/gallery/upload",
        uploadData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success(res.data.message || "Image uploaded successfully");
      resetForm();
      fetchGalleryItems();
      onRefreshStats?.();
    } catch (error) {
      toast.error(error.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this image?"
    );

    if (!confirmDelete) return;

    try {
      const res = await api.delete(`/api/gallery/${id}`);

      toast.success(res.data.message || "Image deleted successfully");
      fetchGalleryItems();
      onRefreshStats?.();
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="admin-sections-stack">
      <div className="admin-upload-card">
        <div className="admin-upload-top">
          <h2>Upload Gallery Image</h2>
          <p>Add a new premium look to your portfolio gallery.</p>
        </div>

        <form onSubmit={handleSubmit} className="admin-upload-form">
          <div className="admin-form-grid">
            <div className="input-group">
              <label>Image Title</label>
              <input
                type="text"
                name="title"
                placeholder="e.g. Soft Bridal Glow"
                value={formData.title}
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <label>Category</label>
              <input
                type="text"
                name="category"
                placeholder="e.g. Bridal"
                value={formData.category}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="upload-box">
            <label htmlFor="imageUpload" className="upload-label">
              <span className="upload-icon">↑</span>
              <span className="upload-text">
                {imageName ? imageName : "Choose image to upload"}
              </span>
            </label>

            <input
              id="imageUpload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              hidden
            />
          </div>

          {preview && (
            <div className="image-preview-box">
              <img src={preview} alt="Preview" className="image-preview" />
            </div>
          )}

          <button type="submit" className="upload-btn" disabled={loading}>
            {loading ? "Uploading..." : "Upload Image"}
          </button>
        </form>
      </div>

      <div className="admin-panel-card">
        <div className="admin-panel-head">
          <div>
            <p className="admin-panel-eyebrow">Gallery</p>
            <h2>Manage Portfolio Images</h2>
          </div>
          <button className="admin-ghost-btn" onClick={fetchGalleryItems}>
            Refresh
          </button>
        </div>

        {galleryLoading ? (
          <p className="admin-empty-state">Loading gallery items...</p>
        ) : galleryItems.length === 0 ? (
          <p className="admin-empty-state">No gallery images found.</p>
        ) : (
          <div className="admin-gallery-grid">
            {galleryItems.map((item) => (
              <div className="admin-gallery-card" key={item._id}>
                <img src={item.imageUrl} alt={item.title} />
                <div className="admin-gallery-card__content">
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.category}</p>
                  </div>

                  <button
                    className="admin-delete-btn"
                    onClick={() => handleDelete(item._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminGalleryUpload;