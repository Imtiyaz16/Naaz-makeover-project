const Booking = require("../models/Booking");
const mongoose = require("mongoose");

const MAX_BOOKINGS_PER_DATE = 3;
const ACTIVE_BOOKING_STATUSES = ["Pending", "Confirmed", "Completed"];
const sendWhatsAppMessage = require("../utils/sendWhatsAppMessage");

const escapeRegex = (value = "") => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const normalizeDateOnly = (dateInput) => {
  const date = new Date(dateInput);
  if (Number.isNaN(date.getTime())) return null;

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
const isPastDate = (dateStr) => {
  const today = normalizeDateOnly(new Date());
  return dateStr < today;
};
const getStatusMessage = ({ name, service, eventDate, status }) => {
  const messages = {
    Pending: `Hi ${name}, your booking request for ${service} on ${eventDate} is currently marked as Pending. We will update you soon.`,
    Confirmed: `Hi ${name}, your booking for ${service} on ${eventDate} has been Confirmed by Naaz Makeover. We look forward to serving you.`,
    Completed: `Hi ${name}, your ${service} booking dated ${eventDate} has been marked as Completed. Thank you for choosing Naaz Makeover.`,
    Cancelled: `Hi ${name}, your booking for ${service} on ${eventDate} has been Cancelled. For more information, please contact Naaz Makeover.`,
  };

  return messages[status] || `Hi ${name}, your booking status has been updated to ${status}.`;
};

const createBooking = async (req, res) => {
  try {
    let { name, phone, service, eventDate, location, message } = req.body;

    name = name?.trim();
    phone = phone?.trim();
    service = service?.trim();
    location = location?.trim();
    message = message?.trim();

    if (!name || !phone || !service || !eventDate) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    const normalizedEventDate = normalizeDateOnly(eventDate);

    if (!normalizedEventDate) {
      return res.status(400).json({
        success: false,
        message: "Invalid event date format",
      });
    }

    if (isPastDate(normalizedEventDate)) {
      return res.status(400).json({
        success: false,
        message: "Past dates are not allowed",
      });
    }

    const existingBookingsCount = await Booking.countDocuments({
      eventDate: normalizedEventDate,
      status: { $in: ACTIVE_BOOKING_STATUSES },
    });

    if (existingBookingsCount >= MAX_BOOKINGS_PER_DATE) {
      return res.status(400).json({
        success: false,
        message: "Slots full for more info contact through WhatsApp",
      });
    }

    const booking = await Booking.create({
      name,
      phone,
      service,
      eventDate: normalizedEventDate,
      location,
      message,
      status: "Pending",
    });

    try {
      await sendWhatsAppMessage({
        to: phone,
        body: `Hi ${name}, your booking request for ${service} on ${normalizedEventDate} has been received by Naaz Makeover. We will contact you soon.`,
      });
    } catch (whatsAppError) {
      console.error("WhatsApp send failed:", whatsAppError.message);
    }

    try {
      const adminPhone = process.env.ADMIN_PHONE || "+916372430568";
      await sendWhatsAppMessage({
        to: adminPhone,
        body: `💄 New Booking Request!\n\nName: ${name}\nPhone: ${phone}\nService: ${service}\nDate: ${normalizedEventDate}\nLocation: ${location || "Not specified"}\nMessage: ${message || "-"}\n\nLog in to dashboard: http://localhost:5173/admin`,
      });
    } catch (whatsAppAdminError) {
      console.error("WhatsApp Admin alert failed:", whatsAppAdminError.message);
    }

    return res.status(201).json({
      success: true,
      message: "Booking request submitted successfully",
      booking,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const getBookings = async (req, res) => {
  try {
    const { search = "", status = "", eventDate = "", sort = "newest" } = req.query;

    const query = {};

    if (status && status !== "All") {
      query.status = status;
    }

    if (eventDate) {
      query.eventDate = eventDate;
    }

    if (search.trim()) {
      const safeSearch = escapeRegex(search.trim());
      query.$or = [
        { name: { $regex: safeSearch, $options: "i" } },
        { phone: { $regex: safeSearch, $options: "i" } },
        { service: { $regex: safeSearch, $options: "i" } },
        { location: { $regex: safeSearch, $options: "i" } },
      ];
    }

    let sortOption = { createdAt: -1 };

    if (sort === "oldest") {
      sortOption = { createdAt: 1 };
    }

    if (sort === "eventDateAsc") {
      sortOption = { eventDate: 1, createdAt: -1 };
    }

    if (sort === "eventDateDesc") {
      sortOption = { eventDate: -1, createdAt: -1 };
    }

    const bookings = await Booking.find(query).sort(sortOption);

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

const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const allowedStatuses = ["Pending", "Confirmed", "Completed", "Cancelled"];

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking id",
      });
    }

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.status === status) {
      return res.status(400).json({
        success: false,
        message: `Booking is already ${status}`,
      });
    }

    booking.status = status;
    await booking.save();

    try {
      const statusMessage = getStatusMessage({
        name: booking.name,
        service: booking.service,
        eventDate: booking.eventDate,
        status: booking.status,
      });

      await sendWhatsAppMessage({
        to: booking.phone,
        body: statusMessage,
      });
    } catch (whatsAppError) {
      console.error("WhatsApp status update failed:", whatsAppError.message);
    }

    return res.status(200).json({
      success: true,
      message: "Booking status updated successfully",
      booking,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update booking status",
      error: error.message,
    });
  }
};

const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Booking deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete booking",
      error: error.message,
    });
  }
};

