const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { loginLimiter } = require("../middleware/rateLimiter");

router.post("/login", loginLimiter, (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Password is required",
      });
    }

    const adminPassword = process.env.ADMIN_PASSWORD;

    if (password === adminPassword) {
      // Create JWT token
      const token = jwt.sign(
        { role: "admin" },
        process.env.JWT_SECRET,
        { expiresIn: "7d" } // Token valid for 7 days
      );

      return res.status(200).json({
        success: true,
        message: "Admin authenticated successfully",
        token,
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Invalid admin password",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error during login",
      error: error.message,
    });
  }
});

module.exports = router;
