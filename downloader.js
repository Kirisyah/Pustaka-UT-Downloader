const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const fs = require('fs');
const path = require('path');
const imagesToPdf = require('images-to-pdf');
const readline = require('readline');

puppeteer.use(StealthPlugin());

/* ================================
   KONFIGURASI PATH BROWSER
================================ */
const BROWSERS = {
  chrome: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  edge: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  brave: 'C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe'
};

(async () => {
  // Ambil argumen CMD
  const [, , browserArg, modul] = process.argv;

  if (!browserArg || !modul) {
    console.log('❌ Cara pakai: node mini.js <browser> <kode_modul>');
    console.log('✅ Browser: chrome | edge | brave');
    console.log('Contoh: node mini.js chrome MSIM4308');
    process.exit(1);
  }

  if (!BROWSERS[browserArg]) {
    console.log('❌ Browser tidak dikenali!');
    console.log('✅ Pilihan: chrome | edge | brave');
    process.exit(1);
  }

  console.log(`🧭 Browser dipilih: ${browserArg.toUpperCase()}`);
  console.log(`📘 Modul: ${modul}`);

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    executablePath: BROWSERS[browserArg]
  });

  const page = await browser.newPage();

  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ' +
    'AppleWebKit/537.36 (KHTML, like Gecko) ' +
    'Chrome/123.0.0.0 Safari/537.36'
  );

  await page.setExtraHTTPHeaders({
    'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
    'Referer': 'https://pustaka.ut.ac.id/reader/'
  });

  const outputDir = path.join(__dirname, 'hasil_jpg');
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

  /* ================================
     TANGKAP JPG
  ================================ */
  page.on('response', async res => {
    try {
      const url = res.url();
      const headers = res.headers();
      const type = (headers['content-type'] || '').toLowerCase();

      if (!/jpe?g/.test(type) || !url.includes('reader')) return;

      const buf = await res.buffer();
      if (buf.length < 40000) return;

      const match = url.match(/page=(\d+)/);
      const nomor = match ? match[1].padStart(3, '0') : Date.now();

      const fileName = `${modul}_halaman_${nomor}.jpg`;
      fs.writeFileSync(path.join(outputDir, fileName), buf);

      console.log('✔ Disimpan:', fileName);
    } catch (err) {
      console.error('Gagal simpan:', err);
    }
  });

  const url = `https://pustaka.ut.ac.id/reader/index.php?modul=${modul}`;
  await page.goto(url, { waitUntil: 'networkidle2' });

  console.log(`✅ Browser siap. Login lalu buka modul ${modul}`);
  console.log('📸 JPG akan tersimpan otomatis...');

  /* ================================
     SAAT BROWSER DITUTUP
  ================================ */
  browser.on('disconnected', async () => {
    try {
      let files = fs.readdirSync(outputDir)
        .filter(f => f.toLowerCase().endsWith('.jpg'))
        .map(f => path.join(outputDir, f))
        .sort();

      if (files.length === 0) {
        console.log('❌ Tidak ada JPG ditemukan.');
        return;
      }

      const defaultPdf = path.join(__dirname, `${modul}.pdf`);
      await imagesToPdf(files, defaultPdf);

      console.log('✅ PDF dibuat:', defaultPdf);

      files.forEach(f => fs.unlinkSync(f));
      console.log('🗑 Semua JPG dihapus');

      /* ================================
         RENAME PDF VIA CMD
      ================================ */
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });

      rl.question(
        '✏ Masukkan nama PDF baru (tanpa .pdf, Enter = default): ',
        newName => {
          if (newName.trim()) {
            const newPdf = path.join(__dirname, `${newName}.pdf`);
            fs.renameSync(defaultPdf, newPdf);
            console.log('✅ PDF direname jadi:', newPdf);
          } else {
            console.log('✅ Nama PDF tetap:', defaultPdf);
          }
          rl.close();
        }
      );

    } catch (err) {
      console.error('❌ Gagal proses PDF:', err);
    }
  });
})();
