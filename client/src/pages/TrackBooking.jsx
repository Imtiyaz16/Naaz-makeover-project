import { useState } from "react";
import toast from "react-hot-toast";
import api from "../utils/api";

function TrackBooking() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });
  const [bookings, setBookings] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rescheduleBookingId, setRescheduleBookingId] = useState(null);
  const [newEventDate, setNewEventDate] = useState("");
  const [rescheduling, setRescheduling] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    const nameTrimmed = formData.name.trim();
    const phoneCleaned = formData.phone.replace(/[\s()-]/g, "");

    if (!nameTrimmed) {
      toast.error("Please enter your name");
      return;
    }

    if (!formData.phone.trim()) {
      toast.error("Please enter your phone number");
      return;
    }

    if (!/^(?:\+?91|0)?[6-9]\d{9}$/.test(phoneCleaned)) {
      toast.error("Please enter a valid 10-digit Indian phone number");
      return;
    }

    try {
      setLoading(true);
      setSearched(false);

      const res = await api.get("/api/bookings/user", {
        params: {
          name: nameTrimmed,
          phone: phoneCleaned,
        },
      });

      setBookings(res.data.bookings || []);
      setSearched(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch bookings");
      setBookings([]);
      setSearched(true);
    } finally {
      setLoading(false);
    }
  };

  const handleReschedule = async (bookingId) => {
    if (!newEventDate) {
      toast.error("Please select a new date");
      return;
    }

    const getLocalDateStr = (d = new Date()) => {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    if (newEventDate < getLocalDateStr()) {
      toast.error("Past dates are not allowed for rescheduling");
      return;
    }

    try {
      setRescheduling(true);

      const phoneCleaned = formData.phone.replace(/[\s()-]/g, "");

      const res = await api.put(
        `/api/bookings/${bookingId}/reschedule`,
        { eventDate: newEventDate, phone: phoneCleaned }
      );

      toast.success(res.data.message || "Booking rescheduled successfully");

      setBookings((prev) =>
        prev.map((booking) =>
          booking._id === bookingId ? res.data.booking : booking
        )
      );

      setRescheduleBookingId(null);
      setNewEventDate("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reschedule booking");
    } finally {
      setRescheduling(false);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Confirmed":
        return "track-status confirmed";
      case "Completed":
        return "track-status completed";
      case "Cancelled":
        return "track-status cancelled";
      default:
        return "track-status pending";
    }
  };

  const canReschedule = (status) => {
    return status === "Pending" || status === "Confirmed";
  };

  return (
    <div className="track-booking-page">
      <div className="track-booking-container">
        <div className="track-booking-header">
          <p className="track-booking-subtitle">Booking Status</p>
          <h1>Track Your Booking</h1>
          <p className="track-booking-description">
            Enter your name and phone number to check your makeup booking
            request status instantly.
          </p>
        </div>

        <div className="track-booking-card">
          <form onSubmit={handleSearch} className="track-booking-form">
            <div className="track-form-grid">
              <div className="input-group">
                <label>Your Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="input-group">
                <label>Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button type="submit" className="track-booking-btn" disabled={loading}>
              {loading ? "Checking..." : "Check Booking Status"}
            </button>
          </form>
        </div>

        {searched && (
          <div className="track-results-wrap">
            {bookings.length === 0 ? (
              <div className="track-empty-state">
                <h3>No bookings found</h3>
                <p>
                  We could not find any booking with these details. Please check
                  your name and phone number again.
                </p>
              </div>
            ) : (
              <div className="track-results-list">
                {bookings.map((booking) => (
                  <div className="track-booking-result-card" key={booking._id}>
                    <div className="track-card-top">
                      <div>
                        <h3>{booking.service}</h3>
                        <p>{booking.name}</p>
                      </div>

                      <span className={getStatusClass(booking.status)}>
                        {booking.status}
                      </span>
                    </div>

                    <div className="track-meta-grid">
                      <div>
                        <span>Event Date</span>
                        <strong>{booking.eventDate}</strong>
                      </div>

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
                    </div>

                    <div className="track-progress">
                      <div
                        className={`track-step ${["Pending", "Confirmed", "Completed"].includes(
                          booking.status
                        )
                          ? "active"
                          : ""
                          }`}
                      >
                        Request Sent
                      </div>

                      <div
                        className={`track-step ${["Confirmed", "Completed"].includes(booking.status)
                          ? "active"
                          : ""
                          }`}
                      >
                        Confirmed
                      </div>

                      <div
                        className={`track-step ${booking.status === "Completed" ? "active" : ""
                          }`}
                      >
                        Completed
                      </div>
                    </div>
                    {canReschedule(booking.status) && (
                      <div className="track-reschedule-wrap">
                        {rescheduleBookingId === booking._id ? (
                          <div className="track-reschedule-box">
                            <input
                              type="date"
                              value={newEventDate}
                              onChange={(e) => setNewEventDate(e.target.value)}
                              className="track-reschedule-input"
                            />

                            <div className="track-reschedule-actions">
                              <button
                                type="button"
                                className="track-reschedule-confirm"
                                onClick={() => handleReschedule(booking._id)}
                                disabled={rescheduling}
                              >
                                {rescheduling ? "Updating..." : "Confirm Reschedule"}
                              </button>

                              <button
                                type="button"
                                className="track-reschedule-cancel"
                                onClick={() => {
                                  setRescheduleBookingId(null);
                                  setNewEventDate("");
                                }}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            type="button"
                            className="track-reschedule-btn"
                            onClick={() => {
                              setRescheduleBookingId(booking._id);
                              setNewEventDate(
                                booking.eventDate ? booking.eventDate.split("T")[0] : ""
                              );
                            }}
                          >
                            Reschedule Booking
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default TrackBooking;