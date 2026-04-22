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

// ================================
// FUNGSI BANTU
// ================================
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const randomDelay = (min, max) => delay(min + Math.random() * (max - min));

// ================================
// USER AGENT (sama seperti versi 1.0 yang berhasil)
// ================================
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36';

// ================================
// CEK TOMBOL NEXT (PANAH KANAN)
// ================================
async function hasNextButton(page) {
  const nextSelectors = ['.next-button', '.btn-next', '[aria-label="Next"]', '.right-arrow', '.flowpaper_next'];
  for (const sel of nextSelectors) {
    const btn = await page.$(sel).catch(() => null);
    if (btn) {
      const isDisabled = await page.evaluate(el => el.disabled || el.getAttribute('aria-disabled') === 'true', btn).catch(() => false);
      if (!isDisabled) return true;
    }
  }
  return false;
}

// ================================
// KLIK NEXT & TUNGGU GAMBAR BARU
// ================================
async function clickNextPage(page, lastImageCount, imageCounterObj, timeout = 10000) {
  const nextSelectors = ['.next-button', '.btn-next', '[aria-label="Next"]', '.right-arrow', '.flowpaper_next'];
  for (const sel of nextSelectors) {
    const btn = await page.$(sel);
    if (btn) {
      await btn.click();
      console.log('➡ Klik next halaman');
      const start = Date.now();
      while ((Date.now() - start) < timeout) {
        if (imageCounterObj.count > lastImageCount) return true;
        await delay(300);
      }
      return false;
    }
  }
  return false;
}

// ================================
// AUTO NEXT PAGE (LOOP SAMPAI HABIS)
// ================================
async function autoNextPage(page, imageCounterObj) {
  console.log('\n🚀 Memulai auto next page...');
  let pageCount = 0;
  let lastImageCount = imageCounterObj.count;
  let hasNext = true;
  let noChangeCounter = 0;

  while (hasNext) {
    await randomDelay(2000, 4000);
    
    const currentCount = imageCounterObj.count;
    if (currentCount > lastImageCount) {
      pageCount++;
      console.log(`  Halaman ${pageCount} (gambar ke-${currentCount})`);
      lastImageCount = currentCount;
      noChangeCounter = 0;
    } else {
      noChangeCounter++;
      if (noChangeCounter > 4) {
        console.log(`  ⚠ Tidak ada gambar baru, akhiri.`);
        break;
      }
    }

    const nextExists = await hasNextButton(page);
    if (!nextExists) {
      console.log(`  ℹ Tombol next tidak ditemukan/aktif. Selesai.`);
      break;
    }

    const clicked = await clickNextPage(page, lastImageCount, imageCounterObj, 10000);
    if (!clicked) {
      console.log(`  ⚠ Next page gagal (timeout), berhenti.`);
      break;
    }
  }
  console.log(`✅ Auto next selesai, total halaman: ${pageCount}`);
}

// ================================
// PROSES PDF DAN RENAME (PDF DISIMPAN DI DALAM FOLDER MODUL)
// ================================
async function createAndRenamePdf(outputDir, modul) {
  let files = fs.readdirSync(outputDir)
    .filter(f => f.toLowerCase().endsWith('.jpg'))
    .map(f => path.join(outputDir, f))
    .sort();

  if (files.length === 0) {
    console.log('❌ Tidak ada JPG ditemukan.');
    return;
  }

  // PDF disimpan di DALAM folder modul (outputDir)
  const defaultPdf = path.join(outputDir, `${modul}.pdf`);
  await imagesToPdf(files, defaultPdf);
  console.log('✅ PDF dibuat:', defaultPdf);

  // Hapus file JPG
  files.forEach(f => fs.unlinkSync(f));
  console.log('🗑 Semua JPG dihapus');
  console.log(`📁 Folder ${modul} sekarang berisi PDF (dan mungkin kosong setelah JPG dihapus).`);

  // Rename PDF (tetap di dalam folder modul)
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question('✏ Masukkan nama PDF baru (tanpa .pdf, Enter = default): ', (newName) => {
      if (newName.trim()) {
        const newPdf = path.join(outputDir, `${newName}.pdf`);
        fs.renameSync(defaultPdf, newPdf);
        console.log('✅ PDF direname jadi:', newPdf);
      } else {
        console.log('✅ Nama PDF tetap:', defaultPdf);
      }
      rl.close();
      resolve();
    });
  });
}

// ================================
// MAIN FUNCTION
// ================================
(async () => {
  const [, , browserArg, modul] = process.argv;

  if (!browserArg || !modul) {
    console.log('❌ Cara pakai: node downloader.js <browser> <kode_modul>');
    console.log('✅ Browser: chrome | edge | brave');
    console.log('Contoh: node downloader.js chrome MKWI4202');
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

  await page.setUserAgent(USER_AGENT);
  await page.setExtraHTTPHeaders({
    'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
    'Referer': 'https://pustaka.ut.ac.id/reader/'
  });

  // Folder output = nama modul
  const outputDir = path.join(__dirname, modul);
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  let imageCounter = 0;
  const imageCounterObj = { count: 0 };

  // Tangkap JPG
  page.on('response', async res => {
    try {
      const url = res.url();
      const headers = res.headers();
      const type = (headers['content-type'] || '').toLowerCase();
      if (!/jpe?g/.test(type) || !url.includes('reader')) return;
      const buf = await res.buffer();
      if (buf.length < 40000) return;
      imageCounter++;
      imageCounterObj.count = imageCounter;
      const fileName = `${String(imageCounter).padStart(3, '0')}.jpg`;
      fs.writeFileSync(path.join(outputDir, fileName), buf);
      console.log('✔ Disimpan:', fileName);
    } catch (err) {
      console.error('Gagal simpan:', err);
    }
  });

  const url = `https://pustaka.ut.ac.id/reader/index.php?modul=${modul}`;
  await page.goto(url, { waitUntil: 'networkidle2' });

  console.log(`✅ Browser siap. Silakan LOGIN dan buka modul ${modul} secara manual.`);
  console.log('⏳ Setelah modul terbuka (halaman pertama terlihat), tekan Enter untuk memulai auto next...');
  
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  await new Promise(resolve => {
    rl.question('Tekan Enter untuk mulai auto next...', () => {
      rl.close();
      resolve();
    });
  });

  // Jalankan auto next page
  await autoNextPage(page, imageCounterObj);

  console.log('🔄 Menutup browser...');
  await browser.close();

  // Proses PDF dan rename (PDF akan disimpan di folder modul)
  await createAndRenamePdf(outputDir, modul);

  console.log('✨ Selesai!');
  process.exit(0);
})();
