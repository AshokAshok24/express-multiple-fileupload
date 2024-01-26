const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const uploadbySingle = require('./imageuploadmiddleware/uploadbySingle');
const uploadAndRename = require('./imageuploadmiddleware/uploadAndRename');
const uploadMiddleware = require('./imageuploadmiddleware/uploadmiddleware');
const fs = require('fs');
const uploadbyseperate = require('./imageuploadmiddleware/multipleUploadbySeperate');


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


app.post('/singleupload', uploadbySingle, (req, res) => {


    // For Uploading Image 
    if (req.file) {

        // Name For image
        var name = 'img'
        var directoryPath = `public/users/single/`;
        var convertedFilePath = uploadAndRename(req.file, name, directoryPath);

    } else {
        var convertedFilePath = ''
    }
    console.log(`Image saved in the path : ${convertedFilePath}`);

    return res.status(200).json({ message: 'File upload successful' });
})


app.post('/multipleuploadbysepeate', uploadbyseperate, (req, res) => {


    // For Uploading Image
    const files = req.files;


    if (files) {

        var directoryPath = `public/users/multiple/`;


        // Fields is about name for uploading Image and video

        const fields = ['image1', 'image2', 'image3', 'image4', 'video'];

        // Names is about Name for Image and video
        const names = ['img1', 'img2', 'img3', 'img4', 'vid'];

        // Process files for each fields
        fields.forEach((field, index) => {
            if (files[field]) {
                uploadAndRename(files[field], names[index], directoryPath);
            }
        });


    } else {
        console.log("File object is undefined or null.");

    }




    return res.status(200).json({ message: 'File upload successful' });
})


const port = 3000;

app.listen(port, () => {
    console.log(`Server running on port http://localhost:${port}`);
});