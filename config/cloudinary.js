const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure: true,
});

async function uploadToCloudinary(filePath) {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "blog-app-v3",
      transformation: [{ width: 500, height: 500, crop: "limit" }],
    });
    return result;
  } catch (error) {
    throw new Error(`Error al subir imagen a Cloudinary: ${error.message}`);
  }
}

module.exports = {uploadToCloudinary};
