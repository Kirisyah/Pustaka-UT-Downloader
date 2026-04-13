# Pustaka UT Downloader

Downloader berbasis **Node.js** untuk mengunduh modul **Universitas Terbuka (UT)** dari situs **Pustaka UT** menggunakan browser asli (Chrome, Edge, atau Brave).

Script ini bekerja dengan menangkap **setiap halaman (per bab / per page)** yang dibuka pada UT Reader, lalu menggabungkannya menjadi satu file PDF.

---

## ⚠️ Cara Kerja (WAJIB DIPAHAMI)

- Downloader **tidak mengunduh seluruh modul secara otomatis**
- Downloader bekerja **berdasarkan halaman yang kamu buka**
- Setiap halaman / bab yang dibuka akan disimpan satu per satu
- Setelah browser ditutup, semua halaman digabung menjadi PDF

Jika hanya membuka sebagian halaman, maka PDF juga hanya berisi bagian tersebut.

---

## 📦 Cara Install

### 1️⃣ Install Node.js
Pastikan **Node.js** sudah terinstall di komputer.

Download:
https://nodejs.org

Cek di CMD / Git Bash:
```bash
node -v
npm -v
````

Jika versi muncul, berarti Node.js sudah siap.

***

### 2️⃣ Download Project

**Cara manual (paling gampang):**

*   Klik **Code → Download ZIP** di GitHub
*   Extract ke folder bebas

Atau via git:

```bash
git clone https://github.com/Kirisyah/pustaka-ut-downloader.git
cd pustaka-ut-downloader
```

***

### 3️⃣ Install Dependency

Masuk ke folder project, lalu jalankan:

```bash
npm install puppeteer-extra puppeteer-extra-plugin-stealth images-to-pdf
```

***

### 4️⃣ Pastikan Browser Terinstall

Downloader mendukung:

*   ✅ Google Chrome
*   ✅ Microsoft Edge
*   ✅ Brave Browser

Minimal **satu browser** harus terinstall di Windows.

***

## ▶️ Cara Pakai (INTI PEMAKAIAN)

### 1️⃣ Jalankan Downloader

```bash
node downloader.js <browser> <kode_modul>
```

Contoh:

```bash
node downloader.js chrome MSIM4308
node downloader.js edge EKMA4316
node downloader.js brave MKDU4109
```

Browser yang tersedia:

*   `chrome`
*   `edge`
*   `brave`

***

### 2️⃣ Login Akun UT

*   Browser akan terbuka otomatis
*   **Login menggunakan akun UT masing‑masing**
*   Login dilakukan **manual**

***

### 3️⃣ Buka Modul

*   Setelah login, buka modul sesuai kode
*   Masuk ke **UT Reader**

***

### 4️⃣ Buka Semua Halaman / Bab Modul

✅ **INI BAGIAN PALING PENTING**

*   Buka halaman **satu per satu**
*   Lanjutkan sampai halaman terakhir modul
*   Setiap halaman yang terbuka akan otomatis tersimpan

📌 Downloader bekerja **per halaman**, bukan otomatis full buku.

***

### 5️⃣ Tutup Browser

*   Setelah semua halaman selesai dibuka
*   **Tutup browser secara manual**

***

### 6️⃣ PDF Dibuat Otomatis

Setelah browser ditutup:

*   Semua halaman digabung menjadi:

```text
<kode_modul>.pdf
```

***

### 7️⃣ Rename PDF (CMD / Git Bash)

Setelah PDF jadi, console akan menampilkan:

```text
Masukkan nama PDF baru (tanpa .pdf):
```

*   Ketik nama baru → tekan **Enter**
*   Atau langsung tekan **Enter** untuk pakai nama default

***

## 📁 Output

```text
hasil_jpg/        -> File sementara (otomatis dihapus)
<kode_modul>.pdf  -> File PDF akhir
```

***

## ⚠️ Catatan Penting

*   Downloader bekerja **per halaman / per bab**
*   Login dilakukan secara manual
*   Semakin lengkap halaman yang dibuka, semakin lengkap PDF
*   Digunakan untuk **kepentingan pribadi & akademik**
*   Hak cipta modul sepenuhnya milik **Universitas Terbuka**

#Dutzki
---

## ☕ Dukung Pengembangan (Donasi)

Jika project ini membantu kamu dalam proses belajar atau kebutuhan akademik,  
kamu bisa mendukung pengembang dengan donasi seikhlasnya 🙏

Donasi akan digunakan untuk:
- Pengembangan fitur lanjutan
- Perbaikan bug
- Maintenance project

👉 **Link Donasi:**
https://sociabuzz.com/dutzki/tribe

Terima kasih atas dukungannya ❤️
``
