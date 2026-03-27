const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");

const {
  uploadGalleryImage,
  getGalleryImages,
  deleteGalleryImage,
} = require("../controllers/galleryController");

router.get("/", getGalleryImages);
router.post("/upload", upload.single("image"), uploadGalleryImage);
router.delete("/:id", deleteGalleryImage);

module.exports = router;