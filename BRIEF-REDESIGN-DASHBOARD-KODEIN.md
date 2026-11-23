# Brief AI — Perombakan Dashboard Laporan Kerja Bulanan KODEIN

## 1. Peran dan tujuan

Kamu adalah product designer dan full-stack engineer. Bantu rombak website laporan kerja bulanan untuk tim Branding & Marketing KODEIN menjadi dashboard internal yang minimalis, jelas, cepat dipakai, dan mudah dipahami orang yang tidak berlatar teknis.

Website acuan yang sedang berjalan: https://kodein-laporan-kerja-bulanan.alertchalk2.chatgpt.site/
Identitas sekolah: https://kodein.sch.id/

Tujuan utama: pertahankan kemampuan pencatatan dan pelaporan yang masih berguna, rapikan alur yang membingungkan, dan gabungkan data engagement, log konten, serta Leads Ads menjadi ringkasan KPI pekanan yang bisa ditelusuri sampai rinciannya. Jangan sekadar mengganti warna atau membuat mockup. Pertama pahami implementasi dan data yang sudah ada, lalu buat perubahan yang fungsional.

## 2. Bedakan fakta saat ini dari permintaan perubahan

### Yang terlihat di website saat ditinjau

- Header bertuliskan KODEIN · Branding & Marketing dan “Laporan kerja bulanan”.
- Ada periode laporan bulanan, PIC, arsip, tombol contoh laporan, Ekspor CSV, Cetak/PDF, dan Simpan laporan.
- Kartu ringkasan menampilkan produksi selesai, publikasi dibanding target, capaian produksi, dan engagement rate.
- Navigasi laporan saat ini terdiri dari empat bagian:
  1. **A · KPI pekanan** — tabel Pekan, Periode, Target, Diproduksi, Diposting, Capaian, Selisih, Status laporan, dan Aksi. Screenshot November 2026 menampilkan Pekan 1–6 dengan target 5 per pekan dan total target 30. Pekan pertama dan terakhir dapat berupa pekan parsial di batas bulan.
  2. **B · Engagement** — tabel Instagram, Facebook, TikTok, YouTube, dan TOTAL; kolom Organik, Iklan, Total impressions, Like, Comment, Share, Save, Repost, Total interaksi, ER, Target KPI, Status, dan Aksi. Target yang ditampilkan adalah ER 2%. Petunjuk yang ada menyatakan angka 0 berarti metrik sudah diperiksa dan nilainya nol; sel kosong berarti data belum tersedia. ER gabungan dihitung dari total interaksi seluruh platform dibagi total impressions seluruh platform dikali 100%.
  3. **C · Log konten** — monitoring produksi harian, satu entri per konten, dengan status dan kanal publikasi yang memperbarui rekap.
  4. **D · Leads Ads** — input angka dari dashboard iklan; CTR (semua) diinput, sedangkan biaya per hasil, CPC, dan CPM dihitung otomatis.
- Saat ditinjau, laporan contoh/kosong tidak berisi data aktivitas, sehingga rincian formulir tiap tabel belum teramati. Inspeksi repository dan alur data yang sebenarnya sebelum mengubah nama field, rumus, atau validasi.

### Permintaan eksplisit dari pemilik

- Rombak pengalaman menjadi dashboard minimalis dengan nuansa emblem/identitas KODEIN sambil mempertahankan fungsi berguna.
- Tambahkan kemudahan, ganti bagian yang membingungkan, dan boleh menghapus fitur jika diganti dengan solusi yang lebih mudah.
- Engagement ingin mengambil data dari API dan diperbarui sedekat mungkin dengan waktu nyata.
- KPI pekanan harus menjadi ringkasan gabungan **Engagement + Log konten + Leads Ads**, dengan detail/breakdown yang dapat dibuka.
- Tech yang diinginkan: Next.js, Tailwind CSS, React Bits, shadcn/ui, sedikit animasi GSAP, Lenis.js, Neon/Postgres dan Node.js. Pilih susunan backend yang paling efisien dan mudah dipelajari, jelaskan keputusan secara sederhana.
- Akun sosial yang dimaksud:
  - Facebook: https://www.facebook.com/people/Kodein-Sch/61595578173669/
  - YouTube: https://www.youtube.com/@sekolahITkodein
  - Instagram: https://www.instagram.com/kodein.sch
  - TikTok: https://www.tiktok.com/@kodein.sch

