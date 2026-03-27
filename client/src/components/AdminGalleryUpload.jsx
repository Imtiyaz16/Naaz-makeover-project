import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
const API_URL = import.meta.env.VITE_API_URL;

function AdminGalleryUpload() {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
  });
  const [image, setImage] = useState(null);
  const [imageName, setImageName] = useState("");
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    setImageName(file.name);
    setPreview(URL.createObjectURL(file));
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

      const res = await axios.post(
       `${API_URL}/api/gallery/upload`,
        uploadData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success(res.data.message || "Image uploaded successfully");

      setFormData({
        title: "",
        category: "",
      });
      setImage(null);
      setImageName("");
      setPreview("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
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
  );
}

export default AdminGalleryUpload;