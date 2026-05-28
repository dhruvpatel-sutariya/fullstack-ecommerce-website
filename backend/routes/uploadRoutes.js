const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { protect, adminOnly } = require('../middleware/authMiddleware');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// @POST /api/upload
router.post('/', protect, adminOnly, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

        const result = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                { folder: 'quickmart', resource_type: 'image' },
                (error, result) => error ? reject(error) : resolve(result)
            ).end(req.file.buffer);
        });

        res.json({ url: result.secure_url });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
