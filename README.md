# 🛒 Ngekasir

Ngekasir adalah aplikasi Point of Sales (POS) atau Kasir modern berbasis web yang dirancang khusus untuk memudahkan UMKM, kedai kopi, dan warung dalam mengelola transaksi harian. Dibangun menggunakan teknologi web terkini, Ngekasir menawarkan antarmuka yang cepat, responsif, dan intuitif.

![Ngekasir Preview](https://img.shields.io/badge/Status-Active_Development-success)
![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue?logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-ORM-1B222D?logo=prisma)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)

## ✨ Fitur Utama

- **📦 Manajemen Kasir & Keranjang:** Sistem kasir yang sangat responsif untuk mencatat pesanan, menghitung subtotal, dan pajak secara otomatis.
- **💳 Pembayaran Fleksibel (QRIS Dinamis & Tunai):** 
  - **QRIS Dinamis:** Sistem secara otomatis menghasilkan QRIS baru dengan nominal yang sudah diinjeksi. Pelanggan cukup *scan* tanpa perlu repot mengetik nominal.
  - **Tunai:** Kalkulator otomatis untuk menghitung uang kembalian pelanggan.
- **📊 Dashboard Analitik:** 
  - Pantau pendapatan harian, pesanan selesai, dan pertumbuhan bisnis langsung dari *dashboard*.
  - **Chart Waktu Sibuk (Busy Time):** Analisis jam-jam paling sibuk di toko Anda.
  - **Leaderboard Menu:** Ketahui produk mana yang paling laris dan disukai pelanggan.
- **⚙️ Pengaturan Toko & Keamanan:** Atur nama toko, persentase pajak, kode QRIS Statis, dan lindungi akses aplikasi menggunakan PIN 6 digit.
- **📱 Responsif:** Desain UI/UX yang optimal dan cantik baik saat dibuka di PC, tablet, maupun layar _smartphone_.

## 🛠️ Teknologi yang Digunakan

Aplikasi ini dikembangkan menggunakan *stack* modern:
- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Bahasa:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Database:** MySQL
- **ORM:** [Prisma](https://www.prisma.io/)
- **State Management:** [Zustand](https://docs.pmnd.rs/zustand/getting-started/introduction)
- **Icons:** [Lucide React](https://lucide.dev/)

## 🚀 Cara Menjalankan di Lokal

Ikuti langkah-langkah berikut untuk menjalankan Ngekasir di mesin lokal Anda:

### 1. Kebutuhan Sistem
Pastikan Anda sudah menginstal:
- [Node.js](https://nodejs.org/en/) (Disarankan versi LTS terbaru)
- MySQL Server (XAMPP, Laragon, atau native)

### 2. Instalasi Dependensi
Clone *repository* ini (jika dari Git) atau buka foldernya di terminal, lalu jalankan:
```bash
npm install
```

### 3. Konfigurasi Environment (Database)
Buat file `.env` di *root folder* proyek Anda dan sesuaikan koneksi database MySQL Anda. Contoh:
```env
# Sesuaikan username, password, dan nama database Anda (contoh: ngekasir_db)
DATABASE_URL="mysql://root:@localhost:3306/ngekasir_db"
NEXT_PUBLIC_LOGIN_PIN="123456" # PIN default awal jika belum disetting di database
```

### 4. Setup Database (Prisma)
Jalankan perintah berikut untuk mensinkronisasi skema Prisma ke dalam MySQL Anda:
```bash
npx prisma db push
```
Lalu, *generate* Prisma Client terbaru:
```bash
npx prisma generate
```

### 5. Jalankan Server Development
```bash
npm run dev
```
Buka [http://localhost:3000](http://localhost:3000) di browser Anda untuk melihat hasilnya!

## 🔐 Keamanan
Untuk masuk ke aplikasi, Anda akan dimintai PIN.
- PIN Default: `123456`
- Anda dapat mengubah PIN ini kapan saja di halaman **Profil/Pengaturan**.

## 💡 Kontribusi & Lisensi
Proyek ini masih dalam tahap pengembangan (Active Development). Segala bentuk *feedback*, saran, atau kontribusi kode sangat diapresiasi!

---
*Dibuat dengan ❤️ untuk kemajuan UMKM.*
