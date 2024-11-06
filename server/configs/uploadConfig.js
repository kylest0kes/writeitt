import multer from 'multer';
import path from 'path';
import { S3Client } from '@aws-sdk/client-s3';
import multerS3 from 'multer-s3';
import fs from 'fs';

export function configureUpload() {
    // Ensure uploads directory exists for local storage
    if (process.env.USE_S3 !== 'true') {
        const uploadsDir = path.join(process.cwd(), 'uploads');
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }
    }

    const fileFilter = (req, file, cb) => {
        const allowedMimeTypes = [
            'image/jpeg',
            'image/jpg',
            'image/png',
            'image/gif',
            'video/mp4',
            'video/webm',
            'video/ogg'
        ];

        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error(`Invalid file type. Allowed types: ${allowedMimeTypes.join(', ')}`));
        }
    };

    if (process.env.USE_S3 === 'true') {
        // Validate S3 configuration
        const requiredEnvVars = [
            'AWS_ACCESS_KEY',
            'AWS_SECRET_ACCESS_KEY',
            'AWS_REGION',
            'S3_BUCKET'
        ];

        const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
        if (missingVars.length > 0) {
            throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
        }

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
                    const fileName = `${folder}${Date.now()}-${path.basename(file.originalname)}`;
                    cb(null, fileName);
                },
                contentType: multerS3.AUTO_CONTENT_TYPE
            }),
            limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
            fileFilter: fileFilter
        });
    } else {
        const storage = multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, 'uploads/');
            },
            filename: (req, file, cb) => {
                const prefix = file.mimetype.startsWith('image/') ? 'images-' : 'videos-';
                const fileName = `${prefix}${Date.now()}-${path.basename(file.originalname)}`;
                cb(null, fileName);
            }
        });

        return multer({
            storage: storage,
            limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
            fileFilter: fileFilter
        });
    }
}

export function getFileURL(file) {
    if (!file) {
        throw new Error('No file provided');
    }

    if (process.env.USE_S3 === 'true') {
        if (!file.location) {
            throw new Error('S3 file location not found');
        }
        return file.location;
    } else {
        if (!file.filename) {
            throw new Error('Local file name not found');
        }
        return `/uploads/${file.filename}`;
    }
}
