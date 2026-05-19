const express = require('express');
const path = require('path');
const app = express();

// 1. ADIM: Tüm statik dosyaları (CSS, JS, Resimler) tek satırda dışarı aç
// Bu komut sayesinde klasördeki her şey otomatik olarak tanıtılır.
app.use(express.static(__dirname));

// 2. ADIM: Sayfa Yönlendirmeleri (Routing)
// Tarayıcıya ana adresi (/) yazınca index.html'i açar
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Tarayıcıya /profile yazınca profile.html'i açar
app.get('/profile', (req, res) => {
    res.sendFile(path.join(__dirname, 'profile.html'));
});

// 3. ADIM: Port Ayarı
// Railway'in sana vereceği dinamik portu dinler, yoksa yerelde 3000'i kullanır
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Sunucu ${PORT} portu üzerinde başarıyla başlatıldı!`);
});
