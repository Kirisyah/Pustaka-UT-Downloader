# Pustaka UT Downloader

Downloader berbasis **Node.js** untuk mengunduh modul **Universitas Terbuka (UT)** dari situs **Pustaka UT**.  
Script ini bekerja dengan menangkap **setiap halaman (per bab / per page)** yang dibuka pada UT Reader, lalu menggabungkannya menjadi satu file PDF.

---

## ⚠️ Cara Kerja Singkat (PENTING)

- Downloader **TIDAK otomatis membuka semua halaman**
- Downloader bekerja **berdasarkan halaman yang KAMU buka**
- Setiap halaman / bab yang dibuka akan ditangkap satu per satu
- Setelah browser ditutup, semua halaman digabung menjadi PDF

---

## ▶️ Cara Pakai (INTINYA)

### 1️⃣ Jalankan Perintah
```bash
node downloader.js <browser> <kode_modul>
````

Contoh:

```bash
node downloader.js chrome MSIM4308
```

Browser yang didukung:

*   `chrome`
*   `edge`
*   `brave`

***

### 2️⃣ Login ke Pustaka UT

*   Browser akan terbuka otomatis
*   **Login menggunakan akun UT masing‑masing**
*   Login dilakukan **manual**

***

### 3️⃣ Buka Modul

*   Setelah login, buka modul sesuai kode
*   Masuk ke **UT Reader**

***

### 4️⃣ Buka Semua Page / Bab Modul

✅ **Ini bagian PALING PENTING**

*   Buka halaman **satu per satu**
*   Scroll & lanjutkan sampai **halaman terakhir modul**
*   Setiap halaman yang terbuka akan otomatis tersimpan

📌 Jika hanya buka sebagian halaman, PDF juga hanya berisi bagian itu.

***

### 5️⃣ Tutup Browser

*   Setelah semua halaman selesai dibuka
*   **Tutup browser secara manual**

***

### 6️⃣ PDF Dibuat Otomatis

*   Semua halaman akan digabung menjadi:

```text
<kode_modul>.pdf
```

***

### 7️⃣ Rename PDF (via CMD / Git Bash)

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
*   Login dilakukan manual
*   Semakin lengkap halaman yang dibuka, semakin lengkap PDF
*   Digunakan untuk **kepentingan pribadi & akademik**
*   Hak cipta modul sepenuhnya milik **Universitas Terbuka**

***