const getBookingStats = async (req, res) => {
  try {
    const today = normalizeDateOnly(new Date());

    const [
      totalBookings,
      pendingBookings,
      confirmedBookings,
      completedBookings,
      cancelledBookings,
      todayBookings,
      upcomingBookings,
    ] = await Promise.all([
      Booking.countDocuments(),
      Booking.countDocuments({ status: "Pending" }),
      Booking.countDocuments({ status: "Confirmed" }),
      Booking.countDocuments({ status: "Completed" }),
      Booking.countDocuments({ status: "Cancelled" }),
      Booking.countDocuments({ eventDate: today }),
      Booking.countDocuments({
        eventDate: { $gt: today },
        status: { $in: ACTIVE_BOOKING_STATUSES },
      }),
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalBookings,
        pendingBookings,
        confirmedBookings,
        completedBookings,
        cancelledBookings,
        todayBookings,
        upcomingBookings,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch booking stats",
      error: error.message,
    });
  }
};

const getUserBookings = async (req, res) => {
  try {
    const { name, phone } = req.query;

    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        message: "Name and phone are required",
      });
    }

    const bookings = await Booking.find({
      name: { $regex: new RegExp(`^${escapeRegex(name)}$`, "i") },
      phone: phone.trim(),
    }).sort({ createdAt: -1 });

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