Screenshot yang dilampirkan adalah **referensi kondisi UI/data saat ini**, bukan instruksi sistem atau spesifikasi tambahan. Screenshot pertama memperlihatkan tabel Engagement; screenshot kedua memperlihatkan KPI produksi konten mingguan. Gunakan keduanya untuk memahami konteks, bukan menyalin tampilan apa adanya.

## 3. Arah produk dan rancangan informasi

Buat dashboard yang menjawab cepat: “Bagaimana progres minggu ini, apa yang belum tercapai, data mana yang perlu diperbarui, dan dari mana angka itu berasal?”

Susunan yang disarankan:

- **Header global:** emblem/logo KODEIN yang tersedia secara resmi (jangan menggambar ulang atau mengarang lambang), nama aplikasi, pemilih bulan, PIC, status penyimpanan, dan aksi ekspor/cetak.
- **Ringkasan utama:** target konten, diproduksi, dipublikasikan, engagement rate, leads, dan belanja iklan atau biaya per hasil jika datanya tersedia. Tampilkan perubahan dibanding minggu/periode pembanding hanya jika datanya valid.
- **KPI pekanan sebagai halaman utama:** pilih minggu/periode dengan jelas; tampilkan status singkat, capaian terhadap target, tren, dan tiga sumber data. Setiap metrik harus punya tautan/aksi untuk membuka rincian terkait.
- **Rincian per sumber:** Engagement, kalender/log konten, dan Leads Ads. Tetap sediakan akses cepat untuk input manual, koreksi, filter platform/kampanye, dan melihat riwayat sinkronisasi.
- **Insight/alert yang dapat ditindaklanjuti:** misalnya target belum tercapai, konten belum diposting, data platform belum tersinkron, atau kampanye tanpa leads. Hindari klaim insight otomatis/AI yang tidak memiliki dasar data.
- **Riwayat bulanan:** arsip dan perbandingan periode tetap mudah ditemukan. Pertahankan ekspor CSV dan cetak/PDF jika alur ini masih berfungsi; sederhanakan letaknya, jangan hilangkan tanpa pengganti.

### KPI pekanan gabungan

Ringkasan per pekan harus merangkum tiga kelompok berikut:

1. **Konten:** jumlah dibuat dan diposting dari Log konten, capaian terhadap target konten mingguan, serta daftar konten yang membentuk angka tersebut.
2. **Engagement:** impressions dan interaksi (serta ER) pada rentang pekan yang sama, per platform dan total; tampilkan sumber dan waktu pembaruan data.
3. **Leads Ads:** leads/hasil, spend, CTR, CPC, CPM, dan biaya per hasil jika sumber kampanye menyediakan metrik tersebut; tampilkan pemisahan kampanye dan sumber data.

Sediakan tampilan ringkas untuk scan cepat dan panel/tabel detail untuk audit. Jangan menjumlahkan rasio seperti CTR, ER, atau CPC secara langsung; hitung ulang dari pembilang/penyebut yang sesuai atau tampilkan agregasi berbobot yang diberi label. Jangan campur metrik organik, iklan sosial, dan leads tanpa label sumber. Tetapkan aturan pembagian data ke pekan berdasarkan tanggal aktivitas, zona waktu Asia/Jakarta, serta rentang tanggal yang konsisten. Jika definisi target KPI gabungan belum ada, pertahankan target produksi yang diketahui dan usulkan konfigurasi target per kelompok; jangan mengarang target atau formula skor tunggal.

## 4. UX dan visual

