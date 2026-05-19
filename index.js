// Aurelia Games - UI Test ve Etkileşim Scripti
document.addEventListener('DOMContentLoaded', () => {
    console.log('Aurelia Games UI yüklendi. Test modunda.');
    // Discord SDK'sını başlatıyoruz
    // BURAYA GİZLİ TOKEN DEĞİL, SADECE DEVELOPER PORTAL'DAKİ APPLICATION (BOT) ID YAZILIR
    const discordSdk = new Discord.DiscordSDK("1480052700652634144");

    async function setupDiscordActivity() {
        try {
            // Discord istemcisine uygulamanın hazır olduğunu bildiriyoruz
            await discordSdk.ready();
            console.log("Discord Aktivitesi başarıyla başlatıldı!");
            
            // Aktivite başarıyla açıldıktan sonra kullanıcı bilgilerini alabilirsin
            // Örn: const auth = await discordSdk.commands.authorize({ ... });
        } catch (error) {
            console.error("Discord SDK başlatılırken hata oluştu:", error);
        }
    }

    // Fonksiyonu tetikle
    setupDiscordActivity();
    // ==========================================
    
// 1. BUTON TIKLAMA VE UI TEST SİSTEMİ
// index.js dosyanın en üstündeki buton tıklama alanını bununla güncelle:
const allButtons = document.querySelectorAll('button, .nav-link, .read-more, .icon-btn');

allButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        // Hem kendi href'ine hem de eğer a etiketi ise normal href'ine bakıyoruz
        const href = button.getAttribute('href') || button.closest('a')?.getAttribute('href');
        
        // Eğer eleman veya üstündeki a etiketi gerçek bir sayfaya gidiyorsa engelleme!
        if (href && href !== '#' && !button.classList.contains('dot')) {
            return; // Tarayıcı normal şekilde sayfayı değiştirir.
        }
        
        // Sadece içi boş (#) olan veya slider dot'ı olan butonların sayfa yenilemesini engelle
        if (!button.classList.contains('dot')) {
            e.preventDefault(); 
        }
        
        let elementText = button.textContent.trim() || button.getAttribute('title') || 'İkon Butonu';
        console.log(`UI Test: "${elementText}" butonuna basıldı.`);
        
        button.style.transform = 'scale(0.96)';
        setTimeout(() => {
            button.style.transform = 'none';
        }, 100);
    });
});
    // ==========================================
    // 2. OTOMATİK VE TIKLANABİLİR SLIDER SİSTEMİ
    // ==========================================
    const slides = document.querySelectorAll(".slide");
    const dots = document.querySelectorAll(".dot");
    let currentSlide = 0;
    let slideInterval;

    // Slaytı değiştiren ana fonksiyon
    function showSlide(index) {
        // Eğer sayfada slayt veya nokta yoksa hata vermemesi için kontrol
        if (slides.length === 0 || dots.length === 0) return;

        // Aktif sınıflarını temizle
        slides.forEach(slide => slide.classList.remove("active"));
        dots.forEach(dot => dot.classList.remove("active"));

        // Yeni aktif slayt ve çizgiyi belirle
        slides[index].classList.add("active");
        dots[index].classList.add("active");
        
        currentSlide = index;
    }

    // Bir sonraki slayta geçen fonksiyon
    function nextSlide() {
        if (slides.length === 0) return;
        let next = (currentSlide + 1) % slides.length;
        showSlide(next);
    }

    // 15 saniyelik zamanlayıcıyı başlatan fonksiyon
    function startInterval() {
        clearInterval(slideInterval); // Eski zamanlayıcıyı temizle
        slideInterval = setInterval(nextSlide, 15000); // 15000 ms = 15 saniye
    }

    // Çizgilere tıklama olayı ekleme
    dots.forEach(dot => {
        dot.addEventListener("click", (e) => {
            const targetIndex = parseInt(e.target.getAttribute("data-index"));
            showSlide(targetIndex);
            startInterval(); // Kullanıcı tıkladığında 15 sn süresini sıfırla
        });
    });

    // İlk açılışta zamanlayıcıyı başlat (Eğer sayfada slayt varsa)
    if (slides.length > 0) {
        startInterval();
    }
});

// ==========================================
// ARKA PLAN RENK ANALİZİ VE DİNAMİK TEMA SİSTEMİ
// ==========================================
function analizEtVeTemaBelirle() {
    const body = document.body;
    if (!body.classList.contains('profile-body')) return;

    const bgImageStyle = window.getComputedStyle(body).backgroundImage;
    const urlMatch = bgImageStyle.match(/url\(["']?([^"']*)["']?\)/);
    
    if (urlMatch && urlMatch[1]) {
        const imgUrl = urlMatch[1];
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = imgUrl;

        img.onload = function() {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = 20;
            canvas.height = 20;
            ctx.drawImage(img, 0, 0, 20, 20);

            try {
                const imgData = ctx.getImageData(0, 0, 20, 20).data;
                let r = 0, g = 0, b = 0, count = 0;

                for (let i = 0; i < imgData.length; i += 4) {
                    r += imgData[i];
                    g += imgData[i+1];
                    b += imgData[i+2];
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
            } catch (e) {
                body.classList.add('dark-bg-theme');
            }
        };
    }
}

window.addEventListener('load', analizEtVeTemaBelirle);
