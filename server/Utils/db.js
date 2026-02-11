import mysql from 'mysql'

const con = mysql.createConnection({
    host:"localhost",
    user: "root",
    password: "",
    database: "employeems"
})

con.connect(function(err){
    if(err){
        console.log("Database connection error:", err.message)
        console.log("Error code:", err.code)
        console.log("Please ensure:")
        console.log("1. MySQL server is running")
        console.log("2. Database 'employeems' exists")
        console.log("3. User 'root' has proper permissions")
    }else{
        console.log("Successfully connected to database")
    }
})

// Handle connection errors
con.on('error', function(err) {
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
})

export default con