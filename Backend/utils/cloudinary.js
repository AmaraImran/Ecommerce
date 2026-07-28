import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

const uploadBufferToCloudinary = async (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: "auto" },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result);
      }
    );

    stream.end(buffer);
  });
};

const UploadOnCloudinary = async (file) => {
  try {
    if (!file) throw new Error("File is required");

    let response;

    if (Buffer.isBuffer(file)) {
      response = await uploadBufferToCloudinary(file);
    } else if (typeof file === "string") {
      response = await cloudinary.uploader.upload(file, {
        resource_type: "auto",
      });

      if (fs.existsSync(file)) {
        fs.unlinkSync(file);
      }
    } else {
      throw new Error("Unsupported file format");
    }

    console.log("File uploaded successfully:", response.secure_url);
    return response;
  } catch (error) {
    console.error("Cloudinary Upload Error:", error.message);

    if (typeof file === "string" && file && fs.existsSync(file)) {
      fs.unlinkSync(file);
    }

    return null;
  }
};

export default UploadOnCloudinary;
