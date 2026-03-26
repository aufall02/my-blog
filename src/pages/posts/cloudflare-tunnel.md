---
layout: ../../layouts/MainLayout.astro
title: "Cloudflare Tunnel – Practical Technique"
date: "2026-03-06" 
description: "Pernah kebingungan saat klien minta lihat progres web yang masih di localhost? Ini panduan praktis Cloudflare Tunnel untuk mengekspos lokal server ke publik dengan aman."
keywords: ["cloudflare tunnel", "localhost public", "reverse proxy", "web server lokal", "networking", "deploy lokal"]
---

Pernah nggak sih kamu lagi asyik *coding* di laptop, fitur udah jalan mulus di `localhost`, terus tiba-tiba klien minta lihat progresnya saat itu juga? Dulu aku sering banget ketar-ketir. Bingung gimana caranya presentasiin web yang masih murni jalan di komputer lokalku tanpa harus ribet *deploy* dulu ke *server*. Kalau disuruh *deploy* kan lumayan makan waktu tuh, apalagi kalau lagi *rush*.

Nah, dari masalah itulah aku ketemu dengan **Cloudflare Tunnel**. *Tools* ini benar-benar jadi penyelamat! Kita bisa mengekspos aplikasi lokal kita langsung ke internet agar bisa diakses publik secara aman. Kerennya lagi, kita langsung dapet URL HTTPS otomatis, tanpa perlu pusing buka *port* di *router*. Di tulisan kali ini, aku mau *share* panduan praktisnya biar kerjaan dan presentasimu ke klien dijamin makin lancar!

---

# 1. Apa itu Cloudflare Tunnel

[Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/) adalah mekanisme untuk menghubungkan **service lokal (localhost)** ke internet melalui jaringan Cloudflare tanpa membuka port firewall.

Arsitektur dasar:

```
Internet
   ↓
Cloudflare Edge
   ↓
Cloudflare Tunnel (cloudflared)
   ↓
Service lokal (localhost)
```

Contoh:

```
https://api.example.com
        ↓
cloudflare edge
        ↓
cloudflared tunnel
        ↓
http://localhost:3000
```

Keuntungan utama:

* tidak perlu membuka port router
* SSL otomatis
* dilindungi Cloudflare
* bisa expose service lokal ke internet
* dapat digunakan sebagai reverse proxy

---

# 2. Metode Cloudflare Tunnel

Cloudflare menyediakan dua metode utama.

---

# 2.1 Token Tunnel (Quick Setup)

Metode ini menggunakan **token dari Cloudflare dashboard**.

Contoh:

```bash
cloudflared tunnel run --token <TOKEN>
```

Karakteristik:

* setup sangat cepat
* tidak membutuhkan config file
* cocok untuk testing

Kekurangan:

* sulit mengelola banyak domain
* tidak fleksibel untuk routing
* tidak cocok untuk automation atau system service

Gunakan metode ini hanya untuk **percobaan cepat**.

---

# 2.2 Named Tunnel (Recommended)

Metode ini menggunakan:

```yml
config.yml
credentials.json
```

Langkah setup:

### Login

```bash
cloudflared tunnel login
```

### Buat tunnel

```bash
cloudflared tunnel create home-server
```

### Tambahkan DNS

```bash
cloudflared tunnel route dns home-server api.example.com
```

### Jalankan tunnel

```bash
cloudflared tunnel run home-server
```

Struktur folder:

```
~/.cloudflared
 ├── cert.pem
 ├── config.yml
 └── <tunnel-id>.json
```

Metode ini **paling direkomendasikan** karena:

* stabil
* mudah di-debug
* mendukung banyak domain
* cocok untuk system service

---

# 3. Konfigurasi Dasar

Contoh `config.yml` minimal:

```yaml
tunnel: home-server
credentials-file: /home/user/.cloudflared/<tunnel-id>.json

ingress:
  - hostname: api.example.com
    service: http://localhost:3000
  - service: http_status:404
```

Routing yang terjadi:

```bash
api.example.com → localhost:3000
```

---

# 4. Reverse Proxy dengan Cloudflare Tunnel

Cloudflare Tunnel dapat digunakan sebagai reverse proxy.

Contoh:

```yaml
ingress:
  - hostname: api.example.com
    service: http://localhost:3000

  - hostname: dev.example.com
    service: http://localhost:5173

  - hostname: webhook.example.com
    service: http://localhost:4321

  - service: http_status:404
```

Routing:

```bash
api.example.com → localhost:3000
dev.example.com → localhost:5173
webhook.example.com → localhost:4321
```

Satu tunnel dapat melayani **banyak service**.

