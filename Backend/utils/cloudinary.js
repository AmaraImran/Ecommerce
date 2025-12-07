import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Cloudinary automatically reads CLOUDINARY_URL from env

const UploadOnCloudinary = async (filePath) => {
  try {
    if (!filePath) throw new Error("File path is required");

    const response = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto",
    });

    console.log("File uploaded successfully:", response.secure_url);

    // remove local file
    fs.unlinkSync(filePath);

    return response;
    

  } catch (error) {
    console.error("Cloudinary Upload Error:", error.message);

    // delete local file even if upload fails
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return null;
  }
};

export default UploadOnCloudinary;
