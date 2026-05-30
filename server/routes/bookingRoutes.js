const express = require("express");
const router = express.Router();
const { verifyAdmin } = require("../middleware/authMiddleware");
const { createBookingLimiter, publicApiLimiter } = require("../middleware/rateLimiter");

const {
  createBooking,
  getBookings,
  updateBookingStatus,
  deleteBooking,
  getBookingStats,
  getUserBookings,
  checkAvailability,
  rescheduleBooking,
  getMonthAvailability,


} = require("../controllers/bookingController");

router.post("/", createBookingLimiter, createBooking);
router.get("/", verifyAdmin, getBookings);
router.get("/stats", verifyAdmin, getBookingStats);
router.patch("/:id/status", verifyAdmin, updateBookingStatus);
router.delete("/:id", verifyAdmin, deleteBooking);
router.get("/user", publicApiLimiter, getUserBookings);
router.get("/availability", publicApiLimiter, checkAvailability);
router.get("/month-availability", publicApiLimiter, getMonthAvailability);
router.put("/:id/reschedule", publicApiLimiter, rescheduleBooking);

module.exports = router;