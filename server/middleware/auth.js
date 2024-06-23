import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
    const authHeader = req.header('Authorization');

    // check for authHeader
    if (!authHeader) {
        return res.status(401).json({ message: 'No token found, authorization denided'});
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token found, authorization denied'});
    }

    // verify token
    try {
        const decoded = jwt.verify(token, process.env.SESSION_SECRET);

        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid'});
    }
};

export default authMiddleware;