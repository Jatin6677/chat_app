// lib/cloudinary.js or config/cloudinary.js
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY,  // ✅ usually it's `API_KEY` not `API_KEYS`
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;
