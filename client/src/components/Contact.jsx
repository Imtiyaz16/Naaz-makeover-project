import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    service: "",
    eventDate: "",
    location: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/api/bookings", formData);

      toast.success(res.data.message);

      setFormData({
        name: "",
        phone: "",
        service: "",
        eventDate: "",
        location: "",
        message: "",
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Something went wrong"
      );
    }
  };

  return (
    <section id="contact" className="section contact-section">
      <div className="container contact-wrapper">
        <div className="contact-left">
          <p className="section-tag">Book Now</p>
          <h2>Let’s create your perfect look</h2>
          <p>
            Fill in your details and book your premium beauty experience for
            weddings, engagements, parties and events.
          </p>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
          />

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

          <input
            type="date"
            name="eventDate"
            value={formData.eventDate}
            onChange={handleChange}
          />

          <input
            type="text"
            name="location"
            placeholder="Event Location"
            value={formData.location}
            onChange={handleChange}
          />

          <textarea
            name="message"
            placeholder="Message"
            rows="5"
            value={formData.message}
            onChange={handleChange}
          />

          <button type="submit" className="primary-btn full-btn">
            Submit Booking
          </button>
        </form>
      </div>
    </section>
  );
}

export default Contact;