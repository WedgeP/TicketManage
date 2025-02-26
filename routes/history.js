const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const jwtauth=require('/middleware/jwtauth');
// 创建数据库连接
const db = new sqlite3.Database('./ticket_system.db');

// 获取历史订单的路由
router.post('/', jwtauth, (req, res) => {
    const userId = req.user.id;  // 获取用户 ID
    const { admin } = req.user;   // 检查是否为管理员

    let query = 'SELECT * FROM Orders WHERE user_id = ?';

    // 如果是管理员，可以查看所有用户的历史订单
    if (admin) {

        db.all(query, [req.body["queryname"]], (err, rows) => {
            if (err) {
                return res.status(500).json({ message: 'Error fetching orders', error: err.message });
            }

            res.json(rows);  // 返回查询到的历史订单数据
        });
        return;
    }

    // 查询数据库中的历史订单
    db.all(query, [userId], (err, rows) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching orders', error: err.message });
        }

        res.json(rows);  // 返回查询到的历史订单数据
    });
});

module.exports = router;