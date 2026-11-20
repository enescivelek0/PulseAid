<div align="center">

<img src="public/icon.svg" width="88" alt="PulseAid logo">

# PulseAid

**Acil durumlarda adım adım, görsel ve sesli ilk yardım rehberi**
*Step-by-step visual & voice first-aid guide for emergencies*

[![Live Demo](https://img.shields.io/badge/Canlı%20Demo-pulse--aid--pearl.vercel.app-E0414A?style=for-the-badge&logo=vercel&logoColor=white)](https://pulse-aid-pearl.vercel.app/)

![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss&logoColor=white)
![JavaScript](https://img.shields.io/badge/Vanilla_JS-ES_Modules-F7DF1E?logo=javascript&logoColor=black)
![PWA](https://img.shields.io/badge/PWA-Offline_Ready-5A0FC8?logo=pwa&logoColor=white)

### 🔗 Canlı: **https://pulse-aid-pearl.vercel.app/**

</div>

---

## 🇹🇷 Hakkında

**PulseAid**, kanama, boğulma, yanık ve kalp krizi / bilinç kaybı gibi acil durumlarda kullanıcıyı
basit sorularla doğru müdahaleye yönlendiren, adımları **büyük okunabilir metin**, **animasyon**,
**ritim metronomu** ve **sesli asistan** ile anlatan, kurulum gerektirmeyen ve **çevrimdışı çalışan**
bir web uygulamasıdır (PWA).

> ⚠️ **Uyarı:** PulseAid bir bilgilendirme rehberidir, profesyonel tıbbi yardımın yerini tutmaz.
> Acil durumda **önce 112'yi arayın.**

### ✨ Özellikler

| | Özellik | Açıklama |
|---|---|---|
| 🧭 | **Karar ağacı** | 4 acil durum kategorisi → durumu netleştiren tek soru → adım adım müdahale |
| 🫀 | **CPR metronomu** | Web Audio API ile dakikada 105 vuruş; görsel nabız ışığı + isteğe bağlı ses |
| ⏱️ | **Zamanlayıcı** | Yanıkta 10–20 dk soğutma için ilerleme çubuklu geri sayım, bitince ses + titreşim |
| 🔊 | **Sesli asistan** | Web Speech API ile adımları Türkçe / İngilizce okur |
| 📍 | **GPS konumu** | Koordinatları gösterir, dokununca panoya kopyalar (112'ye konum bildirmek için) |
| 📞 | **Tek dokunuşla arama** | Her ekranda sabit acil arama butonu (TR: 112, EN: 911) |
| 🔆 | **Ekran açık kalır** | Talimat ekranında Screen Wake Lock API ile ekran kararmaz |
| 📴 | **Çevrimdışı** | Service Worker + Web App Manifest; ana ekrana eklenebilir |
| 🔗 | **Paylaşılabilir URL** | Dil, durum ve adım URL'de tutulur: `?lang=tr&case=burns&choice=heat&step=1` |
| 🌐 | **İki dil** | Türkçe ve İngilizce, anlık geçiş (çalışan zamanlayıcı korunur) |
| 📱 | **Responsive & erişilebilir** | Mobil öncelikli tasarım, klavye odak halkaları, `prefers-reduced-motion` desteği |

### 🛠️ Teknolojiler

- **Vanilla JavaScript** (ES Modules) — framework yok, ~14 KB gzip
- **Tailwind CSS 3** (PostCSS ile derlenir, CDN yok)
- **Vite 5** — geliştirme sunucusu ve production build
- **Web API'leri:** Web Audio, Web Speech, Geolocation, Screen Wake Lock, Clipboard, Vibration, Service Worker
- **Vercel** — hosting & otomatik deploy

### 🚀 Kurulum

```bash
git clone https://github.com/enescivelek0/PulseAid.git
cd PulseAid
npm install
npm run dev       # http://localhost:8080
npm run build     # dist/ klasörüne production build
npm run preview   # build'i yerelde önizle
```

### 📁 Proje Yapısı

```
PulseAid/
├── index.html              # Uygulama kabuğu (header, footer, acil arama butonu)
├── assets/
│   ├── css/style.css       # Tailwind girişi + özel animasyonlar
│   └── js/
│       ├── app.js          # Durum yönetimi, yönlendirme, ekranlar, ses/zamanlayıcı/GPS
│       ├── data.js         # TR/EN ilk yardım içerikleri (karar ağacı ve adımlar)
│       └── visuals.js      # Kategori ikonları ve adım animasyonları (SVG)
├── public/
│   ├── sw.js               # Service Worker (çevrimdışı önbellek)
│   ├── manifest.webmanifest
│   └── icon.svg
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
└── vercel.json             # Önbellek başlıkları
```

### ➕ Yeni bir acil durum eklemek

`assets/js/data.js` içinde hem `tr` hem `en` altına aynı anahtarla bir `cases` girdisi ekleyin:

```js
my_case: {
  title: '...', icon: 'bleeding', description: '...', question: '...',
  options: {
    option_a: { label: '...', steps: [{ text: '...', animation: 'pressure-pulse', rate: 105 }] },
    option_b: { label: '...', steps: [{ text: '...', animation: 'wash-rinse', timer: 600 }] }
  }
}
```

`rate` → metronom (BPM), `timer` → saniye cinsinden geri sayım. Kullanılabilir animasyonlar `visuals.js` içindedir.

---

## 🇬🇧 About

**PulseAid** is an install-free, offline-capable PWA that guides bystanders through first aid for
bleeding, choking, burns and cardiac arrest. Each emergency starts with one clarifying question and
then shows large, distance-readable steps with animations, a CPR metronome (105 BPM), countdown
timers, voice read-out, GPS coordinates and a one-tap emergency call button.

**Live:** https://pulse-aid-pearl.vercel.app/

```bash
npm install && npm run dev
```

> ⚠️ PulseAid is an informational guide and does not replace professional medical care.
> In an emergency, call your local emergency number first.

---

## 📝 Değişiklik Günlüğü (v2.0)

- Tailwind CDN kaldırıldı → derlenmiş Tailwind (daha hızlı yükleme, konsol uyarısı yok, gerçek çevrimdışı destek)
- Service Worker yeniden yazıldı: production build'de var olmayan dosyaları önbelleğe almaya çalıştığı için kurulamıyordu; artık sayfalar için network-first, varlıklar için stale-while-revalidate
- Web App Manifest + ikon eklendi (ana ekrana eklenebilir)
- Geçersiz URL parametreleri (bilinmeyen durum, negatif / aşırı adım) güvenle doğrulanıyor
- GPS her tıklamada yeni izleyici başlatıyordu → tek izleyici; izin hatası gösterimi; koordinat kopyalama
- Dil değişimi artık çalışan zamanlayıcıyı sıfırlamıyor ve tarayıcı geçmişini kirletmiyor
- Zamanlayıcı bitince yeniden başlatılabiliyor; sıfırlama metronomu durdurmuyor
- Tanımsız CSS sınıfları (`shadow-3xl`, `bg-crimson-dark` vb.) düzeltildi
- Satır içi `onclick` yerine olay delegasyonu; `<html lang>` ve sayfa başlığı dile göre güncelleniyor
- Yeni kompakt, mobil öncelikli arayüz: adım ilerleme çubuğu, yeni toggle'lar, güvenli alan (notch) desteği
- Ekran açık kalma (Wake Lock), zamanlayıcı bitişinde titreşim, `prefers-reduced-motion` desteği
- SEO / Open Graph meta etiketleri

## 👤 Geliştirici

**Enes Civelek** — [@enescivelek0](https://github.com/enescivelek0)

## 📄 Lisans

ISC
