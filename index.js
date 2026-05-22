/* ================================================================== */
/*  AURELIA GAMES — index.js                                          */
/*  Slider + UI Test + Dinamik Tema Sistemi                           */
/* ================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    console.log('Aurelia Games UI yüklendi.');

    // ================================================================
    // 1. BUTON TIKLAMA & UI TEST SİSTEMİ
    // ================================================================
    const allButtons = document.querySelectorAll('button, .nav-link, .read-more, .icon-btn');

    allButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            // Kendi veya üst <a> etiketinin href'ine bak
            const href = button.getAttribute('href')
                      || button.closest('a')?.getAttribute('href');

            // Gerçek bir sayfaya gidiyorsa müdahale etme
            if (href && href !== '#' && !button.classList.contains('dot')) {
                return;
            }

            // Boş (#) veya dot ise sayfa yenilemesini engelle
            if (!button.classList.contains('dot')) {
                e.preventDefault();
            }

            const elementText =
                button.textContent.trim() ||
                button.getAttribute('title') ||
                'İkon Butonu';

            console.log(`UI Test: "${elementText}" butonuna basıldı.`);

            // Küçük basım animasyonu
            button.style.transform = 'scale(0.96)';
            setTimeout(() => { button.style.transform = ''; }, 100);
        });
    });

    // ================================================================
    // 2. OTOMATİK VE TIKLANABİLİR SLIDER SİSTEMİ
    // ================================================================
    const slides = document.querySelectorAll('.slide');
    const dots   = document.querySelectorAll('.dot');

    if (slides.length === 0 || dots.length === 0) return;

    let currentSlide  = 0;
    let slideInterval = null;

    /** Belirli index'teki slayta geç */
    function showSlide(index) {
        slides.forEach(s => s.classList.remove('active'));
        dots.forEach(d => d.classList.remove('active'));
        currentSlide = (index + slides.length) % slides.length;
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }

    /** Bir sonraki slayta geç */
    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    /** 15 saniyelik otomatik geçişi (yeniden) başlat */
    function startInterval() {
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, 15000);
    }

    // Noktalara tıklanınca slayt değiştir ve sayacı sıfırla
    dots.forEach(dot => {
        dot.addEventListener('click', e => {
            const targetIndex = parseInt(e.currentTarget.getAttribute('data-index'), 10);
            showSlide(targetIndex);
            startInterval();
        });
    });

    // İlk açılışta başlat
    startInterval();
});

// ================================================================
// 3. ARKA PLAN RENK ANALİZİ & DİNAMİK TEMA SİSTEMİ
//    (Yalnızca .profile-body sayfasında çalışır)
// ================================================================
function analizEtVeTemaBelirle() {
    const body = document.body;
    if (!body.classList.contains('profile-body')) return;

    const bgImageStyle = window.getComputedStyle(body).backgroundImage;
    const urlMatch     = bgImageStyle.match(/url\(["']?([^"']*)["']?\)/);

    if (!urlMatch || !urlMatch[1]) return;

    const img      = new Image();
    img.crossOrigin = 'Anonymous';
    img.src         = urlMatch[1];

    img.onload = function () {
        const canvas = document.createElement('canvas');
        const ctx    = canvas.getContext('2d');
        canvas.width  = 20;
        canvas.height = 20;
        ctx.drawImage(img, 0, 0, 20, 20);

        try {
            const data  = ctx.getImageData(0, 0, 20, 20).data;
            let r = 0, g = 0, b = 0, count = 0;

            for (let i = 0; i < data.length; i += 4) {
                r += data[i];
                g += data[i + 1];
                b += data[i + 2];
                count++;
            }

            r = Math.floor(r / count);
            g = Math.floor(g / count);
            b = Math.floor(b / count);

            const brightness = (r * 299 + g * 587 + b * 114) / 1000;

            if (brightness > 128) {
                body.classList.remove('dark-bg-theme');
                body.classList.add('light-bg-theme');
            } else {
                body.classList.remove('light-bg-theme');
                body.classList.add('dark-bg-theme');
            }
        } catch (err) {
            // CORS veya canvas güvenlik hatası — güvenli varsayılan
            body.classList.add('dark-bg-theme');
        }
    };
}

window.addEventListener('load', analizEtVeTemaBelirle);
