const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.header('x-auth-token');

    // Check for token
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        // Verify token (remove Bearer if present)
        const tokenString = token.startsWith('Bearer ') ? token.slice(7, token.length) : token;

        const decoded = jwt.verify(tokenString, process.env.JWT_SECRET);

        // Add user from payload
        req.user = decoded;
        next();
    } catch (e) {
        res.status(400).json({ msg: 'Token is not valid' });
    }
}

module.exports = verifyToken;
