---
layout: ../../layouts/MainLayout.astro
title: "Linux Optimization Guide — ThinkPad L380 Ubuntu 22.04"
date: "2026-05-16"
description: "Dokumentasi lengkap optimasi Linux pada ThinkPad L380 Ubuntu 22.04 LTS, mencakup performa, storage, RAM, battery, network, boot time, dan workflow developer."
keywords: ["linux optimization", "thinkpad l380", "ubuntu 22.04", "performance tuning", "battery", "network", "boot time"]
---

Dokumentasi lengkap optimasi Linux yang saya lakukan pada laptop ThinkPad L380 dengan Ubuntu 22.04 LTS. Artikel ini mencakup optimasi performa, storage, RAM, battery, network, boot time, dan developer workflow.

---

## Device Specs

| Komponen | Detail |
|----------|--------|
| **Device** | Lenovo ThinkPad L380 20M6CTO1WW |
| **OS** | Ubuntu 22.04.5 LTS |
| **Kernel** | 6.8.0-111-generic |
| **CPU** | Intel i5-8250U (8 core) @ 3.4GHz |
| **GPU** | Intel UHD Graphics 620 |
| **RAM** | 16GB |
| **Storage** | 476.9GB NVMe SSD (nvme0n1) |
| **Shell** | Zsh + Oh My Zsh |
| **Boot** | UEFI, Dual Boot Windows + Linux |

### Partisi Disk

| Partisi   | Ukuran   | Filesystem | Mount Point   | Keterangan        |
|-----------|----------|------------|---------------|-------------------|
| nvme0n1p1 | 645MB    | NTFS       | -             | Windows Recovery  |
| nvme0n1p2 | 100MB    | VFAT       | /boot/efi     | EFI Boot          |
| nvme0n1p3 | 124.3GB  | NTFS       | -             | Windows C:        |
| nvme0n1p4 | 1GB      | VFAT       | -             | Linux Boot        |
| nvme0n1p5 | 155.3GB  | NTFS       | /media/aufal  | Windows D:        |
| nvme0n1p6 | 195.5GB  | EXT4       | /             | Linux Root        |

---

## 1. RAM & Kernel Optimization

### Tuning Swappiness & VFS Cache

**File:** `/etc/sysctl.conf`

```bash
# Kurangi swappiness (default 60 → 10)
# Supaya Linux lebih prefer RAM daripada swap
vm.swappiness=10

# VFS cache pressure (default 100 → 50)
# Supaya kernel lebih lama simpan cache filesystem di RAM
vm.vfs_cache_pressure=50

# Inode cache
fs.inode-nr=1000000

# File watcher limit — PENTING untuk VSCode, webpack, vite!
# Default 8192 terlalu kecil, sering menyebabkan error ENOSPC
fs.inotify.max_user_watches=524288
fs.inotify.max_user_instances=512

# Network buffer optimization
net.core.rmem_max=134217728
net.core.wmem_max=134217728
net.ipv4.tcp_rmem=4096 87380 134217728
net.ipv4.tcp_wmem=4096 65536 134217728
net.core.netdev_max_backlog=5000
net.ipv4.tcp_fastopen=3

# BBR TCP Congestion Control
net.core.default_qdisc=fq
net.ipv4.tcp_congestion_control=bbr
```

**Apply tanpa reboot:**
```bash
sudo sysctl -p
```

**Efek:**
- RAM lebih optimal, swap hampir tidak terpakai
- Buka file/folder yang sama lebih cepat (cache lebih lama di RAM)
- File watcher limit tinggi → tidak ada error saat development
- Network lebih stabil dan throughput lebih tinggi

---

## 2. Storage Optimization

### Enable TRIM untuk NVMe

TRIM memberitahu NVMe cell mana yang sudah kosong, sehingga write lebih cepat dan umur NVMe lebih panjang.

```bash
# Enable TRIM otomatis (berjalan seminggu sekali)
sudo systemctl enable fstrim.timer
sudo systemctl start fstrim.timer

# Jalankan TRIM sekarang
sudo fstrim -av
```

**Hasil:** 143GB cell NVMe berhasil di-TRIM!

### Cleanup Package & Cache

```bash
# Hapus package yang tidak terpakai
sudo apt autoremove --purge

# Bersihkan cache apt (installer lama)
sudo apt autoclean
```

**Hasil:** ~250MB storage freed

### Cleanup Journal Log

