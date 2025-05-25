const express = require('express');
const router = express.Router();
const db = require('../mydb');  // 引入 knex 实例
const dotenv = require('dotenv');
dotenv.config();

// 处理 GET 请求，渲染注册页面
router.get('/', (req, res) => {
    res.render('signup', {errorMessage: null});  // 渲染注册页面，初始无错误
});

// 处理 POST 请求，用户注册
router.post('/', async (req, res) => {
    const {username, password, confirmPassword, role,email} = req.body;

    // 检查密码是否匹配
    if (password !== confirmPassword) {
        return res.render('signup', {errorMessage: 'Passwords do not match'});
    }

    try {
        // 检查用户名是否已存在
        const user = await db('Users').where({ username }).first(); // 使用 knex 查询数据库
        if (user) {
            return res.render('signup', {errorMessage: 'Username already exists'});
        }

        // 对密码进行哈希加密
        const hashedPassword =password;

        // 将新用户数据插入数据库
        await db('Users').insert({ username, password: hashedPassword, role: role,email:email });

        // 注册成功，重定向到登录页面
        res.redirect('/login');
    } catch (error) {
        return res.status(500).json({message: 'Database error', error: error.message});
    }
});

module.exports = router;