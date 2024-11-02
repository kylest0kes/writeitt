import multer from 'multer';
import path from 'path';
import { S3Client } from '@aws-sdk/client-s3';
import multerS3 from 'multer-s3';

export function configureUpload() {
    const fileFilter = (req, file, cb) => {
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/webm', 'video/ogg'];
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only images and videos are allowed.'), false);
        }
    };

    if (process.env.USE_S3 === 'true') {
        const s3 = new S3Client({
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
            },
            region: process.env.AWS_REGION
        });

        return multer({
            storage: multerS3({
                s3: s3,
                bucket: process.env.S3_BUCKET,
                key: (req, file, cb) => {
                    const folder = file.mimetype.startsWith('image/') ? 'images/' : 'videos/';
                    const fileName = folder + Date.now().toString() + path.extname(file.originalname);
                    cb(null, fileName);
                }
            }),
            limits: { fileSize: 50 * 1024 * 1024 },
            fileFilter: fileFilter
        });
    } else {
        const storage = multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, 'uploads/')
            },
            filename: (req, file, cb) => {
                const folder = file.mimetype.startsWith('image/') ? 'images-' : 'videos-';
                cb(null, folder + Date.now() + path.extname(file.originalname));
            }
        });

        return multer({
            storage: storage,
            limits: { fileSize: 50 * 1024 * 1024 },
            fileFilter: fileFilter
        });
    }
}

export function getFileURL(req, fileField = 'media') {
    if (process.env.USE_S3 === 'true') {
        // Handle single vs. multiple files for S3
        if (fileField && req.files && req.files[fileField]) {
            return req.files[fileField][0].location;
        } else if (req.file) {
            return req.file.location;
        }
    } else {
        // Local storage: check if single upload or multiple
        if (fileField && req.files && req.files[fileField]) {
            return `${req.protocol}://${req.get('host')}/uploads/${req.files[fileField][0].filename}`;
        } else if (req.file) {
            return `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        }
    }
    throw new Error('No file found');
}
