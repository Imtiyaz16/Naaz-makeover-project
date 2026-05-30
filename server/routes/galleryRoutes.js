const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { verifyAdmin } = require("../middleware/authMiddleware");

const {
  uploadGalleryImage,
  getGalleryImages,
  deleteGalleryImage,
} = require("../controllers/galleryController");

router.get("/", getGalleryImages);
router.post("/upload", verifyAdmin, upload.single("image"), uploadGalleryImage);
router.delete("/:id", verifyAdmin, deleteGalleryImage);

module.exports = router;