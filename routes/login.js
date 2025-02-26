const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../mydb');
const CryptoJS = require('crypto-js');
const dotenv = require('dotenv');
dotenv.config();


// Handle GET request to render the login page
router.get('/', (req, res) => {
    res.render('login', { errorMessage: null });  // Render login page with no error initially
});

// Handle POST request for login authentication
router.post('/', async (req, res) => {
    const { username, password, time } = req.body;

    try {
        let { accept, userId } = await check(username, password, time);

        if (accept) {
            let { admin } = userId;
            let token = "";

            if (!admin) {
                token = jwt.sign({
                    id: userId.username, admin: false
                }, process.env.JWT_SECRET, { expiresIn: '10min' });
            } else {
                token = jwt.sign({
                    id: userId.username, admin: true
                }, process.env.JWT_SECRET, { expiresIn: '10min' });
            }

            // 将 JWT 存储在 httpOnly cookie 中
            res.cookie('jwt', token, {
                httpOnly: true,  // 确保客户端 JavaScript 无法访问该 cookie
                maxAge: 3600000, // 1小时有效期
                path: '/'
            });
            res.json({token:'/users'});
        } else {
            // If login fails, render the login page with an error message
            res.render('login', { errorMessage: 'Invalid username or password' });
        }
    } catch (err) {
        console.error('Login error:', err);
        res.render('login', { errorMessage: 'An error occurred during login' });
    }
});

module.exports = router;

// 修改后的check函数
async function check(username, password2, time) {
    if (Date.now() > time + 2500) {
        return { accept: false };
    }

    try {
        // 使用 knex 查询数据库中的用户
        const user = await db('users').where({ username }).first();

        if (!user) {
            return { accept: false };
        }

        // 判断密码和时间戳（防止重放攻击）
        const passwordWithTime = user.password + time;
        const hashedPassword = CryptoJS.SHA256(passwordWithTime).toString(CryptoJS.enc.Hex);
        console.log(user, hashedPassword,password2);
        if (hashedPassword !== password2) {
            return { accept: false };
        }

        if (user.role === "admin") {
            return {
                accept: true,
                userId: { username: username, id: user.id, admin: true }
            };
        } else {
            return {
                accept: true,
                userId: { username: username, id: user.id, admin: false }
            };
        }
    } catch (err) {
        console.error('Database error:', err);
        throw new Error('Database error');
    }
}