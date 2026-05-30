import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Phone, MessageCircle, MapPin, CalendarDays } from "lucide-react";
import api from "../utils/api";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    service: "",
    eventDate: "",
    location: "",
    message: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const handleSelectDate = (e) => {
      setFormData((prev) => ({
        ...prev,
        eventDate: e.detail.date,
      }));
      setErrors((prev) => ({
        ...prev,
        eventDate: "",
      }));

      const contactSection = document.getElementById("contact");
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: "smooth" });
      }
    };

    window.addEventListener("select-booking-date", handleSelectDate);
    return () => {
      window.removeEventListener("select-booking-date", handleSelectDate);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Name Validation
    const nameTrimmed = formData.name.trim();
    if (!nameTrimmed) {
      newErrors.name = "Name is required";
    } else if (nameTrimmed.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    } else if (!/^[a-zA-Z\s'-]+$/.test(nameTrimmed)) {
      newErrors.name = "Name can only contain letters, spaces, hyphens, and apostrophes";
    }

    // Phone Validation
    const phoneCleaned = formData.phone.replace(/[\s()-]/g, "");
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^(?:\+?91|0)?[6-9]\d{9}$/.test(phoneCleaned)) {
      newErrors.phone = "Please enter a valid 10-digit Indian phone number";
    }

    // Service Validation
    if (!formData.service) {
      newErrors.service = "Please select a service";
    }

    // Date Validation
    if (!formData.eventDate) {
      newErrors.eventDate = "Event date is required";
    } else {
      const getLocalDateStr = (d = new Date()) => {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      };
      if (formData.eventDate < getLocalDateStr()) {
        newErrors.eventDate = "Past dates are not allowed";
      }
    }

    setErrors(newErrors);
    return newErrors;
  };

  const handleWhatsApp = () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      const firstError = Object.values(validationErrors)[0];
      toast.error(firstError);
      return;
    }

    const message = `
Hi Naaz Makeover 💄

I want to book:

Name: ${formData.name}
Phone: ${formData.phone}
Service: ${formData.service}
Date: ${formData.eventDate}
Location: ${formData.location || "Not specified"}

Message: ${formData.message || "-"}

Please confirm availability ✨
`;

    const whatsappNumber = "916372430568";
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
      message
    )}`;

    window.open(url, "_blank");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      const firstError = Object.values(validationErrors)[0];
      toast.error(firstError);
      return;
    }

    try {
      const res = await api.post("/api/bookings", formData);

      toast.success(res.data.message);

      setFormData({
        name: "",
        phone: "",
        service: "",
        eventDate: "",
        location: "",
        message: "",
      });
      setErrors({});
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Something went wrong";
      toast.error(errorMessage);
    }
  };

  return (
    <section id="contact" className="section contact-section premium-contact-section">
      <div className="container premium-contact-wrapper">
        <div className="contact-left premium-contact-left">
          <p className="section-tag">Book Now</p>
          <h2>Let’s create your perfect look</h2>
          <p className="contact-intro">
            Fill in your details and submit your booking request for bridal,
            engagement, party, and reception makeup. For quick confirmation,
            you can also continue directly on WhatsApp.
          </p>

          <div className="contact-highlights">
            <div className="contact-highlight-card">
              <Phone size={18} />
              <div>
                <strong>Direct Contact</strong>
                <span>Fast response for booking help</span>
              </div>
            </div>

            <div className="contact-highlight-card">
              <MessageCircle size={18} />
              <div>
                <strong>WhatsApp Booking</strong>
                <span>Easy and quick inquiry option</span>
              </div>
            </div>

            <div className="contact-highlight-card">
              <CalendarDays size={18} />
              <div>
                <strong>Limited Slots</strong>
                <span>Book early for preferred date</span>
              </div>
            </div>

            <div className="contact-highlight-card">
              <MapPin size={18} />
              <div>
                <strong>Event Based Service</strong>
                <span>Available for special occasions</span>
              </div>
            </div>
          </div>
        </div>

        <form className="contact-form premium-contact-form" onSubmit={handleSubmit}>
          <h3 className="contact-form-title">Book Your Appointment</h3>

          <div className="contact-form-grid">
            <div className="form-group">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? "input-error" : ""}
              />
              {errors.name && <span className="form-field-error">{errors.name}</span>}
            </div>

            <div className="form-group">
              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                className={errors.phone ? "input-error" : ""}
              />
              {errors.phone && <span className="form-field-error">{errors.phone}</span>}
            </div>

            <div className="form-group">
              <select
                name="service"
                value={formData.service}
                onChange={handleChange}
                className={errors.service ? "input-error" : ""}
              >
                <option value="">Select Service</option>
                <option value="Bridal Makeup">Bridal Makeup</option>
                <option value="Engagement Makeup">Engagement Makeup</option>
                <option value="Party Makeup">Party Makeup</option>
                <option value="Reception Makeup">Reception Makeup</option>
              </select>
              {errors.service && <span className="form-field-error">{errors.service}</span>}
            </div>

            <div className="form-group">
              <input
                type="date"
                name="eventDate"
                value={formData.eventDate}
                onChange={handleChange}
                className={errors.eventDate ? "input-error" : ""}
              />
              {errors.eventDate && <span className="form-field-error">{errors.eventDate}</span>}
            </div>
          </div>

          <div className="full-width-group">
            <input
              type="text"
              name="location"
              placeholder="Event Location"
              value={formData.location}
              onChange={handleChange}
            />
          </div>

          <div className="full-width-group">
            <textarea
              name="message"
              placeholder="Message"
              rows="5"
              value={formData.message}
              onChange={handleChange}
            />
          </div>

          <div className="booking-options premium-booking-options">
            <button type="submit" className="primary-btn full-btn">
              Submit Booking
            </button>

            <button
              type="button"
              onClick={handleWhatsApp}
              className="whatsapp-btn premium-whatsapp-btn"
            >
              Book via WhatsApp
            </button>
          </div>

          <p className="contact-mini-note">
            Submit your request here or use WhatsApp for faster discussion.
          </p>
        </form>
      </div>
    </section>
  );
}

export default Contact;