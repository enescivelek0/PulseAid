<div align="center">

<img src="public/icon.svg" width="88" alt="PulseAid logo">

# PulseAid

**Acil müdahale paneli — adım adım, görsel ve sesli ilk yardım**
*Emergency response panel — step-by-step visual & voice first aid*

[![Live Demo](https://img.shields.io/badge/Canlı%20Demo-pulse--aid--pearl.vercel.app-E0414A?style=for-the-badge&logo=vercel&logoColor=white)](https://pulse-aid-pearl.vercel.app/)

![Next.js](https://img.shields.io/badge/Next.js-15-000000?logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss&logoColor=white)
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
| 🖥️ | **Müdahale paneli** | Sol menü (acil durumlar), orta çalışma alanı, sağda canlı oturum paneli (mobilde çekmece) |
| 📋 | **Oturum yönetimi** | Geçen süre, ilerleme yüzdesi, adım kontrol listesi; sayfa yenilense bile korunur |
| 🕒 | **Olay günlüğü & rapor** | Her adım, zamanlayıcı ve arama zaman damgasıyla kaydedilir; rapor kopyalanır / paylaşılır (konum linkiyle) |
| ⚡ | **Hızlı CPR** | Ana sayfadan tek dokunuşla doğrudan kalp masajı adımlarına geçiş |
| 🧭 | **Karar ağacı** | 4 acil durum kategorisi → durumu netleştiren tek soru → adım adım müdahale |
| 🫀 | **CPR metronomu** | Web Audio API ile dakikada 105 vuruş; görsel nabız ışığı + isteğe bağlı ses |
| ⏱️ | **Zamanlayıcı** | Yanıkta 10–20 dk soğutma için ilerleme çubuklu geri sayım, bitince ses + titreşim |
| 🔊 | **Sesli asistan** | Web Speech API ile adımları Türkçe / İngilizce okur |
| 📍 | **GPS konumu** | Koordinatları gösterir, dokununca panoya kopyalar (112'ye konum bildirmek için) |
| 📞 | **Tek dokunuşla arama** | Her ekranda sabit acil arama butonu (TR: 112, EN: 911) |
| 🔆 | **Ekran açık kalır** | Talimat ekranında Screen Wake Lock API ile ekran kararmaz |
| 📴 | **Çevrimdışı** | Service Worker + Web App Manifest; ana ekrana eklenebilir |
| 🔗 | **Paylaşılabilir URL** | Her senaryonun kendi adresi var: `/case/burns/heat` |
| ⌨️ | **Klavye kısayolları** | ← / → ile adımlar arasında geçiş |
| 🌐 | **İki dil** | Türkçe ve İngilizce, anlık geçiş (çalışan zamanlayıcı korunur) |
| 📱 | **Responsive & erişilebilir** | Mobil öncelikli tasarım, klavye odak halkaları, `prefers-reduced-motion` desteği |

### 🛠️ Teknolojiler

- **Next.js 15** (App Router, statik üretim / SSG) + **React 19** + **TypeScript**
- **Tailwind CSS 3** · `next/font` ile Manrope
- **Web API'leri:** Web Audio, Web Speech, Geolocation, Screen Wake Lock, Clipboard, Web Share, Vibration, Service Worker
- **Vercel** — hosting & her push'ta otomatik deploy

### 🚀 Kurulum

```bash
git clone https://github.com/enescivelek0/PulseAid.git
cd PulseAid
npm install
npm run dev       # http://localhost:8080
npm run build     # production build
npm start         # build'i yerelde çalıştır
```

### 📁 Proje Yapısı

```
PulseAid/
├── app/
│   ├── layout.tsx                    # Metadata, font, Provider + AppShell
│   ├── page.tsx                      # Kontrol paneli (ana sayfa)
│   ├── case/[caseId]/page.tsx        # Karar sorusu
│   ├── case/[caseId]/[choice]/page.tsx  # Müdahale ekranı
│   └── globals.css                   # Tailwind + animasyonlar
├── components/
│   ├── AppProvider.tsx   # Dil, oturum (localStorage), GPS, çevrimiçi durumu
│   ├── AppShell.tsx      # Sol menü, üst bar, oturum paneli / çekmece, acil arama
│   ├── SessionPanel.tsx  # Süre, ilerleme, kontrol listesi, olay günlüğü, rapor
│   ├── HomeView.tsx · DecisionView.tsx · ActionView.tsx
│   └── GeoChip.tsx · Icons.tsx
├── lib/
│   ├── data.js           # TR/EN ilk yardım içerikleri (karar ağacı ve adımlar)
│   ├── content.ts        # Tipler ve içerik yardımcıları
│   ├── i18n.ts           # Arayüz metinleri
│   └── visuals.js        # Kategori ikonları ve adım animasyonları (SVG)
└── public/               # sw.js, manifest.webmanifest, icon.svg
```

### ➕ Yeni bir acil durum eklemek

`lib/data.js` içinde hem `tr` hem `en` altına aynı anahtarla bir `cases` girdisi ekleyin:

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

**PulseAid** is an install-free, offline-capable emergency response panel (Next.js PWA) that guides bystanders through first aid for
bleeding, choking, burns and cardiac arrest. Each emergency starts with one clarifying question and
then shows large, distance-readable steps with animations, a CPR metronome (105 BPM), countdown
timers, voice read-out, GPS coordinates and a one-tap emergency call button. A live session panel tracks
elapsed time, step checklist and a timestamped event log that can be copied or shared as a report for paramedics.

**Live:** https://pulse-aid-pearl.vercel.app/

```bash
npm install && npm run dev
```

> ⚠️ PulseAid is an informational guide and does not replace professional medical care.
> In an emergency, call your local emergency number first.

---

## 📝 Değişiklik Günlüğü

### v3.0 — Next.js müdahale paneli
- Vite + vanilla JS → **Next.js 15 + React 19 + TypeScript**, tüm sayfalar statik üretiliyor
- Panel arayüzü: sol menü, orta çalışma alanı, sağda canlı **müdahale oturumu** paneli
- Oturum yönetimi: süre, ilerleme, adım kontrol listesi, zaman damgalı olay günlüğü, rapor kopyala / paylaş
- Yeni ana sayfa: hero, 112 ve **Hızlı CPR** butonları, renk kodlu kategori kartları, "nasıl çalışır" bölümü
- Her senaryoya ayrı URL, klavye kısayolları, mobilde talimat önce gelecek şekilde düzen

### v2.0

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
