const express = require('express')
const uploadImg = require('../helpers/image_upload')
const router = express.Router()
const sharp = require('sharp')

router.post('/upload', uploadImg.single('image'), async (req, res, next) => {

    const file = req.file
    const filePath = file.path
    if (!file) {
        error = new Error('no Images')
        error.status = 400
        return next(error)
    }
    try {
        sharp(filePath).resize(200,200).toFile('uploads/'+'thumbnails-'+file.originalname,(err,resizeimage)=>{
            if(err){
                console.log(err)
            }else{
                console.log(resizeimage)
            }
        })
        const imageUrl = `http://localhost:3000/${filePath}`

    res.status(200).json({
        message: "Upload succesful",
        data: imageUrl
    })
    
        
    } catch (error) {
        next(error)
    }

})
module.exports = router