---

# 5. Path Routing

Tunnel juga mendukung routing berdasarkan path.

Contoh:

```yaml
ingress:
  - hostname: example.com
    path: /api/*
    service: http://localhost:3000

  - hostname: example.com
    path: /webhook/*
    service: http://localhost:4321

  - hostname: example.com
    service: http://localhost:5173
```

Routing:

```bash
example.com/api/* → localhost:3000
example.com/webhook/* → localhost:4321
example.com/* → localhost:5173
```

## Catatan Penting

Path routing hanya akan bekerja jika **domain utama benar-benar diarahkan ke tunnel**.

Jika domain utama masih menunjuk ke **web server lain**, maka request tidak akan pernah mencapai tunnel.

Contoh masalah:

```bash
ngecode.id → hosting server
```

Lalu tunnel dikonfigurasi:

```
ngecode.id/testing-api
```

Dalam kondisi ini:

```
browser
↓
Cloudflare
↓
hosting server
↓
404
```

Tunnel tidak akan dipanggil.

Solusi:

* arahkan domain utama ke tunnel
* atau gunakan subdomain

Contoh yang direkomendasikan:

```
api.ngecode.id
webhook.ngecode.id
dev.ngecode.id
```

---

# 6. Rename atau Mengganti Domain

Cloudflare Tunnel sebenarnya **tidak melakukan rename domain**.
Yang terjadi adalah **menambahkan hostname baru**.

Contoh sebelumnya:

```
tunnel-testing.ngecode.id
```

Lalu ingin mengganti menjadi:

```
tunnel.ngecode.id
```

Langkahnya:

### Tambahkan DNS baru (jika belum ada)

```bash
cloudflared tunnel route dns home-server tunnel.ngecode.id
```

Sekarang dua domain aktif:

```
tunnel-testing.ngecode.id
tunnel.ngecode.id
```

### Update config

Edit `config.yml`:

```yaml
ingress:
  - hostname: tunnel.ngecode.id
    service: http://localhost:3000
```

### Restart tunnel

Jika menggunakan systemd:

```bash
sudo systemctl restart cloudflared
```

Domain lama masih akan tetap ada sampai dihapus dari DNS.

---

# 7. Menjalankan Tunnel sebagai Service

Untuk penggunaan jangka panjang, jalankan tunnel sebagai system service.

File service:

```bash
nano /etc/systemd/system/cloudflared.service
```

Contoh konfigurasi:

```bash
[Unit]
Description=Cloudflare Tunnel
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
ExecStart=/usr/bin/cloudflared --config /home/user/.cloudflared/config.yml tunnel run home-server
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

Reload systemd:

```bash
sudo systemctl daemon-reload
```

Start service:

```bash
sudo systemctl start cloudflared
```

Enable auto start:

```bash
sudo systemctl enable cloudflared
```

Restart setelah update config:

```bash
sudo systemctl restart cloudflared
```

---

# 8. Monitoring Tunnel

Cek status service:

```bash
systemctl status cloudflared
```

Lihat log realtime:

```bash
journalctl -u cloudflared -f
```

List tunnel:

```bash
cloudflared tunnel list
```

Detail tunnel:

```bash
cloudflared tunnel info <name>
```

---

# 9. Use Case yang Umum

Cloudflare Tunnel sering digunakan untuk:

### Development Server

```bash
localhost:5173 → dev.example.com
```

### Webhook Testing

Digunakan untuk:

* GitHub webhook
* Stripe webhook
* Telegram bot
* WhatsApp bot
* payment gateway

### Reverse Proxy Multi Service

Satu tunnel untuk banyak aplikasi lokal.

### Secure Internal Tools

Expose dashboard internal seperti:

```
grafana
admin panel
debug dashboard
```

tanpa membuka port firewall.

---

# 10. Praktik Terbaik

Gunakan **named tunnel** daripada token.

Gunakan **subdomain** untuk setiap service.

Contoh:

```
api.example.com
dev.example.com
webhook.example.com
```

Lebih stabil dibanding path routing.

Gunakan **systemd service** agar tunnel tetap berjalan setelah reboot.

Selalu tambahkan fallback rule:

```
- service: http_status:404
```

---

# 11. Kesimpulan

Cloudflare Tunnel dapat digunakan untuk:

* reverse proxy
* expose localhost ke internet
* development server
* webhook testing
* secure internal services

Metode yang paling direkomendasikan:

```
Named Tunnel + config.yml + systemd service
```

Karena memberikan:

* kontrol penuh
* stabilitas
* fleksibilitas routing
* kemudahan maintenance.
