import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../utils/api";

function AdminBeforeAfterManager() {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
  });
  const [beforeImage, setBeforeImage] = useState(null);
  const [afterImage, setAfterImage] = useState(null);
  const [beforePreview, setBeforePreview] = useState("");
  const [afterPreview, setAfterPreview] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(true);

  const fetchItems = async () => {
    try {
      setListLoading(true);
      const res = await api.get("/api/before-after");
      setItems(res.data.items || []);
    } catch (error) {
      toast.error("Failed to load before / after items");
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleBeforeChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setBeforeImage(file);
    setBeforePreview(URL.createObjectURL(file));
  };

  const handleAfterChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAfterImage(file);
    setAfterPreview(URL.createObjectURL(file));
  };

  const resetForm = () => {
    setFormData({ title: "", category: "" });
    setBeforeImage(null);
    setAfterImage(null);
    setBeforePreview("");
    setAfterPreview("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.category || !beforeImage || !afterImage) {
      toast.error("Please fill all fields and select both images");
      return;
    }

    try {
      setLoading(true);

      const uploadData = new FormData();
      uploadData.append("title", formData.title);
      uploadData.append("category", formData.category);
      uploadData.append("beforeImage", beforeImage);
      uploadData.append("afterImage", afterImage);

      const res = await api.post(
        "/api/before-after/upload",
        uploadData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success(res.data.message || "Uploaded successfully");
      resetForm();
      fetchItems();
    } catch (error) {
      toast.error(error.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this transformation?"
    );

    if (!confirmDelete) return;

    try {
      const res = await api.delete(`/api/before-after/${id}`);

      toast.success(res.data.message || "Deleted successfully");
      fetchItems();
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="admin-sections-stack">
      <div className="admin-upload-card">
        <div className="admin-upload-top">
          <h2>Upload Before / After Transformation</h2>
          <p>Add real makeover comparison images to your premium showcase.</p>
        </div>

        <form onSubmit={handleSubmit} className="admin-upload-form">
          <div className="admin-form-grid">
            <div className="input-group">
              <label>Title</label>
              <input
                type="text"
                name="title"
                placeholder="e.g. Bridal Soft Glam"
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

          <div className="before-after-admin-grid">
            <div className="upload-box">
              <label htmlFor="beforeImageUpload" className="upload-label">
                <span className="upload-icon">↑</span>
                <span className="upload-text">
                  {beforeImage ? beforeImage.name : "Choose Before Image"}
                </span>
              </label>
              <input
                id="beforeImageUpload"
                type="file"
                accept="image/*"
                onChange={handleBeforeChange}
                hidden
              />
              {beforePreview && (
                <div className="image-preview-box">
                  <img src={beforePreview} alt="Before Preview" className="image-preview" />
                </div>
              )}
            </div>

            <div className="upload-box">
              <label htmlFor="afterImageUpload" className="upload-label">
                <span className="upload-icon">↑</span>
                <span className="upload-text">
                  {afterImage ? afterImage.name : "Choose After Image"}
                </span>
              </label>
              <input
                id="afterImageUpload"
                type="file"
                accept="image/*"
                onChange={handleAfterChange}
                hidden
              />
              {afterPreview && (
                <div className="image-preview-box">
                  <img src={afterPreview} alt="After Preview" className="image-preview" />
                </div>
              )}
            </div>
          </div>

          <button type="submit" className="upload-btn" disabled={loading}>
            {loading ? "Uploading..." : "Upload Transformation"}
          </button>
        </form>
      </div>

      <div className="admin-panel-card">
        <div className="admin-panel-head">
          <div>
            <p className="admin-panel-eyebrow">Before / After</p>
            <h2>Manage Transformations</h2>
          </div>
          <button className="admin-ghost-btn" onClick={fetchItems}>
            Refresh
          </button>
        </div>

        {listLoading ? (
          <p className="admin-empty-state">Loading transformations...</p>
        ) : items.length === 0 ? (
          <p className="admin-empty-state">No before / after items found.</p>
        ) : (
          <div className="admin-before-after-list">
            {items.map((item) => (
              <div className="admin-before-after-card" key={item._id}>
                <div className="admin-before-after-images">
                  <img src={item.beforeImageUrl} alt={`${item.title} before`} />
                  <img src={item.afterImageUrl} alt={`${item.title} after`} />
                </div>

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

export default AdminBeforeAfterManager;