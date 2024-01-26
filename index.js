const express = require('express');
const app = express();
const fs = require('fs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// Middleware Functions For Image Uploading

const uploadbySingle = require('./imageuploadmiddleware/uploadbySingle');
const uploadAndRename = require('./imageuploadmiddleware/uploadAndRename');
const uploadBySeperate = require('./imageuploadmiddleware/multipleUploadbySeperate');
const uploadbyArray = require('./imageuploadmiddleware/multipleUploadbyArray')

app.get('/', (req, res) => {

    const msg =
        `
    <h2>Now You are Connected With the Server...</h2>
    <p>Find the Below API [POST]</p>
    <ul>
        <li>singleupload</li>
        <li>multipleuploadbyarray</li>
        <li>multipleuploadbysepeate</li>
    </ul>    
    `

    res.send(msg)
})

app.post('/singleupload', uploadbySingle, (req, res) => {


    // For Uploading Image 
    if (req.file) {

        // Name For image
        var name = 'img'
        var directoryPath = `public/users/single`;
        var convertedFilePath = uploadAndRename(req.file, name, directoryPath);

    } else {
        var convertedFilePath = ''
    }
    console.log(`Image saved in the path : ${convertedFilePath}`);

    return res.status(200).json({ message: 'File upload successful' });
})

app.post('/multipleuploadbyarray', uploadbyArray, (req, res) => {

    var files = req.files

    if (files) {

        var name = ['img1', 'img2', 'img3', 'img4']
        var directoryPath = `public/users/array`;

        files.forEach((file, index) => {
            uploadAndRename(file, name[index], directoryPath)
        })
    }
    return res.status(200).json({ message: 'File upload successful' });
})

app.post('/multipleuploadbysepeate', uploadBySeperate, (req, res) => {


    // For Uploading Image
    const files = req.files;


    if (files) {

        var directoryPath = `public/users/multiple`;


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