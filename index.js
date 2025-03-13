const express = require('express');
const users = require('./users'); // Mengimpor data users dari file users.js
const moment = require('moment-timezone');

const app = express();
const PORT = 3000;

// Route untuk home page
app.get('/', (req, res) => {
    res.send('This is the home page');
});

// Route untuk about
app.get('/about', (req, res) => {
    res.json({
        Status: 'success',
        Message: 'response success',
        Description: 'Exercise #02',
        Date: moment().tz('Asia/Jakarta').format()
    });
});

// Route untuk users
app.get('/users', (req, res) => {
    res.json(users);
});

// Menjalankan server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
