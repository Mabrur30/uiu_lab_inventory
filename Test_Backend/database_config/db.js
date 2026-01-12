const mysql = require("mysql2/promise");

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "database_lab_inventory",
});

(async () => {
    try {
        const conn = await pool.getConnection();
        conn.release();
        console.log("Database connected successfully.");
    } catch (err) {
        console.error("Database connection failed:", err.message || err);
    }
})();

module.exports = pool;