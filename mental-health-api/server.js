const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 14391, 
    ssl: { 
        rejectUnauthorized: false // Change to false for better compatibility with Render/Aiven
    },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// ADD THIS: Test the connection immediately on startup
db.getConnection((err, connection) => {
    if (err) {
        console.error("❌ Database connection failed:", err.message);
    } else {
        console.log("✅ Successfully connected to Aiven MySQL!");
        connection.release();
    }
});