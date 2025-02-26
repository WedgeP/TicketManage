// middleware/auth.js
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const authenticateJWT = (req, res, next) => {

    const token = req.cookies.jwt;  // 从 cookies 获取 JWT

    if (!token) {
        return res.status(403).json({message: 'Token is required'});
    }

    // 验证 JWT
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({message: 'Invalid or expired token'});
        }

        req.user = decoded;  // 将解码后的用户信息存储在请求对象中
        next();  // 继续请求处理
    });


};

module.exports = authenticateJWT;