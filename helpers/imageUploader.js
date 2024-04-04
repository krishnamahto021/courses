const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports.uploadImageToCloudinary = async (imageFile) => {
  try {
    const result = await cloudinary.uploader.upload(imageFile.path);
    return result.secure_url;
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    throw new Error("Failed to upload image to Cloudinary");
  }
};