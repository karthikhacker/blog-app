import multer from "multer";
import { S3Client } from "@aws-sdk/client-s3";
import multerS3 from 'multer-s3';
import path from 'path';

const s3 = new S3Client({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY
    },
    region: process.env.AWS_BUCKET_REGION
})

const s3Storage = multerS3({
    s3,
    bucket: 'blog-image-mern',
    acl: 'public-read',
    metadata: function (req, file, cb) {
        cb(null, { fieldname: file.fieldname })
    },
    key: function (req, file, cb) {
        const fileName = Date.now() + "_" + file.fieldname + "_" + file.originalname;
        cb(null, fileName);
    }
})

function sanitizeFile(file, cb) {
    const fileExists = ['.png', '.jpg', '.jpeg'];
    const isAllowedExt = fileExists.includes(path.extname(file.originalname.toLowerCase()));
    const allowedMimeType = file.mimetype.startsWith("image/");
    if (isAllowedExt && allowedMimeType) {
        return cb(null, true)
    } else {
        cb("Error :  FIle type not allowed.")
    }
}

const upload = multer({
    storage: s3Storage,
    fileFilter: (req, file, callback) => {
        sanitizeFile(file, callback);
    }
})

export default upload;