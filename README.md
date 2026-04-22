# 📘 PUSTAKA UT Downloader 

Script otomatis untuk mengunduh modul/buku dari [Pustaka UT](https://pustaka.ut.ac.id/reader/) dan menggabungkannya menjadi satu file PDF.  
**Didukung untuk browser:** Chrome, Edge, Brave.

> Versi ini dirancang untuk **satu modul → satu PDF**.

## ✨ Fitur

- Login **manual** melalui browser (aman, tidak perlu menyimpan password)
- Otomatis menekan tombol "Next" hingga halaman terakhir
- Menangkap semua gambar halaman (JPG) secara real-time
- Menggabungkan gambar menjadi PDF di **dalam folder modul**
- Menghapus file JPG setelah PDF jadi (hemat ruang)
- Bisa mengganti nama PDF sesuai keinginan
- Mendukung **headless = false** (bisa lihat proses scraping)

## 📦 Prasyarat

- [Node.js](https://nodejs.org/) (minimal versi 14)
- Browser **Chrome**, **Edge**, atau **Brave** terinstal di `C:\Program Files\...` (default)
- Koneksi internet aktif

## 🔧 Instalasi

1. Clone atau download repositori ini.
2. Buka terminal di folder proyek.
3. Install dependensi:

```bash
npm install puppeteer-extra puppeteer-extra-plugin-stealth images-to-pdf
```

> **Catatan:** `puppeteer` otomatis terinstall bersama `puppeteer-extra`.

## 🚀 Cara Penggunaan

### Metode 1 – Batch file (Mudah)

Jalankan `PUSTAKA UT DOWNLOADER.bat` (double click).  
Ikuti pertanyaan:
- Browser: `chrome` / `edge` / `brave`
- Kode modul: contoh `MKWI4202` atau `MSIM4308`

Batch file akan memanggil `node downloader.js <browser> <modul>`.

### Metode 2 – Terminal / Command Prompt

```bash
node downloader.js chrome MKWI4202
```

Parameter:
- Parameter 1: `chrome` | `edge` | `brave`
- Parameter 2: kode modul (sesuai URL Pustaka UT)

## 🧠 Alur Kerja

1. Script membuka browser (bukan headless).
2. Anda **login secara manual** ke akun UT (jika belum login).
3. Buka modul yang diinginkan (klik judul modul di dashboard).
4. Setelah halaman pertama modul **terlihat jelas**, kembali ke terminal dan tekan **Enter**.
5. Script akan:
   - Otomatis menekan tombol `Next` (panah kanan)
   - Menyimpan setiap halaman sebagai `001.jpg`, `002.jpg`, ...
   - Berhenti ketika tombol Next tidak aktif / tidak ada gambar baru
6. Setelah selesai, script mengkonversi semua JPG menjadi PDF di dalam folder `./<kode_modul>/<kode_modul>.pdf`.
7. File JPG akan dihapus.
8. Anda diminta memberi nama baru untuk PDF (atau tekan Enter untuk tetap menggunakan nama modul).

## 📁 Struktur Folder

```
proyek/
├── downloader.js
├── PUSTAKA UT DOWNLOADER.bat
├── MKWI4202/          <- folder hasil unduhan
│   ├── MKWI4202.pdf   <- PDF akhir (atau nama custom)
│   └── (file JPG sudah dihapus)
└── MSIM4308/          <- modul lain
    └── ...
```

## 🔁 Download per Bab (Workaround)

Secara default script ini mengunduh **seluruh halaman modul** menjadi satu PDF.  
Jika Anda menginginkan **satu file PDF per BAB**, ikuti cara berikut:

### Opsi A – Interupsi manual tiap bab
1. Jalankan script seperti biasa.
2. Pantau halaman – saat bab pertama selesai (biasanya ada indikator "Bab 1" atau halaman terakhir bab), segera kembali ke terminal.
3. Tekan **Ctrl+C** untuk menghentikan script.
4. Script tetap akan membuat PDF dari halaman yang sudah terunduh (sampai bab tersebut).
5. Rename PDF hasilnya menjadi `NamaModul_Bab1.pdf`.
6. Jalankan ulang script untuk modul yang sama, tapi kali ini Anda harus **scroll ke halaman pertama bab berikutnya** sebelum menekan Enter (atau klik next manual hingga bab 2 dimulai).
7. Ulangi untuk setiap bab.

> ⚠ **Catatan:** Script tidak bisa otomatis mendeteksi pergantian bab karena Pustaka UT tidak menyediakan marker khusus. Opsi ini hanya cocok untuk unduhan manual bertahap.

### Opsi B – Modifikasi script (untuk pengembang)
Anda bisa menambahkan deteksi teks "Bab" pada halaman menggunakan `page.evaluate()` lalu memisahkan PDF saat keyword tertentu muncul.  
Contoh kode (ide):

```js
const pageText = await page.evaluate(() => document.body.innerText);
if (pageText.includes('Bab 2')) {
  // panggil createAndRenamePdf() untuk bab sebelumnya, reset counter
}
```

Silakan fork dan sesuaikan dengan kebutuhan.

## 🛠 Troubleshooting

| Masalah | Solusi |
|---------|--------|
| Browser tidak ditemukan | Pastikan path di variabel `BROWSERS` sesuai dengan lokasi installasi. |
| Tombol Next tidak ditekan | Beberapa modul pakai selector berbeda. Buka DevTools (F12), cari class tombol panah kanan, lalu tambahkan ke array `nextSelectors`. |
| Gambar tidak tersimpan | Pastikan login sudah benar dan halaman modul **benar-benar tampil** sebelum tekan Enter. Coba refresh halaman. |
| PDF gagal dibuat | Install ulang `images-to-pdf`: `npm install images-to-pdf` | 
| Error `puppeteer-extra` | Jalankan `npm install` ulang, atau hapus `node_modules` lalu install lagi. |

## 📄 Lisensi

MIT – bebas digunakan, dimodifikasi, dan didistribusikan.

---

**Dibuat untuk memudahkan akses materi pembelajaran Universitas Terbuka.**  
Gunakan dengan bijak dan hormati hak cipta.

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
