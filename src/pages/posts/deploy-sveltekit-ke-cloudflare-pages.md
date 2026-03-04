---
layout: ../../layouts/MainLayout.astro
title: "Deploy SvelteKit to Cloudflare Pages"
date: "2026-03-04" 
description: "Panduan langkah demi langkah untuk men-deploy aplikasi SvelteKit ke Cloudflare Pages, mulai dari konfigurasi project, integrasi dengan GitHub, hingga memastikan build berjalan optimal di edge network Cloudflare."
---
[Cloudflare Pages](https://pages.cloudflare.com/) adalah platform hosting modern untuk website dan aplikasi frontend yang dibangun di atas jaringan edge milik Cloudflare. Platform ini dirancang untuk memudahkan developer melakukan deployment aplikasi web secara cepat, otomatis, dan scalable tanpa perlu mengelola server secara manual.

Dengan Cloudflare Pages, aplikasi dapat didistribusikan langsung melalui jaringan global Cloudflare yang memiliki ratusan data center di seluruh dunia. Hal ini memungkinkan website memiliki latency yang lebih rendah, performa lebih cepat, serta keamanan bawaan seperti DDoS protection dan SSL otomatis.

Cloudflare Pages juga mendukung workflow Git-based deployment, yang berarti setiap perubahan kode yang di-push ke repository seperti GitHub atau GitLab dapat secara otomatis memicu proses build dan deployment. Hal ini membuat proses pengembangan menjadi lebih efisien karena developer dapat fokus pada penulisan kode tanpa harus mengurus proses deploy secara manual.

Selain itu, Cloudflare Pages terintegrasi dengan [Cloudflare Workers](https://workers.cloudflare.com/) sehingga memungkinkan aplikasi frontend berinteraksi dengan logic server-side yang berjalan di edge. Kombinasi ini sangat cocok untuk framework modern seperti [SvelteKit](https://svelte.dev/docs/kit/introduction), yang mendukung rendering di edge environment.

---

## Mengapa Menggunakan Cloudflare Pages untuk SvelteKit

SvelteKit merupakan framework yang fleksibel dan mendukung berbagai target deployment. Dengan menggunakan [adapter Cloudflare](https://svelte.dev/docs/kit/adapter-cloudflare), aplikasi SvelteKit dapat dijalankan langsung di infrastruktur edge Cloudflare.

Beberapa keuntungan menggunakan Cloudflare Pages untuk deployment SvelteKit antara lain:

* Deployment cepat dengan integrasi langsung ke Git repository
* Performa tinggi karena dijalankan di edge network
* SSL otomatis tanpa konfigurasi tambahan
* Proteksi keamanan bawaan dari Cloudflare
* Integrasi dengan Cloudflare Workers untuk server-side logic

---

## Langkah Deploy SvelteKit ke Cloudflare Pages

### 1. Install Adapter Cloudflare

Pertama, install adapter Cloudflare yang akan digunakan oleh SvelteKit untuk menyesuaikan proses build dengan lingkungan Cloudflare.

```bash
npm install -D @sveltejs/adapter-cloudflare
```

---

### 2. Konfigurasi Adapter di SvelteKit

Buka file konfigurasi `svelte.config.js`, kemudian ubah adapter menjadi adapter Cloudflare.

```javascript
import adapter from '@sveltejs/adapter-cloudflare';

const config = {
  kit: {
    adapter: adapter()
  }
};

export default config;
```

Adapter ini akan mengubah output build agar kompatibel dengan platform Cloudflare Pages dan Workers.

---

### 3. Build Project

Setelah konfigurasi selesai, jalankan proses build untuk memastikan project dapat dikompilasi dengan benar.

```bash
npm run build
```

Proses ini akan menghasilkan output build yang siap dideploy ke Cloudflare Pages.

---

### 4. Push Project ke GitHub

Cloudflare Pages bekerja dengan workflow berbasis Git. Oleh karena itu, project perlu berada di repository Git seperti GitHub.

```bash
git init
git add .
git commit -m "initial commit"
git push origin main
```

---

### 5. Hubungkan Repository ke Cloudflare Pages

Masuk ke dashboard Cloudflare, kemudian:

1. Buka menu **Workers & Pages**
2. Pilih **Create Application**
3. Pilih **Pages**
4. Hubungkan repository GitHub yang berisi project SvelteKit

Cloudflare akan secara otomatis mendeteksi framework dan menjalankan proses build.

---

### 6. Konfigurasi Build Settings

Biasanya konfigurasi build yang digunakan adalah:

**Build command**

```bash
npm run build
```

**Build output directory**

```bash
.build
```

Setelah konfigurasi selesai, Cloudflare akan menjalankan proses build dan deployment secara otomatis.

---

### 7. Deployment Selesai

Jika proses build berhasil, Cloudflare Pages akan memberikan URL domain seperti:

```
https://project-name.pages.dev
```

Setiap perubahan yang di-push ke repository akan otomatis memicu deployment baru.

---

## Penutup

Dengan menggunakan Cloudflare Pages, proses deployment aplikasi SvelteKit menjadi jauh lebih sederhana dan efisien. Integrasi dengan Git repository serta dukungan edge network membuat aplikasi dapat dijalankan dengan performa tinggi tanpa perlu mengelola infrastruktur server secara langsung.

Pendekatan ini sangat cocok untuk developer yang ingin membangun aplikasi modern dengan workflow yang cepat, scalable, dan terintegrasi langsung dengan ekosistem Cloudflare.
