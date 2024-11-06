import { configureUpload } from "../configs/uploadConfig.js";

const handleFileUpload = (req, res, next) => {
    const upload = configureUpload();

    upload.single('postMedia')(req, res, (err) => {
        if (err) {
            if (err instanceof multer.MulterError) {
                // Handle Multer-specific errors
                if (err.code === 'LIMIT_FILE_SIZE') {
                    return res.status(400).json({
                        message: 'File is too large. Maximum size is 50MB'
                    });
                }
                return res.status(400).json({
                    message: `Upload error: ${err.message}`
                });
            } else {
                // Handle other errors (like invalid file type)
                return res.status(400).json({
                    message: err.message || 'Error uploading file'
                });
            }
        }
        next();
    });
};

export default handleFileUpload;
