import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

try {

  const result = await cloudinary.uploader.upload(
    "https://res.cloudinary.com/demo/image/upload/sample.jpg"
  );

  console.log("UPLOAD SUCCESS");
  console.log(result.secure_url);

} catch (err) {

  console.log("UPLOAD ERROR");
  console.dir(err, { depth: null });

}