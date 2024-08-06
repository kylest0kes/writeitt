import multer from 'multer';
import path from 'path';
import AWS from 'aws-sdk';
import multerS3 from 'multer-s3';

let upload;

if (process.env.USE_S3 === 'true') {
    const s3 = new AWS.S3({
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION
    });

    upload = multer({
        storage: multerS3({
            s3: s3,
            bucket: process.env.S3_BUCKET,
            acl: 'public-read',
            key: (req, file, cb) => {
                cb(null, 'avatars/' + Date.now().toString() + path.extname(file.originalname))
            }
        }),
        limits: { fileSize: 10 * 1024 * 1024}
    });
} else {
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'uploads/')
        },
        filename: (req, file, cb) => {
            cb(null, 'avatar-' + Date.now() + path.extname(file.originalname))
        }
    });

    upload = multer({
        storage: storage,
        limits: { fileSize: 10 * 1024 * 1024}
    });
}

export function getFileURL(req) {
    if (process.env.USE_S3 === 'true') {
        return req.file.location
    } else {
        return `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
    }
}

export default upload;