- Gunakan Bahasa Indonesia yang lugas dan konsisten. Label seperti “Belum ada data”, “Belum tersinkron”, “Terakhir diperbarui”, “Perlu diperiksa”, dan “Gagal diperbarui” harus punya arti berbeda.
- Ganti tabel sangat lebar dengan kartu metrik, grafik sederhana, tabel responsif, filter, dan detail per baris. Di desktop tabel boleh padat namun mudah dipindai; di ponsel gunakan kartu/daftar yang tidak memerlukan scroll horizontal berlebihan.
- Bedakan **nol terverifikasi** dari **belum ada data** dan **gagal sinkron** di UI, ekspor, dan perhitungan agregat.
- Gunakan palet dan tipografi yang mengambil petunjuk dari identitas resmi KODEIN. Situs sekolah memosisikan KODEIN sebagai Sekolah Developer Indonesia, dengan fokus IT/digital, coding, IoT, multimedia, karakter, dan Qur’an. Jadikan nuansa teknologi dan pendidikan ini aksen visual yang rapi; dashboard tetap terasa profesional dan tenang, bukan halaman promosi sekolah.
- Referensi Dribbble adalah inspirasi arah kualitas dashboard analytics: hierarki kartu dan insight dari Shopeers, disiplin visual dashboard data dari Stakent, dan keterbacaan analitik/admin dari Logip. Jangan menyalin komposisi, merek, aset, atau detail desainnya secara langsung.
- Gunakan shadcn/ui untuk komponen dasar yang konsisten. Gunakan React Bits dan GSAP hanya untuk detail kecil yang membantu orientasi/umpan balik, bukan animasi dekoratif terus-menerus. Hormati `prefers-reduced-motion`.
- Lenis.js bersifat opsional. Pakai hanya bila benar-benar memperbaiki pengalaman scroll; pastikan tabel, modal, keyboard, fokus, dan touch/scroll mobile tetap normal.
- Sediakan loading skeleton, empty state yang menjelaskan langkah berikut, error/retry, konfirmasi untuk aksi destruktif, validasi input, state tersimpan/belum tersimpan, dan desain aksesibel (kontras, label, fokus keyboard).

## 5. API sosial, sinkronisasi, dan arti “realtime”

Bangun lapisan integrasi per platform di backend, bukan memanggil API sosial langsung dari browser. Token, client secret, dan refresh token wajib berada di sisi server. Sediakan halaman Pengaturan Integrasi dengan status terhubung, izin yang dibutuhkan, akun tujuan, waktu sinkron terakhir, masa berlaku/otorisasi bila tersedia, error terakhir, tombol Sinkronkan sekarang, dan jalur input manual.

- Rencanakan integrasi Meta untuk Instagram Professional dan Facebook Page/Insights, dengan OAuth dan izin yang diperlukan. Akses metrik milik Page/akun memerlukan hak yang sesuai; akses aplikasi tertentu dapat memerlukan Advanced Access/App Review.
- Rencanakan YouTube Data API untuk statistik publik yang tersedia dan YouTube Analytics API untuk laporan pemilik kanal yang membutuhkan OAuth/otorisasi kanal. Jangan mengasumsikan username publik cukup untuk seluruh analytics.
- Rencanakan TikTok Login Kit/Display API dan scope yang disetujui untuk akun resmi. Token dan refresh token hanya di server.
- Pemetaan metrik berbeda di setiap API. Buat tabel mapping internal (metrik sumber → metrik dashboard), dokumentasikan definisi dan granularitasnya, dan tampilkan “tidak didukung” ketika provider tidak memberikan metrik seperti save/repost/organic-vs-paid. Jangan mengisi dengan tebakan.
- Desain sinkronisasi bertahap: sinkron manual, sinkron terjadwal di backend, penyimpanan snapshot/hasil terakhir, retry/backoff untuk rate limit, idempotensi, pencatatan error, indikator data stale, dan perbandingan terhadap data manual. Tetapkan interval setelah batas API dan kebutuhan operasional diketahui.
- “Realtime” harus didefinisikan jujur: UI dapat berubah langsung saat database menerima pembaruan; data dari jejaring sosial hanya secepat API masing-masing mengizinkan dan dapat memiliki jeda. Tampilkan waktu sumber data, bukan lencana realtime palsu. Neon Realtime dapat dievaluasi untuk live query DB jika tersedia di proyek, tetapi tidak membuat API Instagram/Facebook/YouTube/TikTok mengirim data instan.
- Data yang tidak bisa diambil otomatis harus tetap bisa dicatat manual, dengan penanda `manual` atau `API`, waktu sumber, dan siapa yang mengubahnya. Hindari overwrite input manual tanpa aturan konflik dan audit.

## 6. Stack yang diminta dan rekomendasi awal

Gunakan Next.js (App Router) + TypeScript, Tailwind CSS, shadcn/ui, Node.js server runtime, dan Neon Postgres. Jadikan backend Next.js Route Handlers/server-side functions sebagai satu aplikasi agar deployment dan pembelajaran lebih sederhana. Gunakan Neon serverless driver/SDK yang sesuai dengan deployment dan pola query; pertimbangkan Drizzle ORM untuk skema dan query SQL yang relatif mudah dibaca. Jangan sekaligus menambah banyak lapisan yang tidak diperlukan. Jika perlu proses sinkron terjadwal atau antrean, pilih layanan job yang cocok dengan host deployment dan dokumentasikan alurnya.

