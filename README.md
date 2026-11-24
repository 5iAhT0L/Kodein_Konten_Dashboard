# KODEIN — Sistem Laporan Kerja Bulanan Branding & Marketing

Aplikasi dashboard modern untuk pelaporan kinerja bulanan tim **Branding & Marketing KODEIN (Sekolah Developer Indonesia)**. Dirancang khusus untuk memantau produksi konten, performa keterlibatan (*Engagement Rate*) lintas platform media sosial resmi, serta efektivitas belanja iklan (*Leads Ads*) pendukung Penerimaan Murid Baru (PMB).

---

## 📌 Sekilas Tentang KODEIN

- **Institusi:** KODEIN (Sekolah Developer Indonesia) — Lembaga pendidikan berasrama berfokus pada teknologi, coding, multimedia, serta pembinaan karakter.
- **Situs Resmi:** [kodein.sch.id](https://kodein.sch.id/)
- **Kanal Media Sosial Resmi:**
  - **Instagram:** `@kodein.sch`
  - **Facebook:** `Kodein-Sch`
  - **YouTube:** `@sekolahITkodein`
  - **TikTok:** `@kodein.sch`
  - **Meta Ads:** Kampanye PMB Berkelanjutan

---

## 🚀 Fitur Unggulan

1. **Unified Weekly View (Rekap Pekanan Terpadu):**
   - Menyatukan 3 pilar operasional: Target Produksi/Publikasi Konten, Kontribusi Engagement Media Sosial, dan Performa Leads Ads PMB.
   - Dilengkapi modal drilldown per pekan dengan tab audit menyeluruh.

2. **Weighted Engagement Rate (ER) Multi-Platform:**
   - Menghitung ER riil berbobot lintas 4 platform (Instagram, Facebook, TikTok, YouTube).
   - Membedakan status data secara akurat: *Tercapai*, *Di bawah target*, *Belum ada data*, *Belum lengkap*, dan *Tanpa impressions*.

3. **Monitoring Produksi & Log Konten Harian:**
   - Pencatatan format, tahapan, status produksi (*Selesai* / *Dalam proses*), serta tanggal tayang (*Tayang*, *Terjadwal*, *Internal*).
   - Quick Filter status chips, pencarian instan (shortcut `/` atau `Ctrl+K`), dan tautan bukti postingan.

4. **Monitoring Leads Ads PMB:**
   - Pelacakan belanja iklan, klik tautan, jangkauan, impresi, dan perolehan leads.
   - Perhitungan otomatis metrik efisiensi: Biaya per Hasil (CPL), CPC, CPM, dan CTR dengan proteksi *zero-division*.

5. **Interaktivitas UI/UX Modern (React Bits & shadcn):**
   - **Spotlight Cards:** Efek radial glow cursor-tracking pada kartu KPI.
   - **Animated Numbers:** Efek count-up bertransisi halus saat angka berubah.
   - **Sistem Dialog & Notifikasi Elegan:** Menggantikan dialog bawaan browser yang kaku (`window.confirm()`) dengan modal konfirmasi animasi dan Toast interaktif.
   - **Floating Unsaved Bar & Keyboard Shortcuts:** Pintasan `Ctrl+S` untuk simpan, `Ctrl+P` untuk cetak PDF, dan indikator perubahan belum disimpan yang responsif.

6. **Ekspor CSV Aman & Layout Siap Cetak (PDF):**
   - Ekspor CSV berstandar UTF-8 BOM dengan sanitasi proteksi injeksi formula spreadsheet (`=, +, -, @, \t, \r`).
   - Format cetak formal A4/F4 otomatis bersih dari elemen navigasi browser.

7. **Dual-Layer Data Persistence:**
   - Mendukung PostgreSQL modern via **Neon Serverless** & **Drizzle ORM**.
   - *Resilient Fallback*: Otomatis menyimpan ke file lokal `.data/reports/*.json` jika koneksi database belum dikonfigurasi, sehingga aplikasi dapat berjalan 100% secara offline.

---

## 📐 Formula Domain & Aturan Kalkulasi

### 1. Weighted Engagement Rate (ER)
Engagement Rate bulanan dihitung secara berbobot (*weighted*), **bukan** dengan merata-ratakan persentase antar platform:

$$\text{Weighted ER} = \frac{\sum \text{Total Interaksi (Like + Comment + Share + Save + Repost)}}{\sum \text{Total Impresi (Organik + Iklan)}} \times 100\%$$

- **Target KPI Bulanan:** Default $\ge 2.0\%$ (dapat disesuaikan di antarmuka).
- **Semantik Nilai:**
  - `0`: Menandakan metrik telah diverifikasi dan memang bernilai nol.
  - `null` (sel kosong): Menandakan data belum tersedia atau integrasi API belum dihubungkan.

### 2. Metrik Efisiensi Iklan (Leads Ads)
- **Biaya per Hasil:** $\text{Spend} \div \text{Leads}$ *(mengembalikan `null` jika leads = 0)*
- **CPC (Cost per Click):** $\text{Spend} \div \text{Clicks}$ *(mengembalikan `null` jika klik = 0)*
- **CPM (Cost per Mille):** $(\text{Spend} \div \text{Impressions}) \times 1000$ *(mengembalikan `null` jika impresi = 0)*
- **CTR (Click-Through Rate):** $(\text{Clicks} \div \text{Impressions}) \times 100\%$

---

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router + Turbopack)
- **Bahasa:** TypeScript
- **Styling & UI:** Tailwind CSS v4, Lucide Icons, React Bits UI Concepts
- **Validasi Skema:** Zod
- **Database & ORM:** Drizzle ORM, `@neondatabase/serverless` (PostgreSQL)
- **Local Fallback:** Node.js File System (`.data/reports/*.json`)

