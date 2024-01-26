const fs = require('fs');


const uploadAndRename = (file, prefix, directoryPath) => {

     
    if (file) {

        const extName = file.originalname.split(".")[1];
        const randomNum = Math.floor(Math.random() * 100000000);
        const newFileName = `${prefix}_${randomNum}.${extName}`;


        if (!fs.existsSync(directoryPath)) {
            fs.mkdirSync(directoryPath, { recursive: true });
        }
        var convertedFilePath = `${directoryPath}/${newFileName}`;


        fs.rename(file.path, convertedFilePath, (err) => {
            if (err) {
                console.log("Error in File Rename", err.message);
                return res.status(500).json({ error: 'Failed to store the file' });
            }
        });

    } else {
        console.log("File object is undefined or null.");

    }
    return convertedFilePath;
};


module.exports = uploadAndRename;