# ElectroCalc ⚡

Aplikasi kalkulator teknik modern untuk mahasiswa teknik elektro, instrumentasi, automasi, dan elektronika. Dibangun menggunakan Next.js (App Router), Tailwind CSS v4, dan Framer Motion.

## Fitur
- 📱 Responsive Mobile First
- 🎨 Modern UI & Dark Mode Default
- 🔌 Offline Support (PWA)
- 🧮 Standard Calculator
- ⚡ Ohm's Law Calculator
- 🔋 Power Calculator
- 🚥 Resistor Calculator (Series & Parallel)
- 🔄 Unit Converter
- 📜 History & Settings
- 🚀 Siap untuk TWA/Capacitor (Play Store)

## Struktur Folder

- `src/app`: Konfigurasi routing Next.js App Router (Halaman Utama, Kalkulator, History, dll)
- `src/components/ui`: Komponen UI reusable (Card, Button)
- `src/components/layout`: Komponen layout dasar (BottomNav)
- `src/hooks`: Custom hooks (useHistory, dll)
- `src/firebase`: Konfigurasi Firebase (Firestore & Auth)
- `src/utils`: Utility functions (cn.ts)

## Cara Instalasi & Menjalankan

1. Clone atau download repositori ini.
2. Buka terminal di folder project `electro-calc`.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Jalankan development server:
   ```bash
   npm run dev
   ```
5. Buka `http://localhost:3000` di browser.

## Konfigurasi Firebase

Buka file `src/firebase/config.ts` dan pastikan Anda memiliki `.env.local` yang berisi:
```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## Setup PWA (Progressive Web App)

Aplikasi ini menggunakan `@ducanh2912/next-pwa`.
Untuk memastikan PWA berjalan dengan baik:
1. Ganti icon di folder `public/icons` dengan logo aplikasi Anda (`icon-192x192.png` dan `icon-512x512.png`).
2. Konfigurasi `manifest.json` di dalam folder `public/`.
3. Build project untuk menguji service worker:
   ```bash
   npm run build
   npm run start
   ```

## Cara Build APK (Play Store) via Capacitor

Aplikasi ini dirancang sebagai SPA PWA yang dapat dibungkus menggunakan Capacitor untuk Play Store.

1. Install Capacitor CLI & Android Core:
   ```bash
   npm install @capacitor/core @capacitor/android
   npm install -D @capacitor/cli
   ```
2. Inisialisasi Capacitor:
   ```bash
   npx cap init ElectroCalc com.electrocalc.app --web-dir out
   ```
3. Update `next.config.ts` untuk support static export (jika ingin full static):
   Ubah konfigurasi menjadi:
   ```typescript
   const nextConfig = {
     output: 'export',
     // ...
   };
   ```
4. Build Next.js project:
   ```bash
   npm run build
   ```
5. Tambahkan platform Android:
   ```bash
   npx cap add android
   ```
6. Sinkronisasi aset Next.js ke Android project:
   ```bash
   npx cap sync
   ```
7. Buka Android Studio untuk build APK / AAB:
   ```bash
   npx cap open android
   ```
   Di Android Studio, pilih **Build > Generate Signed Bundle / APK** untuk diunggah ke Google Play Console.

## Deployment / Web Hosting

Untuk web, Anda bisa langsung deploy ke Vercel atau Firebase Hosting.
```bash
npx vercel
```
atau
```bash
firebase deploy --only hosting
```
