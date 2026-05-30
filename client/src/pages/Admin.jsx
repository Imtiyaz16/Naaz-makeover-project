import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AdminGalleryUpload from "../components/AdminGalleryUpload";
import AdminBookingsPanel from "../components/AdminBookingsPanel";
import AdminBeforeAfterManager from "../components/AdminBeforeAfterManager";
import api from "../utils/api";

const statCards = [
  { key: "totalBookings", label: "Total Bookings" },
  { key: "todayBookings", label: "Today Bookings" },
  { key: "upcomingBookings", label: "Upcoming" },
  { key: "pendingBookings", label: "Pending" },
  { key: "confirmedBookings", label: "Confirmed" },
  { key: "completedBookings", label: "Completed" },
  { key: "cancelledBookings", label: "Cancelled" },
  { key: "totalGalleryItems", label: "Gallery Images" },
  { key: "totalBeforeAfterItems", label: "Before / After" },
];

function Admin() {
  const [activeTab, setActiveTab] = useState("gallery");
  const [stats, setStats] = useState({
    totalBookings: 0,
    todayBookings: 0,
    upcomingBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    completedBookings: 0,
    cancelledBookings: 0,
    totalGalleryItems: 0,
    totalBeforeAfterItems: 0,
  });

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("naaz_admin_token");
    toast.success("Logged out successfully");
    navigate("/admin-login", { replace: true });
  };

  const fetchStats = async () => {
    try {
      const [bookingStatsRes, galleryRes, beforeAfterRes] = await Promise.all([
        api.get("/api/bookings/stats"),
        api.get("/api/gallery"),
        api.get("/api/before-after"),
      ]);

      setStats({
        ...bookingStatsRes.data.stats,
        totalGalleryItems: galleryRes.data.data?.length || 0,
        totalBeforeAfterItems: beforeAfterRes.data.items?.length || 0,
      });
    } catch (error) {
      console.log("Stats fetch error:", error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="admin-page">
      <div className="admin-overlay-shape admin-overlay-shape-1"></div>
      <div className="admin-overlay-shape admin-overlay-shape-2"></div>

      <div className="admin-container admin-container--wide">
        <div className="admin-header">
          <div className="admin-header-top">
            <div className="admin-header-content">
              <p className="admin-subtitle">Dashboard</p>
              <h1>Naaz Makeover Admin Panel</h1>
              <p className="admin-description">
                Manage premium gallery uploads, booking requests and service
                flow with a clean luxury dashboard experience.
              </p>
            </div>

            <button className="admin-logout-btn" onClick={handleLogout}>
              ↗ Logout
            </button>
          </div>
        </div>

        <div className="admin-stats-grid admin-stats-grid--premium">
          {statCards.map((card) => (
            <div className="admin-stat-card" key={card.key}>
              <span>{card.label}</span>
              <h3>{stats[card.key] || 0}</h3>
            </div>
          ))}
        </div>

        <div className="admin-tabs">
          <button
            className={activeTab === "gallery" ? "admin-tab active" : "admin-tab"}
            onClick={() => setActiveTab("gallery")}
          >
            Gallery Manager
          </button>

          <button
            className={activeTab === "bookings" ? "admin-tab active" : "admin-tab"}
            onClick={() => setActiveTab("bookings")}
          >
            Booking Requests
          </button>

          <button
            className={
              activeTab === "beforeAfter" ? "admin-tab active" : "admin-tab"
            }
            onClick={() => setActiveTab("beforeAfter")}
          >
            Before / After
          </button>
        </div>

        {activeTab === "gallery" ? (
          <AdminGalleryUpload onRefreshStats={fetchStats} />
        ) : activeTab === "bookings" ? (
          <AdminBookingsPanel onRefreshStats={fetchStats} />
        ) : (
          <AdminBeforeAfterManager onRefreshStats={fetchStats} />
        )}
      </div>
    </div>
  );
}

export default Admin;
