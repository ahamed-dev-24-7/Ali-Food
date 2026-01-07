import { v2 as cloudinary } from "cloudinary"
import fs from "fs"
import dotenv from "dotenv"
dotenv.config()

const uplodadCloudinarImage = async (file) => {
   cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEYS,
      api_secret: process.env.CLOUDINARY_SECRET_KEYS
   })
   // try {
   //    const result = await cloudinary.uploader.upload(file)
   //    fs.unlinkSync(file)
   //    return result.secure_url
   // } catch (error) {
   //    fs.unlinkSync(file)
   //    console.log(error)
   // }
   try {
      const result = await cloudinary.uploader.upload(file, {
         folder: "shops", // optional folder
         resource_type: "image",
      });
      fs.unlinkSync(file);
      return result.secure_url;
   } catch (error) {
      console.error("Cloudinary Upload Error:", error);
      if (fs.existsSync(file)) fs.unlinkSync(file);
      throw new Error("Image upload failed");
   }
}

export default uplodadCloudinarImage