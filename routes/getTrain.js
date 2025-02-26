const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../mydb');  // 数据库连接
const authenticateJWT = require('../middleware/jwtauth');  // 验证 JWT 的中间件

// 获取火车信息的 GET 路由
router.get('/gettrain', authenticateJWT, (req, res) => {
    const { departure_station_id, arrival_station_id, departure_date } = req.query;

    if (!departure_station_id || !arrival_station_id || !departure_date) {
        return res.status(400).json({ message: 'Missing required parameters' });
    }

    // 构建查询条件
    let query = `
        SELECT * FROM trains
        WHERE departure_station_id = ?
        AND arrival_station_id = ?
        AND departure_time >= ?
        ORDER BY departure_time;
    `;

    // 这里将 departure_date 格式化为能与数据库中的时间对比的日期格式
    const formattedDate = `${departure_date} 00:00:00`;

    // 执行查询
    db.all(query, [departure_station_id, arrival_station_id, formattedDate], (err, rows) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err.message });
        }

        // 如果没有找到符合条件的火车
        if (rows.length === 0) {
            return res.status(404).json({ message: 'No trains found for the given criteria' });
        }

        // 返回查询结果
        res.json({ trains: rows });
    });
});

module.exports = router;