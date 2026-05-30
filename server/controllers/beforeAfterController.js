const cloudinary = require("../config/cloudinary");
const BeforeAfter = require("../models/BeforeAfter");
const streamifier = require("streamifier");

const uploadToCloudinary = (fileBuffer, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result);
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

const uploadBeforeAfter = async (req, res) => {
  try {
    const { title, category } = req.body;

    if (!title || !category) {
      return res.status(400).json({
        success: false,
        message: "Title and category are required",
      });
    }

    if (!req.files || !req.files.beforeImage || !req.files.afterImage) {
      return res.status(400).json({
        success: false,
        message: "Both before and after images are required",
      });
    }

    const beforeUpload = await uploadToCloudinary(
      req.files.beforeImage[0].buffer,
      "naaz-makeover/before-after"
    );

    const afterUpload = await uploadToCloudinary(
      req.files.afterImage[0].buffer,
      "naaz-makeover/before-after"
    );

    const item = await BeforeAfter.create({
      title,
      category,
      beforeImageUrl: beforeUpload.secure_url,
      afterImageUrl: afterUpload.secure_url,
      beforePublicId: beforeUpload.public_id,
      afterPublicId: afterUpload.public_id,
    });

    res.status(201).json({
      success: true,
      message: "Before / After uploaded successfully",
      item,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Upload failed",
      error: error.message,
    });
  }
};

const getBeforeAfterItems = async (req, res) => {
  try {
    const items = await BeforeAfter.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      items,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch before / after items",
      error: error.message,
    });
  }
};

const deleteBeforeAfterItem = async (req, res) => {
  try {
    const item = await BeforeAfter.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    await cloudinary.uploader.destroy(item.beforePublicId);
    await cloudinary.uploader.destroy(item.afterPublicId);

    await BeforeAfter.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Before / After item deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Delete failed",
      error: error.message,
    });
  }
};

module.exports = {
  uploadBeforeAfter,
  getBeforeAfterItems,
  deleteBeforeAfterItem,
};