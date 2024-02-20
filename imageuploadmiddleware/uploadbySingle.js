const multer = require('multer');
const fs = require('fs');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/')
    }
});

const upload = multer({ storage: storage });



const uploadSingle = (req, res, next) => {

    upload.single('image')(req, res, (err) => {

        if (err) {
            return res.status(400).json({ error: err });
        }

        if (req.file) {
            const file = req.file;
            const errors = [];

            const allowedTypes = ['image/jpeg', 'image/png'];
            const maxSize = 5 * 1024 * 1024;  // 5MB;

            if (!file) {
                errors.push('No file uploaded');
            } else {
                if (!allowedTypes.includes(file.mimetype)) {
                    errors.push(`Invalid file type: ${file.originalname}`);
                }

                if (file.size > maxSize) {
                    errors.push(`File too large: ${file.originalname}`);
                }
            }

            if (errors.length > 0) {
                if (file) {
                    fs.unlinkSync(file.path);
                }
                return res.status(400).json({ errors });
            }

            req.file = file;

            next();
        } else {
            next();
        }
    });
};


module.exports = uploadSingle;