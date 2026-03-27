import AdminGalleryUpload from "../components/AdminGalleryUpload";

function Admin() {
  return (
    <div className="admin-page">
      <div className="admin-overlay-shape admin-overlay-shape-1"></div>
      <div className="admin-overlay-shape admin-overlay-shape-2"></div>

      <div className="admin-container">
        <div className="admin-header">
          <p className="admin-subtitle">Dashboard</p>
          <h1>Gallery Upload Panel</h1>
          <p className="admin-description">
            Upload bridal, reception, engagement and party makeup looks with a
            premium admin experience.
          </p>
        </div>

        <AdminGalleryUpload />
      </div>
    </div>
  );
}

export default Admin;