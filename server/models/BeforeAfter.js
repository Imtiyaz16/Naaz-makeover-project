const mongoose = require("mongoose");

const beforeAfterSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    beforeImageUrl: {
      type: String,
      required: true,
    },
    afterImageUrl: {
      type: String,
      required: true,
    },
    beforePublicId: {
      type: String,
      required: true,
    },
    afterPublicId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("BeforeAfter", beforeAfterSchema);