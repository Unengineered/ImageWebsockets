const multer = require('multer');

//creates storage for images
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname);
    }
});

const uploadImg = multer({ storage: storage })
module.exports = uploadImg