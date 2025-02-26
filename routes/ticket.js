const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const knex = require('../mydb');  // 使用 knex 作为数据库连接

// 获取当前用户的票务信息
router.post('/', (req, res) => {
    const { ticketCount, month } = req.body;

    // 从 cookie 获取 JWT 并验证用户
    const token = req.cookies.jwt;
    if (!token) {
        return res.status(401).json({ errorMessage: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
            return res.status(401).json({ errorMessage: 'Invalid token' });
        }

        // 获取用户的用户名
        const username = decoded.id;

        try {
            // 使用 Knex 查询票务信息
            const tickets = await knex('tickets')
                .select('*')
                .where('user_id', username)
                .andWhereRaw('strftime("%m", created_at) = ?', [month])
                .limit(ticketCount);

            // 如果查询结果为空
            if (tickets.length === 0) {
                return res.json({ errorMessage: 'No tickets found for the selected month' });
            }

            // 返回票务信息
            res.json({ tickets });
        } catch (err) {
            console.log(err);
            return res.status(500).json({ errorMessage: 'Database error', error: err.message });
        }
    });
});

module.exports = router;