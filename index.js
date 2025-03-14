const express = require('express');
const morgan = require('morgan');
const users = require('./users');

const app = express();
const PORT = 3000;

// Middleware untuk logging
app.use(morgan('dev'));

// Endpoint GET /users - Menampilkan semua users
app.get('/users', (req, res) => {
    res.json({ status: "success", users });
});

// Endpoint GET /users/:name - Menampilkan user berdasarkan nama (case insensitive)
app.get('/users/:name', (req, res) => {
    const name = req.params.name.toLowerCase();
    const user = users.find(u => u.name.toLowerCase() === name);

    if (user) {
        res.json({ status: "success", user });
    } else {
        res.status(404).json({ status: "error", message: "User tidak ditemukan" });
    }
});

// Middleware untuk menangani 404 (resource tidak ditemukan)
app.use((req, res) => {
    res.status(404).json({ status: "error", message: "resource tidak ditemukan" });
});

// Middleware untuk menangani error server
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ status: "error", message: "terjadi kesalahan pada server" });
});

// Menjalankan server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
