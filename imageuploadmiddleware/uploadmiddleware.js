const multer = require('multer');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    }
});

const upload = multer({ storage: storage });

const uploadMiddleware = (req, res, next) => {

    upload.array('images', 5)(req, res, (err) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }

        const files = req.files;
        const errors = [];

        files.forEach((file) => {

            const allowedTypes = ['image/jpeg', 'image/png'];
            const maxSize = 5 * 1024 * 1024; // 5MB

            if (!allowedTypes.includes(file.mimetype)) {
                errors.push(`Invalid file type: ${file.originalname}`);
            }

            if (file.size > maxSize) {
                errors.push(`File too large: ${file.originalname}`);
            }

        });

        if (errors.length > 0) {

            files.forEach((file) => { fs.unlinkSync(file.path); });

            return res.status(400).json({ errors });
        }

        req.files = files;

        next();
    });
};

module.exports = uploadMiddleware;





