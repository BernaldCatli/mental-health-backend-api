const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    // Change 3306 to 14391 here
    port: process.env.DB_PORT || 14391, 
    ssl: { rejectUnauthorized: true }
});

app.post('/api/mood', (req, res) => {
    const { name, mood } = req.body;
    
    // Simple AI Logic
    let ai_response = `I understand you're feeling ${mood}, ${name}. `;
    if (mood.toLowerCase().includes('sad')) ai_response += "Try to take a walk or talk to a friend.";
    else if (mood.toLowerCase().includes('happy')) ai_response += "That's great! Keep that positive energy.";
    else ai_response += "Thank you for sharing your thoughts with me.";

    const sql = "INSERT INTO mood_entries (name, mood, ai_response) VALUES (?, ?, ?)";
    db.query(sql, [name, mood, ai_response], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ ai_response });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));