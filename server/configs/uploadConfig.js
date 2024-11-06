import multer from 'multer';
import path from 'path';
import { S3Client } from '@aws-sdk/client-s3';
import multerS3 from 'multer-s3';
import fs from 'fs';

export function configureUpload() {
    const allowedMimeTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'video/mp4',
        'video/webm',
        'video/ogg'
    ];

    const fileFilter = (req, file, cb) => {
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error(`Invalid file type. Allowed types: ${allowedMimeTypes.join(', ')}`));
        }
    };

    // For debugging
    console.log('USE_S3 value:', process.env.USE_S3);
    console.log('USE_S3 type:', typeof process.env.USE_S3);

    // Check if USE_S3 is explicitly set to the string 'true'
    if (process.env.USE_S3 === 'true') {
        console.log('Configuring S3 storage...');

        // Validate S3 configuration
        const requiredEnvVars = ['AWS_ACCESS_KEY', 'AWS_SECRET_ACCESS_KEY', 'AWS_REGION', 'S3_BUCKET'];
        const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

        if (missingVars.length > 0) {
            throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
        }

        // Log S3 configuration (remove in production)
        console.log('S3 Configuration:', {
            region: process.env.AWS_REGION,
            bucket: process.env.S3_BUCKET,
            accessKeyId: process.env.AWS_ACCESS_KEY?.substring(0, 4) + '...',
        });

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
                // acl: 'public-read',
                metadata: function (req, file, cb) {
                    cb(null, { fieldName: file.fieldname });
                },
                key: function (req, file, cb) {
                    const folder = file.mimetype.startsWith('image/') ? 'images/' : 'videos/';
                    const fileName = `${folder}${Date.now()}-${path.basename(file.originalname)}`;
                    console.log('Generated S3 key:', fileName);
                    cb(null, fileName);
                }
            }),
            limits: { fileSize: 50 * 1024 * 1024 },
            fileFilter: fileFilter
        });
    } else {
        console.log('Configuring local storage...');

        // Ensure uploads directory exists for local storage
        const uploadsDir = path.join(process.cwd(), 'uploads');
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }

        return multer({
            storage: multer.diskStorage({
                destination: (req, file, cb) => {
                    cb(null, 'uploads/');
                },
                filename: (req, file, cb) => {
                    const prefix = file.mimetype.startsWith('image/') ? 'images-' : 'videos-';
                    const fileName = `${prefix}${Date.now()}-${path.basename(file.originalname)}`;
                    cb(null, fileName);
                }
            }),
            limits: { fileSize: 50 * 1024 * 1024 },
            fileFilter: fileFilter
        });
    }
}

export function getFileURL(file) {
    if (!file) {
        throw new Error('No file provided');
    }

    // For debugging
    console.log('File object in getFileURL:', file);
    console.log('USE_S3 value in getFileURL:', process.env.USE_S3);

    if (process.env.USE_S3 === 'true' && file.key) {
        // For S3 uploads
        return `https://${process.env.S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${file.key}`;
    } else if (process.env.USE_S3 === 'true' && !file.key) {
        // If we're supposed to use S3 but got a local file
        console.error('Expected S3 file but got local file:', file);
        throw new Error('S3 configuration error: file was saved locally instead of to S3');
    } else {
        // For local uploads
        if (!file.filename) {
            throw new Error('Local file name not found');
        }
        return `/uploads/${file.filename}`;
    }
}