---

## 💻 Panduan Instalasi & Menjalankan Lokal

### 1. Prasyarat Sistem
- **Node.js:** Versi 18.17+ atau 20+ (Proyek diverifikasi pada Node v24.18.0)
- **NPM:** Versi 9+ atau 10+

### 2. Kloning & Pemasangan Dependensi
```bash
# Masuk ke direktori proyek
cd Project_Magang

# Pasang dependensi
npm install
```

### 3. Konfigurasi Variabel Lingkungan (.env)
Salin berkas template lingkungan:
```bash
cp .env.example .env.local
```

Buka `.env.local` dan sesuaikan nilainya:
```env
# Database Neon PostgreSQL (Opsional - Jika kosong, aplikasi menggunakan fallback file lokal)
DATABASE_URL=postgresql://username:password@ep-sample-pooler.region.neon.tech/neondb?sslmode=require

# Kredensial Meta Graph API (Instagram & Facebook)
META_APP_ID=
META_APP_SECRET=
META_PAGE_ACCESS_TOKEN=
META_PAGE_ID=
META_IG_BUSINESS_ACCOUNT_ID=

# Kredensial YouTube Data API v3
YOUTUBE_API_KEY=
YOUTUBE_CHANNEL_ID=

# Kredensial TikTok Marketing API
TIKTOK_APP_ID=
TIKTOK_APP_SECRET=
TIKTOK_ACCESS_TOKEN=

# Kredensial Meta Marketing API (Ads)
META_ADS_ACCOUNT_ID=
META_ADS_ACCESS_TOKEN=
```

### 4. Menjalankan Server Pengembangan
```bash
npm run dev
```
Buka peramban di [http://localhost:3000](http://localhost:3000).

### 5. Membangun untuk Produksi
```bash
npm run build
npm start
```

---

## 🔌 Panduan Integrasi Akun & Scope OAuth

Sistem menyediakan antarmuka modal **Integrasi API** di sudut kanan atas untuk mengontrol sinkronisasi metrik media sosial dan iklan secara berkala:

| Penyedia | Lingkup OAuth (*Scopes*) | Metrik yang Disinkronkan | Tindakan Fallback Manual |
|---|---|---|---|
| **Meta Graph API (Instagram)** | `instagram_basic`, `pages_show_list`, `pages_read_engagement` | Impresi postingan, Like, Komentar, Save, Share | Klik tombol "Ubah" pada kartu Instagram di tab Engagement |
| **Meta Graph API (Facebook)** | `pages_show_list`, `pages_read_engagement` | Jangkauan halaman, Reaksi, Komentar, Share | Klik tombol "Ubah" pada kartu Facebook di tab Engagement |
| **YouTube Data API v3** | `https://www.googleapis.com/auth/youtube.readonly` | Viewers / Impresi video, Like, Komentar | Masukkan metrik YouTube Studio secara manual |
| **TikTok for Business** | `user.info.basic`, `video.list` | Video Views, Like, Komentar, Share | Masukkan metrik dari TikTok Analytics |
| **Meta Ads Manager** | `ads_read`, `read_insights` | Spend, Leads PMB, Clicks, Reach, Impressions | Klik tombol "+ Tambah Campaign" di tab Leads Ads |

> [!NOTE]
> Semua rahasia client (*App Secret*, *Access Tokens*) diproses secara aman di sisi server (`src/lib/integrations/manager.ts` dan `/api/integrations`) dan **tidak pernah** diekspos ke bundel peramban client.

---

## 🧪 Pengujian & Verifikasi Kualitas

Proyek dilengkapi rangkaian pengujian unit domain independen untuk memvalidasi kepatuhan formula matematika dan keamanan ekspor data:

```bash
# Jalankan verifikasi Domain & Formula Fase 1
npx tsx src/lib/__tests__/verify-phase1.ts

# Jalankan pengujian komprehensif Fase 5 (Zero vs Null, Weighted ER, Ads Edge Cases, CSV Sanitization)
npx tsx src/lib/__tests__/verify-phase5.ts

# Verifikasi kompilasi produksi Next.js
npm run build
```

---

## 👥 Hak Cipta & Kepemilikan

- **Pengembang:** Tim Magang Branding & Marketing
- **Organisasi:** KODEIN (Sekolah Developer Indonesia)
- **Tahun Rilis:** 2026
