const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const compression = require("compression");

dotenv.config();

const REQUIRED_ENV_VARS = [
  "MONGO_URI",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
  "ADMIN_PASSWORD",
  "JWT_SECRET"
];

const OPTIONAL_ENV_VARS = [
  "TWILIO_ACCOUNT_SID",
  "TWILIO_AUTH_TOKEN",
  "TWILIO_WHATSAPP_FROM"
];

const missingRequired = REQUIRED_ENV_VARS.filter(key => !process.env[key]);
if (missingRequired.length > 0) {
  console.error("CRITICAL FATAL ERROR: Missing required environment variables on startup: " + missingRequired.join(", "));
  process.exit(1);
}

const missingOptional = OPTIONAL_ENV_VARS.filter(key => !process.env[key]);
if (missingOptional.length > 0) {
  console.warn("STARTUP WARNING: Missing optional environment variables: " + missingOptional.join(", ") + ". WhatsApp notification alerts will be disabled.");
}

const app = express();

app.use(helmet({ contentSecurityPolicy: false }));
app.use(compression());

const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(",").map((url) => url.trim())
  : ["http://localhost:5173", "http://localhost:3000"];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes("*")) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/bookings", require("./routes/bookingRoutes"));
app.use("/api/gallery", require("./routes/galleryRoutes"));
app.use("/api/before-after", require("./routes/beforeAfterRoutes"));

app.get("/", (req, res) => {
  res.send("Naaz Makeover API is running...");
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("MongoDB error:", error.message);
  });


  // Trigger nodemon restart
  // for hosting use this below code and update in this file 

// app.use(
//   cors({
//     origin: ["http://localhost:5173", "https://your-vercel-domain.vercel.app"],
//     methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );