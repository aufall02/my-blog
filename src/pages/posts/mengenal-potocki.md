---
layout: ../../layouts/MainLayout.astro
title: "Mengenal Potocki: File Drop Super Ringan dan Aman"
date: "2026-06-05"
description: "Potocki adalah layanan file drop self-hosted yang minimalis, aman dengan enkripsi AES-256-CBC, dan bisa jalan di VPS gratisan paling murah sekalipun."
keywords: ["potocki", "file drop", "self-hosted", "enkripsi aes-256", "file sharing", "golang", "nodejs", "sqlite"]
---

Pernah butuh cara cepat dan aman buat kirim file tanpa ribet? Nah, kali ini aku mau share tentang project terbaruku bernama **Potocki**.

Potocki adalah layanan *file drop* mandiri (*self-hosted*) yang didesain sangat minimalis. Saking ringannya, layanan ini bisa jalan lancar jaya di VPS gratisan paling murah (seperti AWS EC2 *free-tier*) yang sisa RAM-nya tinggal ~50MB doang saat *idle*.

## Kenapa Namanya Potocki?

Bagi kalian yang suka anime, mungkin namanya nggak asing. Yap, nama ini diambil dari karakter di anime *Orb: On the Movements of the Earth* (*Chi. — Chikyuu no Undou ni Tsuite*). Sedikit kutipan dari sana:

> "10% dari hasil kompresi akan diberikan kepada Potocki."

## Apa yang Bikin Potocki Spesial?

Ada tiga hal utama yang jadi fokus Potocki: **Keamanan (Encrypted), Ukuran (Compressed), dan Sementara (Temporary).**

1. **Aman dengan Enkripsi AES-256-CBC:** File yang kamu upload bakal dienkripsi *sebelum* disimpan di server.
2. **Hemat Kuota dengan xz Compression:** Semua file dikompres dengan algoritma `xz` agar ukurannya jauh lebih kecil. Cocok banget buat ngirit *bandwidth* VPS.
3. **Download Anti-Lemot dari Sisi Server:** Server cuma bertugas ngirim file terenkripsi yang udah dikompres. Nah, untuk proses *decrypt* (buka sandi) dan *decompress* (buka kompresi)-nya itu dilakukan langsung di komputer si penerima pakai **Go Client** (ukurannya cuma 4.7MB lho). Jadi server nggak bakal kewalahan.
4. **Auto-Hapus (Expiry):** File nggak akan numpuk menuh-menuhin *storage*. Semua file akan otomatis dihapus dalam waktu 7 hari, atau kalau kuota *bandwidth*-nya udah habis.

## Fitur Keren Lainnya

- Ada **Web UI** yang *clean* dan modern.
- Bisa upload via **CLI (cURL)** buat yang suka kerja dari terminal.
- Ada fitur **Live Stats** buat mantau jumlah upload, download, dan file yang aktif.
- **Rate Limited:** Aman dari *spam* berkat proteksi per-IP.

Kalau kamu penasaran dan pengen coba nge-host Potocki di server kamu sendiri, cara *install*-nya cukup gampang kok, tinggal modal Node.js dan SQLite aja.

Kira-kira begitulah sekilas tentang Potocki. Simple, aman, dan pastinya nggak bikin server jebol!
