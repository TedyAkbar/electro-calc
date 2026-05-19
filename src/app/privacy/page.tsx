import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy – ElectroCalc",
  description: "Privacy policy for ElectroCalc engineering calculator application.",
};

export default function PrivacyPolicy() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12 space-y-8 text-gray-300">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-500">Effective date: May 2026 | App: ElectroCalc</p>
      </div>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white">1. Data yang Kami Kumpulkan</h2>
        <p className="text-sm leading-relaxed">
          ElectroCalc hanya mengumpulkan data minimum yang diperlukan untuk mengoperasikan layanan:
        </p>
        <ul className="list-disc list-inside text-sm space-y-1 text-gray-400">
          <li><strong className="text-gray-300">Informasi Akun Google</strong> (opsional): nama, email, foto profil — hanya jika Anda memilih untuk login.</li>
          <li><strong className="text-gray-300">Riwayat Perhitungan</strong>: data hasil kalkulator yang Anda simpan.</li>
          <li><strong className="text-gray-300">Preferensi Aplikasi</strong>: tema, pengaturan suara, dan preferensi lokal lainnya.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white">2. Cara Kami Menggunakan Data</h2>
        <ul className="list-disc list-inside text-sm space-y-1 text-gray-400">
          <li>Menyinkronkan riwayat perhitungan antar perangkat (jika login).</li>
          <li>Menyimpan preferensi aplikasi di perangkat lokal.</li>
          <li>Kami <strong className="text-white">tidak</strong> menjual, menyewakan, atau membagikan data Anda kepada pihak ketiga.</li>
          <li>Kami <strong className="text-white">tidak</strong> menggunakan data untuk keperluan iklan.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white">3. Penyimpanan Data</h2>
        <p className="text-sm leading-relaxed">
          Data riwayat pengguna yang login disimpan secara aman di <strong className="text-white">Google Firebase Firestore</strong>
          dengan enkripsi standar industri. Data preferensi disimpan secara lokal di perangkat Anda menggunakan localStorage.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white">4. Hak Pengguna</h2>
        <ul className="list-disc list-inside text-sm space-y-1 text-gray-400">
          <li>Anda dapat menghapus riwayat perhitungan kapan saja melalui halaman History.</li>
          <li>Anda dapat logout dan mencabut akses akun Google kapan saja.</li>
          <li>Data lokal dapat dihapus dengan membersihkan cache/storage browser atau aplikasi.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white">5. Layanan Pihak Ketiga</h2>
        <p className="text-sm leading-relaxed">
          Kami menggunakan layanan berikut yang memiliki kebijakan privasi masing-masing:
        </p>
        <ul className="list-disc list-inside text-sm space-y-1 text-gray-400">
          <li><a href="https://firebase.google.com/support/privacy" className="text-cyan-400 underline" target="_blank" rel="noreferrer">Firebase (Google) — Privacy Policy</a></li>
          <li><a href="https://policies.google.com/privacy" className="text-cyan-400 underline" target="_blank" rel="noreferrer">Google Sign-In — Privacy Policy</a></li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white">6. Keamanan</h2>
        <p className="text-sm leading-relaxed">
          Kami menerapkan aturan keamanan Firestore untuk memastikan setiap pengguna hanya dapat mengakses
          data miliknya sendiri. Tidak ada pengguna lain yang dapat membaca atau mengubah data Anda.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white">7. Kontak</h2>
        <p className="text-sm leading-relaxed">
          Jika Anda memiliki pertanyaan tentang kebijakan privasi ini, silakan hubungi kami melalui:
          <br />
          <span className="text-cyan-400">Program Hibah PKKM — Universitas [Nama Universitas]</span>
        </p>
      </section>

      <footer className="border-t border-gray-800 pt-6 text-xs text-gray-600">
        <p>ElectroCalc v1.0.0 · Dikembangkan untuk mahasiswa teknik elektro, instrumentasi, automasi &amp; elektronika.</p>
      </footer>
    </div>
  );
}
