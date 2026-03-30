---
layout: ../../layouts/MainLayout.astro
title: "Boilerplate landing page astroJs - SGDS Web Component "
date: "2026-03-30"
description: "Hello word"
keywords: ["hello world", "tes blog", "astro blog", "markdown"]
---
Perjalanan ini dimulai dari kebutuhan yang sangat praktis: membuat landing page layanan digital yang cepat, konsisten, dan mudah dirawat dalam jangka panjang. Di tahap awal, tantangan utamanya adalah menyatukan dua hal yang sering berjalan sendiri-sendiri, yaitu kecepatan pengembangan dan konsistensi desain antarmuka.

Karena itu, dipilih kombinasi **Astro + SGDS**:

- **Astro** dipilih karena performanya baik untuk halaman konten dan landing page, serta struktur proyeknya bersih.
- **SGDS (Singapore Government Design System)** dipilih karena komponen dan fondasi UI-nya sudah matang, aksesibel, dan konsisten.

Kenapa kombinasi ini terasa cocok:

1. Pengembangan lebih cepat karena tidak mulai dari nol untuk komponen UI.
2. Tampilan lebih seragam antar section dan antar halaman.
3. Lebih mudah scaling ke fitur baru karena pola komponen sudah jelas.
4. Perawatan kode jadi lebih ringan untuk tim dalam jangka panjang.

Efek positif yang sudah terasa:

- Landing page terlihat lebih rapi dan terstruktur.
- Hero section bisa dibuat lebih kuat secara visual tanpa mengorbankan keterbacaan.
- Section konten lebih jelas batasnya, jadi pengalaman baca pengguna lebih nyaman.
- Dokumentasi setup jadi lebih mudah diikuti anggota tim baru.

## Setup Project (Astro + SGDS)

1. Install dependency:

```sh
npm install
```

2. Jalankan development server:

```sh
npm run dev
```

3. Build production:

```sh
npm run build
```

4. Preview hasil build:

```sh
npm run preview
```

## Setup ke Cloudflare Workers

Proyek ini sudah menggunakan adapter Cloudflare pada konfigurasi Astro.

### 1) Pastikan adapter Cloudflare aktif di konfigurasi

Di `astro.config.mjs`, pastikan ada:

- `import cloudflare from '@astrojs/cloudflare';`
- `adapter: cloudflare()`

### 2) Pastikan file `wrangler.jsonc` sudah sesuai

Parameter penting:

- `main`: `@astrojs/cloudflare/entrypoints/server`
- `assets.directory`: `./dist`
- `assets.binding`: `ASSETS`
- `compatibility_date`: gunakan tanggal yang valid

### 3) Login ke Cloudflare

```sh
npx wrangler login
```

### 4) Build project

```sh
npm run build
```

### 5) Deploy ke Workers

```sh
npx wrangler deploy
```

### 6) (Opsional) Cek lokal dengan Wrangler

```sh
npx wrangler dev
```

## Catatan

Jika `npx astro add cloudflare` gagal, biasanya karena versi Node atau kondisi environment saat ini. Dalam kasus itu, pastikan dependency adapter sudah ada di `package.json`, konfigurasi `astro.config.mjs` benar, lalu deploy langsung via Wrangler.

[astro-sdgs](https://astro-sgds.ngecode.id/)