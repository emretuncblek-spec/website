const express = require('express');
const path = require('path');
const app = express();

// 1. ADIM: Tek satırda CSS, JS ve tüm dosyaları otomatik dışarı aç
app.use(express.static(__dirname));

// 2. ADIM: Sayfa Yönlendirmeleri (Routing)
// Ana sayfa (index.html)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Profil Sayfası (profile.html)
app.get('/profile', (req, res) => {
    res.sendFile(path.join(__dirname, 'profile.html'));
});

// Odaklanma Sayfası (focus.html)
app.get('/focus', (req, res) => {
    res.sendFile(path.join(__dirname, 'focus.html'));
});

// PDF Okuyucu Sayfası (pdfreader.html)
app.get('/pdfreader', (req, res) => {
    res.sendFile(path.join(__dirname, 'pdfreader.html'));
});

// 3. ADIM: Port Ayarı (Railway için zorunlu)
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Sunucu ${PORT} portunda tıkır tıkır çalışıyor!`);
});
