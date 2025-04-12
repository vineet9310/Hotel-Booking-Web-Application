const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).json({message: 'Token Required.'});

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch {
        return res.status(403).json({message: 'Invalid token.'});
    }
}

module.exports = authMiddleware;