---
layout: ../../layouts/MainLayout.astro
title: "PassGen – Bikin CLI Tool Generate Password Sendiri"
date: "2026-03-06"
description: "Bosan buka situs random password generator cuma buat buat password baru? Aku bikin PassGen, CLI tool ringan berbasis Node.js untuk generate password aman langsung dari terminal."
keywords: ["password generator", "cli tool", "nodejs cli", "commander js", "open source project", "bikin cli nodejs"]
---
Halo! Di post kali ini aku mau cerita tentang proyek kecil yang aku bikin namanya **PassGen** — sebuah CLI tool untuk generate password langsung dari terminal.

---

## Latar Belakang

Jujur, ide ini muncul dari keresahan sendiri. Setiap kali bikin akun baru di suatu platform, aku selalu bingung mau pakai password apa. Kadang pakai password yang gampang diingat tapi ya... nggak aman. Kadang buka situs random password generator di browser, tapi rasanya ribet banget harus buka browser cuma buat itu.

Nah, sebagai developer, aku pikir — *kenapa nggak bikin sendiri aja?* Yang bisa diakses langsung dari terminal, cepet, dan simpel. Dari situ lahirlah **PassGen CLI**.

Proyeknya sederhana banget, tapi cukup sering aku pakai sehari-hari. Dan karena ngerasa ini berguna, aku putuskan untuk open source-in biar siapapun bisa pakai atau bahkan ikut kontribusi.

---

## Apa Itu PassGen?

**PassGen** adalah CLI tool ringan yang ditulis dengan Node.js untuk generate password acak yang aman langsung dari terminal. Bisa dikustomisasi panjangnya, bisa pilih mau include angka atau simbol atau nggak, dan bisa nyimpen password yang di-generate ke file lokal dengan label biar gampang dicari lagi.

---

## Instalasi

Ada dua cara install PassGen.

### Option 1 — Install global via npm (recommended)

Cara paling gampang, langsung jalanin ini di terminal:

```bash
npm install -g https://github.com/aufall02/password-generator
```

Selesai! Perintah `passgen` langsung bisa dipakai dari mana aja.

### Option 2 — Clone & link manual

Buat yang mau ngoprek kodenya:

```bash
git clone https://github.com/aufall02/password-generator.git
cd password-generator
npm install
npm link
```

---

## Cara Pakai

Setelah terinstall, tinggal panggil `passgen` di terminal.

### Generate password default (10 karakter)

```bash
passgen
```

Output contoh:
```
aB3$kL9!mZ
```

### Generate password dengan panjang custom

```bash
passgen -l 20
```

### Generate password tanpa simbol

```bash
passgen -S
```

### Generate password tanpa angka

```bash
passgen -n
```

### Simpan password dengan label

Biar nggak lupa password yang udah di-generate, bisa langsung disimpen ke file lokal dengan label:

```bash
passgen -s facebook
```

Output:
```
xK7@pQr2!mN
Password berhasil disimpan ke passwords.txt
```

### Cari password berdasarkan label

```bash
passgen -f facebook
```

Output:
```
Password dengan label "facebook":
facebook | xK7@pQr2!mN
```

### Lihat semua password yang tersimpan

```bash
passgen -v
```

### Hapus semua password yang tersimpan

```bash
passgen -r
```

---

## Semua Opsi

| Option | Deskripsi | Default |
|---|---|---|
| `-l, --length <number>` | Panjang password | `10` |
| `-s, --save [label]` | Simpan password dengan label opsional | - |
| `-f, --find <label>` | Cari password berdasarkan label | - |
| `-n, --no-numbers` | Tanpa angka | - |
| `-S, --no-symbols` | Tanpa simbol | - |
| `-v, --view` | Lihat semua password tersimpan | - |
| `-r, --remove` | Hapus semua password tersimpan | - |

---

## Tech Stack

Proyeknya cukup minimalis:

- **Node.js** — runtime-nya
- **Commander.js** — library untuk bikin CLI dengan mudah, handle parsing argument dan flag-nya

---

Segitu dulu dari aku! Proyek ini emang kecil, tapi ngajarin banyak hal soal bikin CLI tool yang proper — dari parsing argument, file handling, sampai cara packaging biar bisa di-install global. Semoga bermanfaat buat yang lagi belajar Node.js juga. 🙌
