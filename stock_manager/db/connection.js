const mariadb = require('mariadb');
const config = {
    host: '127.0.0.1',
    user: 'mariadb_user',
    password: '110402',
    database: 'stockdb',
    connectionLimit: 10
}
const pool = mariadb.createPool(config);
module.exports = pool;