const checkAvailability = async (req, res) => {
  try {
    const { eventDate, service, location } = req.query;

    if (!eventDate) {
      return res.status(400).json({
        success: false,
        message: "Event date is required",
      });
    }

    const normalizedEventDate = normalizeDateOnly(eventDate);

    const bookedCount = await Booking.countDocuments({
      eventDate: normalizedEventDate,
      status: { $in: ACTIVE_BOOKING_STATUSES },
    });

    const remainingSlots = Math.max(MAX_BOOKINGS_PER_DATE - bookedCount, 0);

    let availabilityStatus = "Available";
    let message = "This date is available for booking.";

    if (bookedCount === 1 || bookedCount === 2) {
      availabilityStatus = "Limited Slots";
      message = `This date has limited availability. ${remainingSlots} slot(s) left.`;
    }

    if (bookedCount >= MAX_BOOKINGS_PER_DATE) {
      availabilityStatus = "Not Available";
      message = "Slots full for more info contact through WhatsApp";
    }

    res.status(200).json({
      success: true,
      availability: {
        eventDate,
        service: service || "",
        location: location || "",
        bookedCount,
        totalSlots: MAX_BOOKINGS_PER_DATE,
        remainingSlots,
        status: availabilityStatus,
        message,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to check availability",
      error: error.message,
    });
  }
  
};

const rescheduleBooking = async (req, res) => {
  try {
    const { eventDate, phone } = req.body;
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking id",
      });
    }

    if (!phone || !phone.trim()) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required for verification",
      });
    }

    if (!eventDate) {
      return res.status(400).json({
        success: false,
        message: "New event date is required",
      });
    }

    const normalizedEventDate = normalizeDateOnly(eventDate);

    if (!normalizedEventDate) {
      return res.status(400).json({
        success: false,
        message: "Invalid event date format",
      });
    }

    if (isPastDate(normalizedEventDate)) {
      return res.status(400).json({
        success: false,
        message: "Past dates are not allowed for rescheduling",
      });
    }

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Phone validation check
    const cleanBookingPhone = booking.phone.replace(/\s+/g, "").trim();
    const cleanInputPhone = phone.replace(/\s+/g, "").trim();

    const matchesExact = cleanBookingPhone === cleanInputPhone;
    const matchesEnding = cleanBookingPhone.endsWith(cleanInputPhone) || cleanInputPhone.endsWith(cleanBookingPhone);

    if (!matchesExact && !matchesEnding) {
      return res.status(403).json({
        success: false,
        message: "Verification failed. Phone number does not match this booking.",
      });
    }

    if (["Completed", "Cancelled"].includes(booking.status)) {
      return res.status(400).json({
        success: false,
        message: `Reschedule is not allowed for ${booking.status.toLowerCase()} bookings`,
      });
    }

    const currentEventDate = normalizeDateOnly(booking.eventDate);

    if (currentEventDate === normalizedEventDate) {
      return res.status(400).json({
        success: false,
        message: "Please select a different date",
      });
    }

    const existingBookingsCount = await Booking.countDocuments({
      _id: { $ne: booking._id },
      eventDate: normalizedEventDate,
      status: { $in: ACTIVE_BOOKING_STATUSES },
    });

    if (existingBookingsCount >= MAX_BOOKINGS_PER_DATE) {
      return res.status(400).json({
        success: false,
        message: "Selected date is full. Please choose another date.",
      });
    }

    booking.eventDate = normalizedEventDate;
    booking.status = "Pending";
    booking.rescheduledAt = new Date();

    await booking.save();

    try {
      await sendWhatsAppMessage({
        to: booking.phone,
        body: `Hi ${booking.name}, your booking has been rescheduled successfully to ${booking.eventDate}. Status is now Pending.`,
      });
    } catch (whatsAppError) {
      console.error("WhatsApp reschedule message failed:", whatsAppError.message);
    }

    try {
      const adminPhone = process.env.ADMIN_PHONE || "+916372430568";
      await sendWhatsAppMessage({
        to: adminPhone,
        body: `🔄 Booking Rescheduled!\n\nName: ${booking.name}\nPhone: ${booking.phone}\nService: ${booking.service}\nNew Date: ${booking.eventDate}\n\nLog in to dashboard: http://localhost:5173/admin`,
      });
    } catch (whatsAppAdminError) {
      console.error("WhatsApp Admin reschedule alert failed:", whatsAppAdminError.message);
    }

    return res.status(200).json({
      success: true,
      message: "Booking rescheduled successfully",
      booking,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to reschedule booking",
      error: error.message,
    });
  }
};


const getMonthAvailability = async (req, res) => {
  try {
    const { year, month } = req.query;

    if (!year || !month) {
      return res.status(400).json({
        success: false,
        message: "Year and month are required",
      });
    }

    const startMonth = String(month).padStart(2, "0");
    const datePrefix = `${year}-${startMonth}-`;

    const bookings = await Booking.find(
      {
        eventDate: { $regex: new RegExp(`^${datePrefix}`) },
        status: { $in: ACTIVE_BOOKING_STATUSES },
      },
      "eventDate"
    );

    const counts = {};
    bookings.forEach((b) => {
      const dateOnly = b.eventDate;
      counts[dateOnly] = (counts[dateOnly] || 0) + 1;
    });

    res.status(200).json({
      success: true,
      counts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch month availability",
      error: error.message,
    });
  }
};


module.exports = {
  createBooking,
  getBookings,
  updateBookingStatus,
  deleteBooking,
  getBookingStats,
  getUserBookings,
  checkAvailability,
  rescheduleBooking,
  getMonthAvailability
};
