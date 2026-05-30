import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import '../styles/AvailabilityChecker.css';
import api from "../utils/api";

function AvailabilityChecker() {
  const [formData, setFormData] = useState({
    eventDate: "",
    service: "",
    location: "",
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Calendar State
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1); // 1-indexed
  const [monthCounts, setMonthCounts] = useState({});
  const [loadingMonth, setLoadingMonth] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const fetchMonthAvailability = async (year, month) => {
    try {
      setLoadingMonth(true);
      const res = await api.get("/api/bookings/month-availability", {
        params: { year, month },
      });
      setMonthCounts(res.data.counts || {});
    } catch (error) {
      console.error("Failed to load month availability:", error);
    } finally {
      setLoadingMonth(false);
    }
  };

  useEffect(() => {
    fetchMonthAvailability(currentYear, currentMonth);
  }, [currentYear, currentMonth]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCheck = async (e) => {
    if (e) e.preventDefault();

    if (!formData.eventDate) {
      toast.error("Please select an event date");
      return;
    }

    try {
      setLoading(true);
      setResult(null);

      const res = await api.get("/api/bookings/availability", {
        params: formData,
      });

      setResult(res.data.availability);
      setSelectedDate(formData.eventDate);
      
      // Update calendar year/month to match checked date
      const checkedDate = new Date(formData.eventDate);
      if (!isNaN(checkedDate.getTime())) {
        setCurrentYear(checkedDate.getFullYear());
        setCurrentMonth(checkedDate.getMonth() + 1);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to check availability"
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear((prev) => prev - 1);
    } else {
      setCurrentMonth((prev) => prev - 1);
    }
    setSelectedDate("");
    setResult(null);
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonth((prev) => prev + 1);
    }
    setSelectedDate("");
    setResult(null);
  };

  const getDaysArray = () => {
    const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
    const firstDayIndex = new Date(currentYear, currentMonth - 1, 1).getDay();
    
    const days = [];
    
    // Add empty padding days
    for (let i = 0; i < firstDayIndex; i++) {
      days.push({ day: "", isEmpty: true });
    }
    
    // Add month days
    for (let d = 1; d <= daysInMonth; d++) {
      const pad = (n) => String(n).padStart(2, "0");
      const dateStr = `${currentYear}-${pad(currentMonth)}-${pad(d)}`;
      
      const count = monthCounts[dateStr] || 0;
      let status = "Available";
      if (count >= 3) status = "Not Available";
      else if (count > 0) status = "Limited Slots";
      
      days.push({
        day: d,
        dateStr,
        count,
        status,
        isEmpty: false,
      });
    }
    
    return days;
  };

  const handleSelectCalendarDate = (dayObj) => {
    if (dayObj.isEmpty) return;
    
    setSelectedDate(dayObj.dateStr);
    setFormData((prev) => ({
      ...prev,
      eventDate: dayObj.dateStr,
    }));

    let remaining = 3 - dayObj.count;
    if (remaining < 0) remaining = 0;

    let message = "This date is available for booking.";
    if (dayObj.status === "Limited Slots") {
      message = `This date has limited availability. ${remaining} slot(s) left.`;
    } else if (dayObj.status === "Not Available") {
      message = "Slots full for more info contact through WhatsApp";
    }

    setResult({
      eventDate: dayObj.dateStr,
      service: formData.service || "Selected Service",
      location: formData.location || "",
      bookedCount: dayObj.count,
      totalSlots: 3,
      remainingSlots: remaining,
      status: dayObj.status,
      message,
    });
  };

  const handleBookDateClick = () => {
    if (!selectedDate) return;
    
    window.dispatchEvent(
      new CustomEvent("select-booking-date", {
        detail: { date: selectedDate },
      })
    );
    toast.success(`Date ${selectedDate} selected. Please complete your details below!`);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Available":
        return "availability-badge available";
      case "Limited Slots":
        return "availability-badge limited";
      case "Not Available":
        return "availability-badge unavailable";
      default:
        return "availability-badge";
    }
  };

  const getCalendarDayClass = (dayObj) => {
    if (dayObj.isEmpty) return "calendar-day empty";
    
    let classes = "calendar-day";
    
    if (dayObj.dateStr === selectedDate) {
      classes += " selected";
    }
    
    const todayStr = new Date().toISOString().split("T")[0];
    if (dayObj.dateStr === todayStr) {
      classes += " today";
    }
    
    if (dayObj.status === "Available") {
      classes += " available";
    } else if (dayObj.status === "Limited Slots") {
      classes += " limited";
    } else if (dayObj.status === "Not Available") {
      classes += " full";
    }
    
    return classes;
  };

  return (
    <section id="availability" className="availability-section">
      <div className="container">
        <div className="availability-header">
          <p className="availability-tag">Availability Checker</p>
          <h2>Check Your Event Date</h2>
          <p>
            Select your preferred date from the calendar or use the form to instantly see 
            whether your makeup booking slot is available.
          </p>
        </div>

        <div className="availability-card">
          <div className="availability-main-grid">
            {/* Left Side: Form & Selected Day Details */}
            <div className="availability-left-panel">
              <form onSubmit={handleCheck} className="availability-form">
                <div className="input-group">
                  <label>Event Date</label>
                  <input
                    type="date"
                    name="eventDate"
                    value={formData.eventDate}
                    onChange={handleChange}
                  />
                </div>

                <div className="input-group">
                  <label>Service (Optional)</label>
                  <select
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                  >
                    <option value="">Select Service</option>
                    <option value="Bridal Makeup">Bridal Makeup</option>
                    <option value="Engagement Makeup">Engagement Makeup</option>
                    <option value="Party Makeup">Party Makeup</option>
                    <option value="Reception Makeup">Reception Makeup</option>
                  </select>
                </div>

                <div className="input-group">
                  <label>Location (Optional)</label>
                  <input
                    type="text"
                    name="location"
                    placeholder="Enter location"
                    value={formData.location}
                    onChange={handleChange}
                  />
                </div>

                <button
                  type="submit"
                  className="availability-btn"
                  disabled={loading}
                >
                  {loading ? "Checking..." : "Check Date Availability"}
                </button>
              </form>

              {result && (
                <div className="availability-result calendar-detail-card">
                  <div className="availability-result-top">
                    <div>
                      <h3>{result.eventDate}</h3>
                      <p>
                        {result.service || "Any Service"}{" "}
                        {result.location ? `• ${result.location}` : ""}
                      </p>
                    </div>

                    <span className={getStatusClass(result.status)}>
                      {result.status}
                    </span>
                  </div>

                  <div className="availability-meta">
                    <div>
                      <span>Bookings On Date</span>
                      <strong>
                        {result.bookedCount} / {result.totalSlots}
                      </strong>
                    </div>

                    <div>
                      <span>Remaining Slots</span>
                      <strong>{result.remainingSlots}</strong>
                    </div>
                  </div>

                  <p className="availability-message">{result.message}</p>
                  
                  {result.status !== "Not Available" && (
                    <button
                      type="button"
                      className="calendar-book-btn"
                      onClick={handleBookDateClick}
                    >
                      Book This Date ✨
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Right Side: Visual Month Calendar */}
            <div className="calendar-panel">
              <div className="calendar-wrapper">
                <div className="calendar-header">
                  <button
                    type="button"
                    className="calendar-nav-btn"
                    onClick={handlePrevMonth}
                  >
                    ←
                  </button>
                  <h3>
                    {months[currentMonth - 1]} {currentYear}
                  </h3>
                  <button
                    type="button"
                    className="calendar-nav-btn"
                    onClick={handleNextMonth}
                  >
                    →
                  </button>
                </div>

                <div className="calendar-grid">
                  <div className="calendar-weekday">Su</div>
                  <div className="calendar-weekday">Mo</div>
                  <div className="calendar-weekday">Tu</div>
                  <div className="calendar-weekday">We</div>
                  <div className="calendar-weekday">Th</div>
                  <div className="calendar-weekday">Fr</div>
                  <div className="calendar-weekday">Sa</div>

                  {getDaysArray().map((dayObj, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className={getCalendarDayClass(dayObj)}
                      onClick={() => handleSelectCalendarDate(dayObj)}
                      disabled={dayObj.isEmpty}
                    >
                      {dayObj.day}
                      {!dayObj.isEmpty && <span className="calendar-day-status-dot"></span>}
                    </button>
                  ))}
                </div>

                <div className="calendar-legend">
                  <div className="legend-item">
                    <span className="legend-color available"></span>
                    <span>Available</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-color limited"></span>
                    <span>Limited</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-color full"></span>
                    <span>Fully Booked</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AvailabilityChecker;