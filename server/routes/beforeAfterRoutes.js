const express = require("express");
const router = express.Router();
const { verifyAdmin } = require("../middleware/authMiddleware");

const {
  uploadBeforeAfter,
  getBeforeAfterItems,
  deleteBeforeAfterItem,
} = require("../controllers/beforeAfterController");

const upload = require("../middleware/upload");

router.post(
  "/upload",
  verifyAdmin,
  upload.fields([
    { name: "beforeImage", maxCount: 1 },
    { name: "afterImage", maxCount: 1 },
  ]),
  uploadBeforeAfter
);

router.get("/", getBeforeAfterItems);
router.delete("/:id", verifyAdmin, deleteBeforeAfterItem);

module.exports = router;