import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import api from "../utils/api";

const STATUS_OPTIONS = [
  "All",
  "Pending",
  "Confirmed",
  "Completed",
  "Cancelled",
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "eventDateAsc", label: "Event date ↑" },
  { value: "eventDateDesc", label: "Event date ↓" },
];

const formatDate = (value) => {
  if (!value) return "Not added";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;

  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

function AdminBookingsPanel({ onRefreshStats }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    status: "All",
    eventDate: "",
    sort: "newest",
  });

  const fetchBookings = async (customFilters = filters) => {
    try {
      setLoading(true);

      const params = {
        sort: customFilters.sort,
      };

      if (customFilters.search.trim()) {
        params.search = customFilters.search.trim();
      }

      if (customFilters.status !== "All") {
        params.status = customFilters.status;
      }

      if (customFilters.eventDate) {
        params.eventDate = customFilters.eventDate;
      }

      const res = await api.get("/api/bookings", { params });
      setBookings(res.data.bookings || []);
    } catch (error) {
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchBookings(filters);
    }, 350);

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const bookingSummary = useMemo(() => {
    const summary = {
      total: bookings.length,
      pending: 0,
      confirmed: 0,
      completed: 0,
      cancelled: 0,
    };

    bookings.forEach((booking) => {
      const key = booking.status?.toLowerCase();
      if (summary[key] !== undefined) {
        summary[key] += 1;
      }
    });

    return summary;
  }, [bookings]);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleClearFilters = () => {
    const defaultFilters = {
      search: "",
      status: "All",
      eventDate: "",
      sort: "newest",
    };

    setFilters(defaultFilters);
    fetchBookings(defaultFilters);
  };

  const handleStatusChange = async (id, status) => {
    try {
      const res = await api.patch(`/api/bookings/${id}/status`, { status });

      toast.success(res.data.message || "Status updated");
      fetchBookings();
      onRefreshStats?.();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this booking?"
    );

    if (!confirmDelete) return;

    try {
      const res = await api.delete(`/api/bookings/${id}`);

      toast.success(res.data.message || "Booking deleted");
      fetchBookings();
      onRefreshStats?.();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete booking");
    }
  };

  const handleCopyPhone = async (phone) => {
    try {
      await navigator.clipboard.writeText(phone);
      toast.success("Phone number copied");
    } catch (error) {
      toast.error("Could not copy number");
    }
  };

  const openWhatsApp = (booking) => {
    const message = encodeURIComponent(
      `Hi ${booking.name}, this is Naaz Makeover regarding your ${booking.service} booking for ${booking.eventDate}.`
    );
    const phone = (booking.phone || "").replace(/\D/g, "");

    if (!phone) {
      toast.error("Phone number is missing");
      return;
    }

    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
  };

  if (loading) {
    return (
      <div className="admin-panel-card">
        <p className="admin-empty-state">Loading bookings...</p>
      </div>
    );
  }

  return (
    <div className="admin-panel-card">
      <div className="admin-panel-head">
        <div>
          <p className="admin-panel-eyebrow">Bookings</p>
          <h2>Client Booking Requests</h2>
        </div>
        <div className="admin-panel-head-actions">
          <button className="admin-ghost-btn" onClick={() => fetchBookings()}>
            Refresh
          </button>
          <button className="admin-ghost-btn" onClick={handleClearFilters}>
            Clear Filters
          </button>
        </div>
      </div>

      <div className="booking-toolbar">
        <div className="booking-toolbar__grid">
          <div className="input-group booking-toolbar__field booking-toolbar__field--search">
            <label>Search</label>
            <input
              type="text"
              placeholder="Search by name, phone, service, location"
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
            />
          </div>

          <div className="input-group booking-toolbar__field">
            <label>Status</label>
            <select
              className="admin-select"
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
            >
              {STATUS_OPTIONS.map((status) => (
                <option value={status} key={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div className="input-group booking-toolbar__field">
            <label>Event Date</label>
            <input
              type="date"
              value={filters.eventDate}
              onChange={(e) => handleFilterChange("eventDate", e.target.value)}
            />
          </div>

          <div className="input-group booking-toolbar__field">
            <label>Sort By</label>
            <select
              className="admin-select"
              value={filters.sort}
              onChange={(e) => handleFilterChange("sort", e.target.value)}
            >
              {SORT_OPTIONS.map((option) => (
                <option value={option.value} key={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="booking-mini-stats">
          <div className="booking-mini-stat">
            <span>Showing</span>
            <strong>{bookingSummary.total}</strong>
          </div>
          <div className="booking-mini-stat">
            <span>Pending</span>
            <strong>{bookingSummary.pending}</strong>
          </div>
          <div className="booking-mini-stat">
            <span>Confirmed</span>
            <strong>{bookingSummary.confirmed}</strong>
          </div>
          <div className="booking-mini-stat">
            <span>Completed</span>
            <strong>{bookingSummary.completed}</strong>
          </div>
          <div className="booking-mini-stat">
            <span>Cancelled</span>
            <strong>{bookingSummary.cancelled}</strong>
          </div>
        </div>
      </div>

      {bookings.length === 0 ? (
        <p className="admin-empty-state">No bookings matched your filters.</p>
      ) : (
        <div className="booking-list">
          {bookings.map((booking) => (
            <div className="booking-card booking-card--premium" key={booking._id}>
              <div className="booking-card__top">
                <div>
                  <div className="booking-title-row">
                    <h3>{booking.name}</h3>
                    <span className="booking-service-pill">{booking.service}</span>
                  </div>
                  <p>
                    Event date: {formatDate(booking.eventDate)}
                    {booking.location ? ` • ${booking.location}` : ""}
                  </p>
                </div>

                <span
                  className={`status-badge status-${booking.status.toLowerCase()}`}
                >
                  {booking.status}
                </span>
              </div>

              <div className="booking-meta-grid">
                <div>
                  <span>Phone</span>
                  <strong>{booking.phone}</strong>
                </div>
                <div>
                  <span>Location</span>
                  <strong>{booking.location || "Not added"}</strong>
                </div>
                <div>
                  <span>Message</span>
                  <strong>{booking.message || "No message"}</strong>
                </div>
                <div>
                  <span>Created</span>
                  <strong>{formatDate(booking.createdAt)}</strong>
                </div>
              </div>

              <div className="booking-actions booking-actions--premium">
                <select
                  value={booking.status}
                  onChange={(e) =>
                    handleStatusChange(booking._id, e.target.value)
                  }
                  className="admin-select"
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>

                <button
                  className="admin-secondary-btn"
                  onClick={() => handleCopyPhone(booking.phone)}
                >
                  Copy Number
                </button>

                <button
                  className="admin-whatsapp-btn"
                  onClick={() => openWhatsApp(booking)}
                >
                  WhatsApp
                </button>

                <a className="admin-call-btn" href={`tel:${booking.phone}`}>
                  Call Client
                </a>

                <button
                  className="admin-delete-btn"
                  onClick={() => handleDelete(booking._id)}
                >
                  Delete Booking
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminBookingsPanel;
