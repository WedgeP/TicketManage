const knex = require('knex');

const db = knex({
    client: 'sqlite3',
    connection: {
        filename: './database.db'  // 你的SQLite数据库文件路径

    },
    useNullAsDefault: true
});

module.exports = db;