const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    service: {
      type: String,
      required: true,
      trim: true,
    },
    eventDate: {
      type: String,
      required: true,
      index: true,
    },
    location: {
      type: String,
      trim: true,
    },
    message: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Completed", "Cancelled"],
      default: "Pending",
      index: true,
    },
    rescheduledAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Better query performance for availability, tracking, and reschedule checks
bookingSchema.index({ eventDate: 1, status: 1 });
bookingSchema.index({ phone: 1, name: 1 });

module.exports = mongoose.model("Booking", bookingSchema);