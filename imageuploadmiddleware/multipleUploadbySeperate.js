const multer = require('multer');

const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/')
    }
})


const upload = multer({ storage: storage });


const uploadBySeperate = (req, res, next) => {

    const field1 = 'image1'
    const field2 = 'image2'
    const field3 = 'image3'
    const field4 = 'image4'
    const field5 = 'video'


    upload.fields([
        { name: field1, maxCount: 1 },
        { name: field2, maxCount: 1 },
        { name: field3, maxCount: 1 },
        { name: field4, maxCount: 1 },
        { name: field5, maxCount: 1 }
    ])(req, res, (err) => {

        if (err) {
            return res.status(400).json({ error: err.message })
        }

        if (req.files) {
            const files1 = req.files[field1]
            const files2 = req.files[field2]
            const files3 = req.files[field3]
            const files4 = req.files[field4]
            const files5 = req.files[field5]

            const errors = [];

            console.log("ddwq", files5);
            [files1, files2, files3, files4, files5].forEach((files, index) => {

                const allowedTypes = ['image/jpeg', 'image/png', 'video/mp4'];
                const maxSize = 10 * 1024 * 1024  // 10MB

                if (!files || files.length === 0) {
                    errors.push(`No file provided for ${getFieldName(index)}`);
                } else {

                    const file = files[0];

                    if (!allowedTypes.includes(file.mimetype)) {
                        errors.push(`Invalid file type for ${getFieldName(index)} : ${file.originalname}`);
                    }
                    if (file.size > maxSize) {
                        errors.push(`Invalid file type for ${getFieldName(index)} : ${file.originalname}`);
                    }
                }
            });

            if (errors.length > 0) {

                [files1, files2, files3, files4, files5].forEach((files) => {
                    if (files && files.length > 0) {
                        fs.unlinkSync(files[0].path)
                    }
                })

                return res.status(400).json({ errors });
            }

            req.files = {
                [field1]: files1 ? files1[0] : null,
                [field2]: files2 ? files2[0] : null,
                [field3]: files3 ? files3[0] : null,
                [field4]: files4 ? files4[0] : null,
                [field5]: files5 ? files5[0] : null
            }

            next();
        } else {
            next();
        }
    })
}

const getFieldName = (index) => {

    switch (index) {
        case 0:
            return 'image1';
        case 1:
            return 'image2';
        case 2:
            return 'image3';
        case 3:
            return 'image4';
        case 4:
            return 'video';
        default:
            return `unknown field ${index}`;
    }
}

module.exports = uploadBySeperate;