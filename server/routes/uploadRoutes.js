import express from 'express';
import streamifier from 'streamifier';
import { upload, cloudinary } from '../config/cloudinary.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

export const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const publicId = `product_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'shopapp/products',
        public_id: publicId,
        transformation: [{ width: 800, height: 800, crop: 'limit', quality: 'auto' }],
      },
      (error, result) => {
        if (error) reject(error);
        else resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

export const deleteFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.log('Cloudinary delete error:', err.message);
  }
};

router.post('/', protect, adminOnly, upload.array('images', 3), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0)
      return res.status(400).json({ message: 'No images uploaded' });

    const results = await Promise.all(
      req.files.map(file => uploadToCloudinary(file.buffer))
    );

    // return both url and publicId to frontend
    res.json({ images: results });
  } catch (err) {
    console.log('Upload error:', err.message);
    res.status(500).json({ message: err.message });
  }
});

router.delete('/', protect, adminOnly, async (req, res) => {
  try {
    const { publicId } = req.body;
    if (!publicId)
      return res.status(400).json({ message: 'publicId required' });

    await cloudinary.uploader.destroy(publicId);
    res.json({ message: 'Image deleted from cloudinary' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;