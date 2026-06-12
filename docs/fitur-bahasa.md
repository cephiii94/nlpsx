# Fitur Bahasa Pemrograman NLPSX (Update v0.2+)

Dokumen ini menjelaskan fitur-fitur dan kemampuan yang telah didukung oleh bahasa pemrograman NLPSX saat ini beserta contoh sintaksnya.

---

## 1. Tipe Data & Deklarasi Variabel

NLPSX adalah bahasa bertipe statis (*statically-typed*) yang mewajibkan pendeklarasian tipe data menggunakan kata kunci `buat`. Saat ini mendukung tiga tipe data utama:

### A. Angka (`angka`)
Mendukung bilangan bulat (integer), pecahan desimal (float), dan bilangan negatif.
*   **Bilangan Bulat**:
    ```nlpsx
    buat angka umur = 20
    ```
*   **Pecahan Desimal**:
    ```nlpsx
    buat angka pi = 3.14
    ```
*   **Bilangan Negatif**:
    ```nlpsx
    buat angka suhu = -12.5
    ```

### B. Teks (`teks`)
Menyimpan karakter atau kalimat di dalam tanda kutip ganda. Mendukung pemrosesan karakter escape (*escape sequences*):
*   `\n` : Baris baru (newline)
*   `\t` : Tabulasi (tab)
*   `\"` : Tanda kutip ganda di dalam teks
*   `\\` : Karakter backslash
*   **Contoh**:
    ```nlpsx
    buat teks salam = "Halo \"Cecep\"\nSelamat datang!"
    ```

### C. Boolean (`boolean`)
Menyimpan nilai kebenaran logika. Nilai literal yang didukung adalah `benar` (*true*) dan `salah` (*false*):
*   **Contoh**:
    ```nlpsx
    buat boolean aktif = benar
    buat boolean premium = salah
    ```

---

## 2. Operator Matematika & Perbandingan

### A. Operator Aritmatika (Matematika)
Mendukung 4 operasi aritmatika dasar pada tipe data `angka`:
*   `+` (Penjumlahan)
*   `-` (Pengurangan / Negasi Uner)
*   `*` (Perkalian)
*   `/` (Pembagian - *dilengkapi perlindungan pembagian dengan nol*)
*   **Contoh**:
    ```nlpsx
    buat angka a = 10
    buat angka b = 2.5
    buat angka hasil = (a * b) / 2
    ```

### B. Operator Perbandingan
Digunakan untuk mengevaluasi perbandingan antara dua nilai. Menghasilkan nilai `boolean`:
*   `>` (Lebih besar dari)
*   `<` (Lebih kecil dari)
*   `>=` (Lebih besar sama dengan)
*   `<=` (Lebih kecil sama dengan)
*   `==` (Sama dengan)
*   `!=` (Tidak sama dengan)
*   **Contoh**:
    ```nlpsx
    jika umur >= 18 maka
    ```

---

## 3. Struktur Kontrol Percabangan (Kondisi)

Mendukung pengambilan keputusan menggunakan pernyataan `jika ... maka` dengan opsi percabangan alternatif `selain`:

*   **Sintaks `jika ... maka` tunggal**:
    ```nlpsx
    jika umur > 18 maka
        tampilkan "Akses diberikan."
    ```
*   **Sintaks `jika ... maka ... selain`**:
    ```nlpsx
    jika level > 50 maka
        tampilkan "Tingkat Tinggi"
    selain
        tampilkan "Tingkat Pemula"
    ```

---

## 4. Output Data

Pernyataan untuk mencetak teks atau nilai variabel ke terminal menggunakan perintah `tampilkan`:
*   **Menampilkan teks langsung**:
    ```nlpsx
    tampilkan "Halo Dunia dari NLPSX"
    ```
*   **Menampilkan nilai variabel**:
    ```nlpsx
    buat teks nama = "Cecep"
    tampilkan nama
    ```

---

## 5. Fitur Keamanan & Validasi (Quality of Life)

### A. Validasi Tipe Data Runtime (*Type Safety*)
Interpreter NLPSX melakukan pengecekan tipe data yang ketat saat runtime. Jika tipe data deklarasi tidak sesuai dengan nilai evaluasi, program akan langsung berhenti dan melempar eror:
```nlpsx
# Ini akan memicu error runtime karena nilai berupa teks dimasukkan ke tipe angka
buat angka umur = "Tua" 
```

### B. Informasi Lokasi Eror Detail
Setiap eror sintaksis (*syntax error*) maupun eror saat eksekusi (*runtime error*) akan melaporkan letak koordinat kesalahan secara presisi berupa nomor **Baris** dan **Kolom**:
```text
Error Runtime: Tipe data tidak sesuai. Variabel "umur" dideklarasikan sebagai "angka", tetapi diisi dengan tipe "string" di Baris 2, Kolom 7
```