```bash
# Cek ukuran journal log
journalctl --disk-usage

# Batasi ukuran journal log menjadi 100MB
sudo journalctl --vacuum-size=100M
```

**Hasil:** ~3.8GB storage freed (dari 3.9GB → 100MB)

### tmpfs untuk /tmp

Memindahkan `/tmp` ke RAM agar akses file temporary lebih cepat dan otomatis bersih saat reboot.

**File:** `/etc/fstab`

```bash
# Tambahkan di baris paling bawah
tmpfs /tmp tmpfs defaults,noatime,nosuid,size=2G 0 0
```

```bash
# Apply tanpa reboot
sudo mount -a
```

**Efek:**
- File temporary (browser cache, compiler temp, dll) disimpan di RAM
- Otomatis bersih saat reboot
- Tidak perlu manual hapus file temporary

---

## 3. Battery Optimization

### Install & Konfigurasi TLP

TLP adalah power management otomatis yang sangat cocok untuk ThinkPad.

```bash
sudo apt install tlp tlp-rdw -y
sudo systemctl enable tlp
sudo systemctl start tlp
```

**Efek:**
- Otomatis switch ke power saving mode saat battery
- Otomatis switch ke performance mode saat charging
- Baterai lebih tahan lama

---

## 4. Network Optimization

### BBR TCP Congestion Control

BBR (Bottleneck Bandwidth and Round-trip propagation time) adalah algoritma TCP yang lebih pintar dari Cubic (default).

```bash
# Verifikasi BBR aktif
sysctl net.ipv4.tcp_congestion_control
# Output: net.ipv4.tcp_congestion_control = bbr

lsmod | grep bbr
# Output: tcp_bbr   20480  2
```

**Efek:**
- Download/upload lebih stabil
- Latency lebih rendah
- Performa lebih baik saat menggunakan hotspot/WiFi

---

## 5. Boot Time Optimization

### Hasil Optimasi Boot

| Kondisi | Boot Time |
|---------|-----------|
| Sebelum optimasi | ~35 detik |
| Setelah optimasi | ~20 detik |
| **Total hemat** | **~15 detik** |

### Breakdown

| Komponen | Sebelum | Sesudah |
|----------|---------|---------|
| Firmware | 6.5s | 6.5s (tidak bisa diubah) |
| Loader (GRUB) | 15.6s | 6.1s |
| Kernel | 1.9s | 1.9s |
| Userspace | 10.9s | 5.0s |

### Services yang Dinonaktifkan

```bash
# NetworkManager wait online (paling besar, 6.6 detik!)
sudo systemctl disable NetworkManager-wait-online.service

# Plymouth (animasi boot)
sudo systemctl mask plymouth-quit-wait.service plymouth.service

# Firmware updater (jarang dibutuhkan)
sudo systemctl mask fwupd.service

# PHP session cleaner (tidak perlu saat PHP tidak aktif)
sudo systemctl mask phpsessionclean.service phpsessionclean.timer

# PostgreSQL (dinonaktifkan lewat parent service)
sudo systemctl disable postgresql.service
sudo systemctl mask postgresql.service

# Crash reporter
sudo systemctl disable apport.service apport-autoreport.service
```

### GRUB Timeout

**File:** `/etc/default/grub`

```bash
# Kurangi timeout dari 10 detik → 3 detik
GRUB_TIMEOUT=3
```

```bash
sudo update-grub
```

---

## 6. Snap Cleanup

Ubuntu default menginstall banyak snap packages yang masing-masing membuat loop device. Ini menyebabkan banyak loop device yang tidak perlu.

```bash
# Hapus versi snap lama yang disabled
sudo snap set system refresh.retain=2
sudo bash -c 'snap list --all | awk "/disabled/{print \$1, \$3}" | \
  while read name rev; do \
    snap remove "$name" --revision="$rev"; \
  done'
```

**Hasil:** Loop devices berkurang dari 22 → 13

---

## 7. Developer Services Management

### Alias dev-start / dev-stop

Karena services development (MySQL, PostgreSQL, Redis, Nginx, PHP) tidak perlu selalu berjalan, kita buat alias untuk menyalakan/mematikannya dengan mudah.

**File:** `~/.zshrc`

