const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const uploadMiddleware = require('./uploadmiddleware/uploadmiddleware');

const fs = require('fs')

app.post('/upload', uploadMiddleware, (req, res) => {

    const files = req.files;

    files.forEach((file) => {
        const filePath = `uploads/${file.filename}`;
        fs.rename(file.path, filePath, (err) => {
            if (err) {

                return res.status(500).json({ error: 'Failed to store the file' });
            }
        });

        const extName = file.originalname.split(".")[1];
        const randomNum = Math.floor(Math.random() * 100000000);
        const newFileName = `${'A'}_${randomNum}.${extName}`;
        convertedFilePath = `uploads/${newFileName}`;

        // Rename the File Name
        fs.rename(file.path, convertedFilePath, (err) => {
            if (err) { console.log("error in File Rename", err.message); }
        })
    });

    return res.status(200).json({ message: 'File upload successful' });
});


const port = 3000;

app.listen(port, () => {
    console.log(`Server running on port http://localhost:${port}`);
});