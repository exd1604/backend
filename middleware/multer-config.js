/*
    Multer middleware to manage images to load
    Contains the setup to define where the loaded files will be stored on disk as well
    as ensure the filename is uinque (Potentially same image could be loaded on several
    sauces)
*/
const multer = require('multer');
// Accepted mime types
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png',
}

const storage = multer.diskStorage({
    destination: (req, file, callback) => {        
        callback(null, 'images');
    },
// File name is made unique with timestamp inclusion
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_').slice(0, file.originalname.lastIndexOf('.'));
        const extension = MIME_TYPES[file.mimetype];     
        callback(null, name + '_' + Date.now() + '.' + extension);   
    }
});

module.exports = multer({ storage }).single('image');