```bash
# Start semua dev services
alias dev-start="sudo systemctl unmask phpsessionclean.service phpsessionclean.timer && sudo systemctl start mysql postgresql@14-main redis-server nginx php8.3-fpm && sudo systemctl enable phpsessionclean.timer"

# Stop semua dev services
alias dev-stop="sudo systemctl stop mysql postgresql@14-main redis-server nginx php8.3-fpm && sudo systemctl mask phpsessionclean.service phpsessionclean.timer"

# Cek status dev services
alias dev-status="sudo systemctl status mysql postgresql@14-main redis-server nginx php8.3-fpm"
```

```bash
source ~/.zshrc
```

**Penggunaan:**
```bash
dev-start   # Nyalakan semua service development
dev-stop    # Matikan semua service development
dev-status  # Cek status semua service
```

---

## 8. Terminal & Shell Optimization

### Zsh Plugins

**File:** `~/.zshrc`

```bash
plugins=(
  git                    # Git shortcuts (gst, gaa, gcmsg, dll)
  z                      # cd pintar (z namaproject → langsung ke folder)
  zsh-autosuggestions    # Saran command otomatis
  zsh-syntax-highlighting # Command berwarna (merah=salah, hijau=benar)
  docker                 # Autocomplete docker commands
  sudo                   # ESC ESC → auto tambahkan sudo
)
```

**Install external plugins:**
```bash
# zsh-autosuggestions
git clone https://github.com/zsh-users/zsh-autosuggestions \
  ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions

# zsh-syntax-highlighting
git clone https://github.com/zsh-users/zsh-syntax-highlighting \
  ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting
```

### FZF (Fuzzy Finder)

FZF adalah fuzzy finder yang sangat powerful untuk pencarian history, file, dan folder.

```bash
sudo apt install fzf -y
echo "source /usr/share/doc/fzf/examples/key-bindings.zsh" >> ~/.zshrc
source ~/.zshrc
```

**Shortcut:**
| Shortcut | Fungsi |
|----------|--------|
| `Ctrl+R` | Fuzzy search history command |
| `Ctrl+T` | Fuzzy search file di current directory |
| `Alt+C` | Fuzzy cd ke folder |

---

## 9. Screenshot Tool

Mengganti GNOME Screenshot bawaan dengan Flameshot yang lebih powerful.

```bash
sudo apt install flameshot -y
```

**Konfigurasi:**
- Disable semua shortcut GNOME Screenshot di Settings → Keyboard
- Tambah custom shortcut: `flameshot gui` dengan tombol `PrtScr`
- Set save path ke `/tmp` agar screenshot otomatis bersih saat reboot

```bash
# Set save path ke /tmp
nano ~/.config/flameshot/flameshot.ini
# Ubah:
# savePath=/tmp
# savePathFixed=true
```

---

## 10. Git Optimization

```bash
# Set VSCode sebagai default git editor
git config --global core.editor "code --wait"

# Git aliases shortcut
git config --global alias.st "status"
git config --global alias.lg "log --oneline --graph --decorate --all"
git config --global alias.undo "reset HEAD~1 --mixed"
git config --global alias.unstage "restore --staged"

# Auto correct typo
git config --global help.autocorrect 10

# Credential helper
git config --global credential.helper store

# Warna output
git config --global color.ui auto

# Pull behavior
git config --global pull.rebase false
```

---

## Summary Hasil Optimasi

| Kategori | Sebelum | Sesudah |
|----------|---------|---------|
| Boot time | ~35 detik | ~20 detik |
| Loop devices | 22 | 13 |
| Journal log | 3.9GB | 100MB |
| Storage freed | - | ~4GB+ |
| Swap usage | Aktif | 0B (tidak terpakai) |
| TCP | Cubic | BBR |
| /tmp | Di disk | Di RAM (tmpfs) |
| Battery | Default | TLP managed |

---

## Lokasi File yang Diubah

| File | Perubahan |
|------|-----------|
| `/etc/sysctl.conf` | swappiness, BBR, network buffer, inotify |
| `/etc/fstab` | tmpfs /tmp |
| `/etc/default/grub` | GRUB_TIMEOUT=3 |
| `~/.zshrc` | plugins, aliases, fzf |
| `~/.config/flameshot/flameshot.ini` | savePath, savePathFixed |
| `~/.gitconfig` | editor, aliases, credential helper |

---

> **Tips:** Selalu backup file konfigurasi sebelum diubah dengan `cp /etc/sysctl.conf /etc/sysctl.conf.bak`

> **Warning:** Beberapa optimasi seperti mask services mungkin berbeda hasilnya tergantung hardware dan kebutuhan masing-masing.
