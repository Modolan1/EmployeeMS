import mysql from 'mysql2'

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "employeems",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
})

const promisePool = pool.promise()

pool.on('error', function(err) {
    console.log('Database error:', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') {
        console.error('Database connection was closed.')
    }
    if(err.code === 'ER_CON_COUNT_ERROR') {
        console.error('Database has too many connections.')
    }
    if(err.code === 'ECONNREFUSED') {
        console.error('Database connection was refused.')
    }
    if(err.code === 'ECONNRESET') {
        console.error('Database connection was reset.')
    }
})

export { promisePool }
export default pool