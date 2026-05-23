---
layout: ../../layouts/MainLayout.astro
title: "Fix Mic Internal Ubuntu 22.04 di ThinkPad L380"
date: "2026-05-23"
description: "Mengatasi masalah microphone internal yang noisy, pecah, atau kecil di Ubuntu 22.04 LTS pada laptop Lenovo ThinkPad L380 dengan codec Realtek ALC257."
keywords: ["mic internal ubuntu", "thinkpad l380 mic fix", "realtek alc257 ubuntu", "pavucontrol", "easyeffects", "alsa-base.conf", "mic noise ubuntu"]
---

Beberapa hari ini saya sempat bingung karena mic internal di Ubuntu 22.04 jelek banget:

* Suara noise
* Kayak radio
* Pecah
* Kadang kecil banget

Padahal kalau menggunakan:

* Headset
* Mic jack
* Mic eksternal

hasilnya normal-normal saja.

Ternyata masalahnya bukan dari hardware, karena di Windows mic internal tetap berfungsi dengan bagus dan jernih.

Laptop yang saya pakai:
* **Device**: Lenovo ThinkPad L380
* **Codec audio**: Realtek ALC257
* **OS**: Ubuntu 22.04 LTS

---

## Solusi yang Paling Berpengaruh

Masalah ini biasanya disebabkan oleh konfigurasi model kartu suara ALSA yang kurang pas untuk codec Realtek ALC257 di laptop ThinkPad.

Edit file konfigurasi ALSA:

```bash
sudo nano /etc/modprobe.d/alsa-base.conf
```

Tambahkan baris berikut di bagian paling bawah:

```bash
options snd-hda-intel model=laptop-amic
```

Lalu reboot laptop:

```bash
sudo reboot
```

Setelah reboot, suara dari mic internal langsung jauh lebih bersih dan bagus.

---

## Tuning Mic lewat Alsamixer

Setelah melakukan langkah di atas, kita bisa melakukan tuning volume dan boost agar hasilnya lebih maksimal.

Install tools yang dibutuhkan:

```bash
sudo apt install alsa-utils pavucontrol -y
```

Buka alsamixer di terminal:

```bash
alsamixer
```

Lalu ikuti langkah berikut:
1. Tekan `F6` untuk memilih sound card, lalu pilih **HDA Intel PCH**.
2. Tekan `F4` untuk masuk ke tab **Capture** (input).

Setting yang paling cocok dan minim noise di laptop saya:

| Setting | Nilai |
| :--- | :--- |
| **Capture** | 60–75 |
| **Internal Mic Boost** | 10 |
| **Mic Boost** | 0 |

> [!WARNING]
> Jika nilai boost (terutama *Mic Boost* atau *Internal Mic Boost*) diset terlalu tinggi, suara rekaman justru akan menjadi noisy, pecah, dan terdengar seperti radio kuno.

---

## Atur Volume Input via Pavucontrol

Buka Pavucontrol lewat menu aplikasi atau ketik di terminal:

```bash
pavucontrol
```

Masuk ke tab **Input Devices**, lalu atur volume input mic internal sekitar **60% hingga 75%**. 

Jangan atur sampai 100% (full) karena rawan mengalami *clipping* (suara pecah saat nada tinggi).

---

## Konfigurasi EasyEffects (Opsional)

Awalnya saya mencoba menggunakan banyak efek di EasyEffects seperti:
* Equalizer (EQ)
* Compressor
* Noise Reduction

Namun, jika konfigurasinya berlebihan, suara yang dihasilkan malah terdengar aneh (*robotic*, *metallic*, atau kayak radio pecah).

Akhirnya saya hanya mengaktifkan:
1. **Compressor ringan** (untuk menjaga kestabilan volume suara).
2. **Noise reduction tipis** (untuk memfilter suara kipas laptop).

Hasilnya justru terdengar jauh lebih natural dan jernih dibanding memakai banyak preset efek.

---

## Simpan Konfigurasi ALSA

Agar settingan volume alsamixer yang sudah kita atur tidak kembali ke *default* (reset) saat laptop dimatikan atau di-reboot, simpan konfigurasi dengan perintah:

```bash
sudo alsactl store
```

---

Sekarang microphone internal di ThinkPad L380 sudah sangat layak (*usable*) digunakan untuk aktivitas harian seperti:
* Discord
* Google Meet / Zoom
* Voice chat game
* Perekaman suara ringan

Semoga bermanfaat!