Jangan pernah mengekspos `DATABASE_URL`, OAuth secret, access/refresh token, atau kunci API di bundle frontend. Validasi input server-side, batasi akses endpoint, dan gunakan migrasi database. Untuk live updates internal, evaluasi Neon Realtime beta bila kompatibel; sediakan fallback polling/refetch terkontrol atau SSE bila perlu. Jelaskan trade-off dengan bahasa sederhana.

## 7. Model data minimum yang perlu dievaluasi

Sesuaikan dengan skema yang sudah ada sebelum migrasi. Secara konseptual, pisahkan:

- laporan bulanan dan PIC;
- target KPI serta definisi target;
- entri konten (tanggal dibuat, tanggal diposting, platform/kanal, status, judul/tautan, campaign/content ID bila ada);
- akun sosial yang terhubung dan status integrasinya;
- snapshot metrik per akun/konten/platform/periode dengan sumber dan waktu pengambilan;
- campaign iklan serta metrik leads/spend/impressions/clicks/results;
- audit perubahan manual dan hasil sinkronisasi.

Simpan angka mentah yang diterima beserta identitas sumber, rentang waktu, timestamp, dan satuan. Hitung agregat KPI dengan aturan konsisten di server atau fungsi domain bersama.

## 8. Kriteria selesai

- Fungsi pencatatan, ringkasan bulanan, arsip, ekspor, dan cetak yang masih digunakan tetap bekerja atau diganti dengan alur yang lebih sederhana dan setara.
- KPI pekanan merangkum data konten, engagement, dan leads ads; setiap angka dapat dibuka untuk melihat rincian dan sumbernya.
- Data kosong, nol, stale, gagal sinkron, dan manual dibedakan dengan jelas.
- Semua platform yang diminta memiliki status koneksi dan strategi fallback. Integrasi tidak mengaku sudah live jika belum ada credential, izin, atau persetujuan aplikasi.
- Rumus ER/CTR/CPC/CPM/biaya per hasil terdokumentasi dan tidak mengagregasi rasio secara keliru.
- Dashboard mudah digunakan pada desktop dan ponsel, dengan akses keyboard dan gerakan terbatas.
- Tidak ada rahasia API di browser. Error API, token kedaluwarsa, rate limit, dan sinkron ulang punya state yang jelas.
- Sebelum implementasi, tuliskan inventaris fitur lama dan rencana perubahan/migrasi agar data lama tidak hilang.

## 9. Urutan kerja yang diminta

1. Baca repository, petunjuk proyek, skema database, dan implementasi saat ini. Bedakan fitur yang sungguh ada dengan asumsi dari screenshot.
2. Buat peta alur dan inventaris fitur: dipertahankan, disederhanakan, digabung, diganti, atau dihapus beserta alasannya.
3. Jelaskan rancangan dashboard, definisi KPI, aturan pekan, skema data, integrasi API, kebutuhan OAuth/credential, dan batas ketersediaan metrik sebelum membuat perubahan besar.
4. Implementasikan bertahap dengan komponen reusable, validasi, responsif, dan migrasi aman.
5. Dokumentasikan konfigurasi `.env.example` tanpa nilai rahasia, langkah developer setup, setup API provider, batas metrik, dan cara sinkron manual.
6. Jalankan pemeriksaan yang relevan dan laporkan hasilnya serta fitur yang masih menunggu kredensial/approval dari pemilik akun platform.

## 10. Referensi

- Dashboard saat ini: https://kodein-laporan-kerja-bulanan.alertchalk2.chatgpt.site/
- Identitas sekolah: https://kodein.sch.id/
- Shopeers: https://dribbble.com/shots/26628350-Shopeers-AI-Powered-B2B-eCommerce-Analytics-Dashboard
- Stakent: https://dribbble.com/shots/23902428-Stakent-Crypto-Dashboard
- Logip: https://dribbble.com/shots/21590789-Logip-Admin-Dashboard-Analytics-UX
- React Bits: https://reactbits.dev/get-started/index
- Neon JavaScript SDK: https://neon.com/docs/reference/javascript-sdk
- Meta Insights overview: https://developers.facebook.com/docs/insights/overview
- Meta Page Insights setup: https://developers.facebook.com/docs/insights/get-started
- YouTube Analytics reports query: https://developers.google.com/youtube/analytics/reference/reports/query
- YouTube Analytics data freshness: https://developers.google.com/youtube/analytics/data_model
- TikTok Display API setup: https://developers.tiktok.com/docs/en/display-api-get-started
- TikTok video list/available video fields: https://developers.tiktok.com/docs/en/tiktok-api-v1-video-list
- Neon Realtime overview: https://neon.com/blog/neon-now-has-realtime

