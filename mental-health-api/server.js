const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();

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
    ssl: { rejectUnauthorized: false },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// 1. Test Connection and 2. Auto-Create Table
db.getConnection((err, connection) => {
    if (err) {
        console.error("❌ Database connection failed:", err.message);
    } else {
        console.log("✅ Successfully connected to Aiven MySQL!");
        
        const createTableQuery = `
        CREATE TABLE IF NOT EXISTS mood_entries (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            mood TEXT NOT NULL,
            ai_response TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );`;

        connection.query(createTableQuery, (queryErr) => {
            if (queryErr) console.error("❌ Table creation error:", queryErr.message);
            else console.log("✅ Table 'mood_entries' is ready!");
            connection.release();
        });
    }
});

// --- NEW VIEW DATA ROUTE ---
// Visit this URL in your browser to see all entries
app.get('/api/data', (req, res) => {
    db.query("SELECT * FROM mood_entries ORDER BY created_at DESC", (err, results) => {
        if (err) {
            console.error("Fetch error:", err.message);
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});
// ---------------------------

app.post('/api/mood', (req, res) => {
    const { name, mood } = req.body;
    
    let ai_response = `I understand you're feeling ${mood}, ${name}. `;
    if (mood.toLowerCase().includes('sad')) ai_response += "Try to take a walk or talk to a friend.";
    else if (mood.toLowerCase().includes('happy')) ai_response += "That's great! Keep that positive energy.";
    else ai_response += "Thank you for sharing your thoughts with me.";

    const sql = "INSERT INTO mood_entries (name, mood, ai_response) VALUES (?, ?, ?)";
    db.query(sql, [name, mood, ai_response], (err) => {
        if (err) {
            console.error("Insert error:", err.message);
            return res.status(500).json({ error: err.message });
        }
        res.json({ ai_response });
    });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));