const express = require('express');
const morgan = require('morgan');
const multer = require('multer');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
let users = require('./users');

const app = express();
const PORT = 3000;

// Middleware untuk logging menggunakan Morgan
app.use(morgan('dev'));

// Middleware untuk menangani CORS dengan origin tertentu
app.use(cors({ origin: 'http://127.0.0.1:5500' }));

// Middleware untuk body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware untuk akses file statik dari folder public
app.use(express.static('public'));

// Konfigurasi Multer untuk menangani file upload
const upload = multer({ dest: 'public/' });

// 1. GET: /users - Menampilkan semua users
app.get('/users', (req, res) => {
    res.json({ status: "success", users });
});

// 2. GET: /users/:name - Menampilkan user berdasarkan nama (case insensitive)
app.get('/users/:name', (req, res) => {
    const name = req.params.name.toLowerCase();
    const user = users.find(u => u.name.toLowerCase() === name);

    if (user) {
        res.json({ status: "success", user });
    } else {
        res.status(404).json({ status: "error", message: "User tidak ditemukan" });
    }
});

// 3. POST: /users - Menambahkan user baru
app.post('/users', (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ status: "error", message: "Nama harus diisi" });
    }

    const newUser = { id: users.length + 1, name };
    users.push(newUser);

    res.json({ status: "success", user: newUser });
});

// 4. GET: /download - Mendownload file dari folder assets
app.get('/download', (req, res) => {
    const filePath = path.join(__dirname, 'assets', 'example.jpg'); // Sesuaikan nama file
    if (fs.existsSync(filePath)) {
        res.download(filePath);
    } else {
        res.status(404).json({ status: "error", message: "File tidak ditemukan" });
    }
});

// 5. POST: /upload - Mengunggah file gambar ke folder public
app.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ status: "error", message: "File harus diunggah" });
    }

    res.json({ status: "success", message: "File berhasil diunggah", file: req.file });
});

// 6. PUT: /users/:name - Mengupdate data user
app.put('/users/:name', (req, res) => {
    const name = req.params.name.toLowerCase();
    const { newName } = req.body;

    if (!newName) {
        return res.status(400).json({ status: "error", message: "Nama baru harus diisi" });
    }

    const userIndex = users.findIndex(u => u.name.toLowerCase() === name);
    if (userIndex === -1) {
        return res.status(404).json({ status: "error", message: "User tidak ditemukan" });
    }

    users[userIndex].name = newName;
    res.json({ status: "success", user: users[userIndex] });
});

// 7. DELETE: /users/:name - Menghapus user berdasarkan nama
app.delete('/users/:name', (req, res) => {
    const name = req.params.name.toLowerCase();
    const userIndex = users.findIndex(u => u.name.toLowerCase() === name);

    if (userIndex === -1) {
        return res.status(404).json({ status: "error", message: "User tidak ditemukan" });
    }

    users.splice(userIndex, 1);
    res.json({ status: "success", message: "User berhasil dihapus" });
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