## 11. Rencana implementasi bertahap agar konteks AI tetap hemat

Jalankan **satu fase pada satu waktu**. Di awal fase, baca brief ini dan catatan checkpoint terbaru saja; setelah itu baca hanya file kode yang terkait tugas fase. Jangan mengulang audit atau menyalin seluruh brief ke laporan. Jangan mulai fase berikutnya sebelum fase saat ini selesai dan hasilnya diringkas. Jika satu fase terlalu besar, pecah menjadi subfase kecil dan catat batasnya.

Setelah setiap fase, perbarui satu file ringkas bernama `AI-PHASE-STATUS.md` di root repository (buat bila belum ada) dengan maksimal:

- Fase terakhir dan status: selesai / parsial / terblokir.
- Perubahan utama dan file penting.
- Keputusan teknis baru (hanya yang belum ada di brief).
- Hal yang masih perlu kredensial, izin, atau keputusan pemilik.
- Langkah selanjutnya yang disarankan.

Batasi ringkasan akhir setiap fase menjadi poin-poin pendek. Jangan tempel ulang kode, semua log terminal, atau isi brief. Jangan menghapus atau mengganti data lama demi membuat fase terlihat selesai. Jangan mengklaim integrasi aktif tanpa koneksi provider yang benar.

### Fase 0 — Audit proyek dan peta perubahan

**Tujuan:** pahami implementasi yang ada sebelum menyentuh kode.

- Baca instruksi repository, struktur proyek, halaman dashboard, komponen, skema/migrasi database, dan alur simpan/ekspor/arsip.
- Catat perilaku yang sudah jalan, bug/ketidakjelasan, sumber data, rumus KPI aktual, teknologi yang sudah dipakai, dan risiko kehilangan data.
- Buat daftar pendek: dipertahankan, disederhanakan, digabung, diganti, atau perlu keputusan.
- Belum perlu mengimplementasikan redesign besar. Sampaikan temuan yang menentukan desain dan rencana fase berikutnya secara ringkas.

**Selesai bila:** ada peta fitur dan rencana teknis yang didasarkan pada repository, termasuk cara mempertahankan data lama.

### Fase 1 — Fondasi data dan batas domain

**Tujuan:** siapkan struktur data agar redesign dan rekap pekanan punya sumber yang konsisten.

- Tentukan skema minimal berdasarkan struktur aktual. Pertahankan kompatibilitas dengan data lama; gunakan migrasi yang aman dan dapat ditinjau.
- Pisahkan entri konten, target, data engagement, campaign/leads, laporan bulanan, dan metadata sumber/timestamp jika memang sesuai kebutuhan implementasi.
- Tetapkan definisi tanggal, timezone Asia/Jakarta, batas pekan, validasi metrik, dan status data (nilai nol, belum tersedia, stale, gagal sinkron, manual/API).
- Tulis rumus domain dan aturan agregasi sebelum membuat skor gabungan. Jangan mengarang target gabungan.
- Jangan membuat sistem role/auth yang lebih kompleks dari kebutuhan aplikasi saat ini.

**Selesai bila:** migrasi/skema dan aturan hitung bisa menjelaskan dari mana setiap angka laporan berasal tanpa menghilangkan data lama.

### Fase 2 — Pengalaman dashboard dan alur manual

**Tujuan:** buat dashboard baru yang berguna meski API sosial belum tersambung.

- Bangun shell navigasi dan ringkasan, pengalaman KPI pekanan gabungan, detail per sumber, filter/periode, serta input/edit manual yang jelas.
- Hubungkan Log konten dan Leads Ads ke ringkasan; hitung Engagement dari data yang tersimpan saat ini. Pastikan tiap angka dapat ditelusuri ke rinciannya.
- Pertahankan/sederhanakan arsip, simpan, ekspor, dan cetak berdasarkan hasil audit Fase 0.
- Tambahkan state kosong, loading, validasi, gagal simpan, dan data belum tersinkron. Jangan menampilkan data contoh seolah-olah metrik asli.
- Pastikan desktop dan ponsel; gunakan animasi hanya untuk umpan balik kecil.

