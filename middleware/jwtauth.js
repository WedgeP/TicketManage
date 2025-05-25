// middleware/auth.js
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

// 错误处理函数
function checkfail(i, res) {
    let message = '';
    let statusCode = 403;

    switch (i) {
        case 1:
            message = 'Token is required';
            statusCode = 401;  // Token 缺失时应返回 401 Unauthorized
            break;
        case 2:
            message = 'Invalid or expired token';
            statusCode = 403;  // Token 过期或无效时返回 403 Forbidden
            break;
        default:
            message = 'Forbidden';
    }
    return res.redirect('/login');
}

// 认证中间件
const authenticateJWT = (req, res, next) => {
    const token = req.cookies.jwt;  // 从 cookies 获取 JWT

    if (!token) {
        return checkfail(1, res);  // 如果没有 token
    }

    // 验证 JWT
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return checkfail(2, res);  // 如果 token 无效或过期
        }

        req.user = decoded;  // 将解码后的用户信息存储在请求对象中
        next();  // 继续请求处理
    });
};

module.exports = authenticateJWT;