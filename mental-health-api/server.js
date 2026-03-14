const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ✅ UPDATED CORS: Specifically allow your GitHub Pages site
app.use(cors({
    origin: ['https://bernaldcatli.github.io', 'http://localhost:5173'],
    methods: ['GET', 'POST'],
    credentials: true
}));

app.use(express.json());

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 14391, 
    ssl: { 
        rejectUnauthorized: false 
    },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test the connection immediately
db.getConnection((err, connection) => {
    if (err) {
        console.error("❌ Database connection failed:", err.message);
    } else {
        console.log("✅ Successfully connected to Aiven MySQL!");
        connection.release();
    }
});

app.post('/api/mood', (req, res) => {
    const { name, mood } = req.body;
    
    // AI Logic
    let ai_response = `I understand you're feeling ${mood}, ${name}. `;
    if (mood.toLowerCase().includes('sad')) ai_response += "Try to take a walk or talk to a friend.";
    else if (mood.toLowerCase().includes('happy')) ai_response += "That's great! Keep that positive energy.";
    else ai_response += "Thank you for sharing your thoughts with me.";

    const sql = "INSERT INTO mood_entries (name, mood, ai_response) VALUES (?, ?, ?)";
    db.query(sql, [name, mood, ai_response], (err) => {
        if (err) {
            console.error("Insert error:", err.message);
            return res.status(500).json({ error: "Database error. Check your table structure." });
        }
        res.json({ ai_response });
    });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));