**Selesai bila:** seluruh alur laporan dapat dipakai end-to-end tanpa API eksternal, dan KPI teragregasi konsisten dengan rincian sumbernya.

### Fase 3 — Kerangka integrasi dan sinkronisasi

**Tujuan:** siapkan fondasi aman untuk menghubungkan penyedia sosial dan iklan.

- Buat adapter/provider interface, pencatatan koneksi, penyimpanan snapshot, normalisasi metrik, deduplikasi/idempotensi, pencatatan error, retry/backoff, dan penanda last synced.
- Implementasikan endpoint server-side dan validasi akses. Rahasia dan token selalu di server.
- Tambahkan pengaturan koneksi, tombol sinkronisasi manual, indikator stale/error, serta aturan konflik API vs input manual.
- Jika kredensial belum tersedia, gunakan adapter tiruan hanya pada development/test dan beri label jelas. Jangan tampilkan fixture sebagai data nyata di production.
- Coba Neon Realtime bila cocok dengan versi/deployment proyek; kalau belum tersedia atau belum stabil, gunakan refresh terkontrol sebagai fallback.

**Selesai bila:** alur data provider dapat diuji tanpa rahasia terekspos dan tanpa mengubah data manual secara diam-diam.

### Fase 4 — Integrasi provider satu per satu

**Tujuan:** sambungkan akun resmi secara bertahap karena tiap platform punya OAuth, izin, metrik, dan review berbeda.

Urutan yang disarankan: **Meta (Instagram/Facebook) → YouTube → TikTok → sumber Ads tambahan bila diperlukan.** Untuk setiap provider, lakukan satu subfase tersendiri:

1. Pastikan pemilik menyediakan konfigurasi aplikasi, redirect URI, kredensial di environment aman, akses admin akun, dan persetujuan izin yang dibutuhkan.
2. Implementasikan OAuth/token refresh dan endpoint/metrik yang benar-benar disediakan provider.
3. Petakan definisi metrik, granularitas, keterlambatan, dan batas API; tampilkan metrik yang tidak didukung sebagai tidak tersedia.
4. Verifikasi sinkron, token kedaluwarsa, rate limit, revoke, retry, duplikasi, dan fallback manual.
5. Catat waktu data provider; jangan sebut “live” bila datanya hanya tersedia setelah jeda.

Jika persetujuan atau kredensial belum ada, selesaikan kode yang bisa dibuat aman dan catat setup yang harus dilakukan pemilik. Jangan mengarang token, mencoba mengakali review, atau mengubah konfigurasi akun tanpa izin.

**Selesai bila:** tiap provider yang aktif memperbarui metrik yang didukung dan UI memperlihatkan status serta freshness dengan benar; provider yang belum siap tetap berstatus belum terhubung.

### Fase 5 — Pemeriksaan akhir dan dokumentasi operasional

**Tujuan:** pastikan hasil dapat dipakai dan dilanjutkan developer lain.

- Periksa perhitungan dengan kasus kosong, nol, beberapa platform, batas pekan/bulan, serta metrik rasio.
- Periksa UI responsif, akses keyboard, reduced motion, export/print, dan pemulihan dari API/database error.
- Tinjau secret handling, validasi server, migrasi, dan log yang tidak membocorkan token.
- Perbarui README/setup lokal dan `.env.example` tanpa nilai rahasia; dokumentasikan setup provider, izin yang dibutuhkan, metrik yang tidak tersedia, interval sync, dan fallback manual.
- Laporkan pemeriksaan yang benar-benar dijalankan dan item yang masih menunggu pemilik akun.

**Selesai bila:** developer lain dapat menjalankan proyek, memahami batas integrasi, dan melihat bukti pemeriksaan tanpa memerlukan konteks percakapan sebelumnya.

### Instruksi pembuka untuk AI pelaksana

Mulai dari Fase 0 saja. Gunakan brief ini sebagai konteks produk utama. Jangan implementasikan semua fase sekaligus. Setelah menyelesaikan fase saat ini, perbarui `AI-PHASE-STATUS.md`, berikan ringkasan singkat, lalu berhenti sampai diminta melanjutkan fase berikutnya. Jika pengguna secara eksplisit meminta semua fase dijalankan dalam satu sesi, tetap kerjakan berurutan dan checkpoint setelah setiap fase; jangan mengulang pembacaan atau laporan yang sudah dibuat.
