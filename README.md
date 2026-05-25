<div align="center">

# ⚡ SALSABILA | سَلْسَبِيلًا

### *Next Generation Islamic Dashboard*

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PWA](https://img.shields.io/badge/PWA-Ready-blueviolet)](https://web.dev/progressive-web-apps/)
[![API](https://img.shields.io/badge/API-MyQuran%20v3-cyan)](https://api.myquran.com/v3/doc)
[![Made with JavaScript](https://img.shields.io/badge/Made%20with-JavaScript-f7df1e)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

> *"Where spirituality meets futuristic technology"*

[🌐 Live Demo](#) • [📦 Install PWA](#) • [📖 Documentation](#) • [🐛 Report Bug](#)

</div>

---

## ✨ Preview

<div align="center">


</div>

---

## 📱 Tentang SALSABILA

**SALSABILA** adalah dashboard Islami futuristik yang menggabungkan kebutuhan spiritual umat Muslim dengan estetika cyberpunk modern. Dibangun sebagai **Progressive Web App (PWA)** , SALSABILA dapat diinstall di homescreen smartphone maupun desktop.

> Nama "Salsabila" diambil dari bahasa Arab (سَلْسَبِيلًا) yang berarti "mata air di surga" — sebuah sumber air yang mengalir jernih dan menyegarkan.

---

## 🎯 Fitur Unggulan

| Fitur | Status | Deskripsi |
|-------|--------|------------|
| 🕌 **Jadwal Sholat** | ✅ Live | 8 waktu sholat dengan countdown realtime |
| 🔔 **Adzan & Iqamah** | ✅ Auto | Putar adzan otomatis dengan efek visual alert |
| 📖 **Al-Qur'an Digital** | ✅ Complete | 114 surah + terjemahan + tafsir + audio murottal |
| 📿 **Asmaul Husna** | ✅ 99 Names | 99 nama Allah lengkap dengan arti |
| 📅 **Kalender Hijriah** | ✅ Dual | Masehi & Hijriah dengan converter tanggal |
| 🔢 **Dzikir Counter** | ✅ With Vibration | Counter dzikir dengan efek getaran |
| 🧭 **Kompas Kiblat** | ✅ 3D | Arah kiblat akurat dengan efek 3D tilt |
| 🌙 **Tema Gelap/Terang** | ✅ Auto | Dark mode cyberpunk & Light mode clean |
| 📲 **PWA Installable** | ✅ Yes | Install ke homescreen seperti aplikasi native |
| 🔔 **Push Notification** | ✅ Real-time | Pengingat sholat 10 menit sebelum waktu |
| 📍 **Deteksi Lokasi** | ✅ GPS | Otomatis deteksi kota dan jadwal sholat |

---

## 🛠️ Teknologi

| Kategori | Teknologi |
|----------|-----------|
| **Frontend** | HTML5, CSS3, JavaScript (Vanilla) |
| **Fonts** | Orbitron, Barlow, Amiri |
| **Icons** | Font Awesome 6 |
| **API** | MyQuran v3, AlAdhan, Al-Quran Cloud, Open-Meteo |
| **PWA** | Service Worker, Manifest.json |
| **Storage** | LocalStorage |
| **Vibration API** | Haptic feedback untuk dzikir |

---

## 📦 Instalasi

```bash
# Clone repository
git clone https://github.com/gumilar19/salsabila.git

# Masuk ke folder
cd salsabila

# Jalankan dengan local server
python -m http.server 8080

# Buka di browser
http://localhost:8080

```
📁 Struktur Proyek

```
salsabila/
├── index.html              # Halaman utama
├── manifest.json           # PWA manifest
├── sw.js                   # Service Worker
├── css/
│   └── style.css           # Master stylesheet
├── js/
│   ├── main.js             # Entry point
│   ├── prayer.js           # Jadwal sholat + adzan
│   ├── quran.js            # Al-Qur'an + tafsir + audio
│   ├── asma.js             # Asmaul Husna 99
│   ├── kalender.js         # Kalender Hijriah
│   ├── dzikir.js           # Dzikir counter
│   ├── qibla.js            # Kompas kiblat
│   ├── theme.js            # Dark/light mode
│   └── pwa.js              # PWA & notification
└── assets/
    └── (icons)

```
## 👨‍💻 Developer

<div>
  
| | |
|---|---|
| **Nama** | Gumilar Utamas |
| **Panggilan** | Gumitama |
| **Email** | [gumitamaa@gmail.com](mailto:gumitamaa@gmail.com) |
| **Lokasi** | Gumitama, Padalarang, Jawa Barat, Indonesia |
| **GitHub** | [@gumilar19](https://github.com/gumilar19) |
| **Telegram** | [@gumitama](https://t.me/GumilarUtamas) |

</div>

---

## 🤝 Kontribusi

Kontribusi, issue, dan feature request sangat diterima!

```bash
# Fork repository
# Clone fork Anda
git clone https://github.com/username-anda/salsabila.git

# Buat branch baru
git checkout -b fitur-keren

# Commit perubahan
git commit -m "Add feature"

# Push ke branch
git push origin fitur-keren

# Buat Pull Request

```
## 📄 Lisensi

Proyek ini dilisensikan di bawah **MIT License** - silakan lihat file [LICENSE](LICENSE) untuk detail lebih lanjut.



## 🙏 Credits & Apresiasi

Terima kasih yang sebesar-besarnya kepada:

| Pihak | Kontribusi |
|-------|------------|
| **Allah SWT** | Atas segala nikmat dan kemudahan |
| **Kementerian Agama RI** | Sumber data jadwal sholat resmi Indonesia |
| **AlAdhan Team** | API kalender Hijriah & audio adzan |
| **Al-Quran Cloud** | API Qur'an, terjemahan, dan tafsir |
| **MyQuran API** | Data jadwal sholat Indonesia |
| **Open-Meteo** | API cuaca real-time gratis |
| **Font Awesome** | Icon library keren |
| **Google Fonts** | Font Orbitron, Barlow, Amiri |
| **GitHub** | Platform hosting repository |
| **VS Code** | Editor kode yang luar biasa |
| **Semua Kontributor** | Yang telah membantu menguji dan memberi masukan |



## ⭐ Dukung Proyek Ini

Jika Anda merasa terbantu dengan **SALSABILA**, dukung proyek ini dengan cara:

<div>

| Cara Dukungan | Aksi |
|---------------|------|
| ⭐ **Star Repository** | Klik tombol ★ di pojok kanan atas |
| 🍴 **Fork Repository** | Kembangkan dan buat versi Anda sendiri |
| 🐛 **Laporkan Issue** | [Buka Issue Baru](https://github.com/gumilar19/salsabila/issues) |
| 💡 **Kirim Saran** | Pull Request atau diskusi di Issues |
| 📢 **Share ke Teman** | Bagikan ke keluarga dan teman |


</div>

### Kenapa Perlu Dukungan Anda?

- 🚀 **Pengembangan Berkelanjutan** – Membantu saya terus mengembangkan fitur baru
- 🔧 **Maintenance** – Memastikan API tetap terupdate dan bug cepat diperbaiki
- ☁️ **Hosting** – Untuk live demo dan testing environment
- 📚 **Dokumentasi** – Membuat tutorial dan panduan penggunaan



## 📞 Kontak & Dukungan

Ada pertanyaan, saran, atau ingin berkolaborasi? Hubungi saya:

<div>
  
| Platform | Akta | Link |
|----------|------|------|
| 📧 **Email** | gumitamaa@gmail.com | [Kirim Email](mailto:gumitamaa@gmail.com) |
| 💬 **Telegram** | @gumitama | [Chat di Telegram](https://t.me/GumilarUtamas) |
| 🐙 **GitHub** | @gumilar19 | [GitHub Profile](https://github.com/gumilar19) |


</div>

### Jam Aktif

Saya biasanya online pada jam:

- 🕐 **Senin - Jumat**: 09:00 - 17:00 WIB
- 🕐 **Sabtu - Minggu**: 09:00 - 22:00 WIB

> ⚡ **Respons Cepat**: Untuk pertanyaan teknis atau bug report, lebih baik buka **Issue** di GitHub agar terdokumentasi dengan baik.



## 🤝 Ingin Berkontribusi?

Kontribusi selalu diterima! Berikut cara berkontribusi:

```bash
# 1. Fork repository
# 2. Clone fork Anda
git clone https://github.com/username-anda/salsabila.git

# 3. Buat branch baru untuk fitur/bugfix
git checkout -b fitur-keren

# 4. Lakukan perubahan dan commit
git add .
git commit -m "✨ Menambahkan fitur keren"

# 5. Push ke branch Anda
git push origin fitur-keren

# 6. Buat Pull Request di GitHub

```
<div align="center">
Made with ❤️ by Gumilar Utamas
"SALSABILA – Embracing blessings in the digital age."

https://img.shields.io/github/stars/gumilar19/salsabila?style=social

</div>

  
