import { Router } from 'express';
const router = Router();
import streamifier from 'streamifier'
import { upload, cloudinary } from '../config/cloudinary.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const publicId = `product_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'shopapp/products',
        public_id: publicId,
        transformation: [{ width: 800, height: 800, crop: 'limit', quality: 'auto' }],
      },
      (error, result) => {
        if (error) {
          console.log('Cloudinary stream error:', error);
          reject(error);
        } else {
          console.log('Uploaded:', result.secure_url);
          resolve(result.secure_url);
        }
      }
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
};

// Upload route
router.post('/', protect, adminOnly, upload.array('images', 3), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0)
      return res.status(400).json({ message: 'No images uploaded' });

    console.log(`Uploading ${req.files.length} file(s) to Cloudinary...`);

    // Upload all files in parallel
    const urls = await Promise.all(
      req.files.map(file => uploadToCloudinary(file.buffer))
    );

    console.log('All URLs:', urls);
    res.json({ urls });
  } catch (err) {
    console.log('Upload route error:', err.message);
    res.status(500).json({ message: err.message });
  }
});

export default router;