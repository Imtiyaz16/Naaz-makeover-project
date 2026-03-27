const Booking = require("../models/Booking");

const createBooking = async (req, res) => {
  try {
    const { name, phone, service, eventDate, location, message } = req.body;

    if (!name || !phone || !service || !eventDate) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    const booking = await Booking.create({
      name,
      phone,
      service,
      eventDate,
      location,
      message,
    });

    res.status(201).json({
      success: true,
      message: "Booking request submitted successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
      error: error.message,
    });
  }
};

module.exports = { createBooking, getBookings };