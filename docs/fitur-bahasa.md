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

Mendukung pengambilan keputusan menggunakan pernyataan `jika ... maka` dengan opsi percabangan alternatif `jika tidak`:

*   **Sintaks `jika ... maka` tunggal**:
    ```nlpsx
    jika umur > 18 maka
        tampilkan "Akses diberikan."
    ```
*   **Sintaks `jika ... maka ... jika tidak`**:
    ```nlpsx
    jika level > 50 maka
        tampilkan "Tingkat Tinggi"
    jika tidak
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

## 5. Struktur Kontrol Perulangan (Loop) & Re-assignment

### A. Perulangan `selama ... lakukan`
Digunakan untuk mengeksekusi blok kode berulang kali selama kondisi bernilai `benar`. Blok pernyataan dibatasi oleh karakter `{` dan `}`:
*   **Contoh**:
    ```nlpsx
    buat angka i = 1
    selama i <= 5 lakukan
    {
        tampilkan i
        i = i + 1
    }
    ```

### B. Pemberian Nilai Baru (Re-assignment)
Mengubah nilai variabel yang sudah dideklarasikan sebelumnya tanpa kata kunci `buat`. Tipe data dari nilai baru harus sesuai dengan tipe data saat deklarasi awal untuk menjaga keamanan tipe data (*type safety*):
*   **Contoh**:
    ```nlpsx
    buat angka skor = 0
    skor = 10  # Valid
    # skor = "sepuluh"  -> Akan memicu eror runtime tipe data tidak cocok
    ```

---

## 6. Fungsi (Function) & Scope Stack

### A. Deklarasi Fungsi `fungsi`
Fungsi dideklarasikan menggunakan kata kunci `fungsi`, diikuti dengan nama fungsi, parameter terikat tipe, dan tubuh pernyataan (dapat berupa satu baris atau dibatasi kurung kurawal `{ ... }`):
*   **Contoh**:
    ```nlpsx
    fungsi perkenalkan(teks nama, teks umur)
    {
        tampilkan "Halo, saya " + nama
        tampilkan "Umur saya " + umur + " tahun."
    }
    ```

### B. Pemanggilan Fungsi & Validasi Argumen
Fungsi dipanggil dengan tanda kurung `()`. Setiap argumen yang dilewatkan ke fungsi akan dievaluasi dan divalidasi tipenya secara ketat sesuai dengan tipe data parameter yang dideklarasikan:
*   **Contoh**:
    ```nlpsx
    perkenalkan("Budi", "17")  # Valid
    # perkenalkan("Budi", 17)  -> Eror Runtime: tipe data argumen kedua tidak cocok (diharapkan teks, didapatkan angka)
    ```

### C. Isolasi Ruang Lingkup (Scope Stack)
NLPSX mengadopsi struktur *Scope Stack* untuk mengisolasi variabel lokal fungsi. Parameter fungsi dan variabel yang dibuat di dalam fungsi tidak akan memengaruhi atau menimpa variabel global dengan nama yang sama:
*   **Contoh**:
    ```nlpsx
    buat teks nama = "Global"
    fungsi ubah(teks nama)
    {
        tampilkan nama  # Mencetak "Lokal"
    }
    ubah("Lokal")
    tampilkan nama  # Mencetak "Global" (tidak berubah)
    ```

### D. Pengembalian Nilai (`kembalikan`)
Fungsi dapat mengembalikan nilai ke pemanggil menggunakan pernyataan `kembalikan <ekspresi>`. Eksekusi fungsi akan langsung dihentikan setelah pernyataan `kembalikan` dievaluasi (*early return*):
*   **Contoh**:
    ```nlpsx
    fungsi kuadrat(angka x)
    {
        kembalikan x * x
    }
    buat angka hasil = kuadrat(5)
    tampilkan hasil  # Mencetak 25
    ```

---

## 7. Fitur Keamanan & Validasi (Quality of Life)

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
