# Fitur Bahasa Pemrograman NLPSX (Update v0.2+)

Dokumen ini menjelaskan fitur-fitur dan kemampuan yang telah didukung oleh bahasa pemrograman NLPSX saat ini beserta contoh sintaksnya yang baru dan unik.

---

## 1. Tipe Data & Deklarasi Variabel

NLPSX adalah bahasa bertipe statis (*statically-typed*) yang dideklarasikan secara natural menggunakan kata kunci `adalah`. Saat ini mendukung tiga tipe data utama:

### A. Angka (`angka`)
Mendukung bilangan bulat (integer), pecahan desimal (float), dan bilangan negatif.
*   **Bilangan Bulat**:
    ```nlpsx
    angka umur adalah 20
    ```
*   **Pecahan Desimal**:
    ```nlpsx
    angka pi adalah 3.14
    ```
*   **Bilangan Negatif**:
    ```nlpsx
    angka suhu adalah -12.5
    ```

### B. Teks (`teks`)
Menyimpan karakter atau kalimat di dalam tanda kutip ganda. Mendukung pemrosesan karakter escape (*escape sequences*):
*   `\n` : Baris baru (newline)
*   `\t` : Tabulasi (tab)
*   `\"` : Tanda kutip ganda di dalam teks
*   `\\` : Karakter backslash
*   **Contoh**:
    ```nlpsx
    teks salam adalah "Halo \"Cecep\"\nSelamat datang!"
    ```

### C. Boolean (`boolean`)
Menyimpan nilai kebenaran logika. Nilai literal yang didukung adalah `benar` (*true*) dan `salah` (*false*):
*   **Contoh**:
    ```nlpsx
    boolean aktif adalah benar
    boolean premium adalah salah
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
    angka a adalah 10
    angka b adalah 2.5
    angka hasil adalah (a * b) / 2
    ```

### B. Operator Perbandingan
Digunakan untuk mengevaluasi perbandingan antara dua nilai. Menghasilkan nilai `boolean`. NLPSX mendukung penggunaan simbol matematika standar maupun kata kunci alami Bahasa Indonesia (Sinonim):

| Simbol | Sinonim Teks | Makna | Contoh Penggunaan |
| :---: | :--- | :--- | :--- |
| `==` | `adalah` atau `sama dengan` | Sama dengan | `jika status adalah "admin" maka` |
| `!=` | `bukan` | Tidak sama dengan | `jika skor bukan 100 maka` |
| `>` | `lebih dari` | Lebih besar dari | `jika umur lebih dari 18 maka` |
| `<` | `kurang dari` | Lebih kecil dari | `jika suhu kurang dari 5 maka` |
| `>=` | `minimal` | Lebih dari atau sama dengan | `jika nilai minimal 75 maka` |
| `<=` | `maksimal` | Kurang dari atau sama dengan | `jika i maksimal 5 maka` |

*Catatan: Semua gaya di atas valid dan dievaluasi secara identik oleh compiler.*

*   **Contoh**:
    ```nlpsx
    jika umur lebih dari 18 maka
        tampilkan "Dewasa"
    selesai
    ```

---

## 3. Struktur Kontrol Percabangan (Kondisi)

Mendukung pengambilan keputusan menggunakan pernyataan `jika ... maka` dengan opsi percabangan alternatif `jika tidak` dan diakhiri dengan `selesai`:

*   **Sintaks `jika ... maka ... selesai`**:
    ```nlpsx
    jika umur > 18 maka
        tampilkan "Akses diberikan."
    selesai
    ```
*   **Sintaks `jika ... maka ... jika tidak ... selesai`**:
    ```nlpsx
    jika level > 50 maka
        tampilkan "Tingkat Tinggi"
    jika tidak
        tampilkan "Tingkat Pemula"
    selesai
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
    teks nama adalah "Cecep"
    tampilkan nama
    ```

---

## 5. Struktur Kontrol Perulangan (Loop) & Re-assignment

### A. Perulangan `selama ... lakukan ... selesai`
Digunakan untuk mengeksekusi blok kode berulang kali selama kondisi bernilai `benar`. Blok pernyataan diakhiri dengan kata kunci `selesai`:
*   **Contoh**:
    ```nlpsx
    angka i adalah 1
    selama i <= 5 lakukan
        tampilkan i
        i = i + 1
    selesai
    ```

### B. Pemberian Nilai Baru (Re-assignment)
Mengubah nilai variabel yang sudah dideklarasikan sebelumnya. Tipe data dari nilai baru harus sesuai dengan tipe data saat deklarasi awal:
*   **Contoh**:
    ```nlpsx
    angka skor adalah 0
    skor = 10  # Valid menggunakan operator '='
    # skor = "sepuluh"  -> Akan memicu eror runtime tipe data tidak cocok
    ```

---

## 6. Fungsi (Function) & Scope Stack

### A. Deklarasi Fungsi `fungsi ... selesai`
Fungsi dideklarasikan menggunakan kata kunci `fungsi`, diikuti dengan nama fungsi, parameter terikat tipe, dan tubuh pernyataan yang diakhiri oleh `selesai`:
*   **Contoh**:
    ```nlpsx
    fungsi perkenalkan(teks nama, teks umur)
        tampilkan "Halo, saya " + nama
        tampilkan "Umur saya " + umur + " tahun."
    selesai
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
    teks nama adalah "Global"
    fungsi ubah(teks nama)
        tampilkan nama  # Mencetak "Lokal"
    selesai
    ubah("Lokal")
    tampilkan nama  # Mencetak "Global" (tidak berubah)
    ```

### D. Pengembalian Nilai (`kembalikan`)
Fungsi dapat mengembalikan nilai ke pemanggil menggunakan pernyataan `kembalikan <ekspresi>`. Eksekusi fungsi akan langsung dihentikan setelah pernyataan `kembalikan` dievaluasi (*early return*):
*   **Contoh**:
    ```nlpsx
    fungsi kuadrat(angka x)
        kembalikan x * x
    selesai
    angka hasil adalah kuadrat(5)
    tampilkan hasil  # Mencetak 25
    ```

---

## 7. Fitur Keamanan & Validasi (Quality of Life)

### A. Validasi Tipe Data Runtime (*Type Safety*)
Interpreter NLPSX melakukan pengecekan tipe data yang ketat saat runtime. Jika tipe data deklarasi tidak sesuai dengan nilai evaluasi, program akan langsung berhenti dan melempar eror:
```nlpsx
# Ini akan memicu error runtime karena nilai berupa teks dimasukkan ke tipe angka
angka umur adalah "Tua" 
```

### B. Informasi Lokasi Eror Detail
Setiap eror sintaksis (*syntax error*) maupun eror saat eksekusi (*runtime error*) akan melaporkan letak koordinat kesalahan secara presisi berupa nomor **Baris** dan **Kolom**:
```text
Error Runtime: Tipe data tidak sesuai. Variabel "umur" dideklarasikan sebagai "angka", tetapi diisi dengan tipe "string" di Baris 2, Kolom 7
```

### C. Penulisan Komentar (Comment)
NLPSX mendukung penulisan komentar satu baris untuk menjelaskan logika kode Anda. Komentar akan diabaikan sepenuhnya oleh compiler/interpreter saat menjalankan kode. Anda dapat menggunakan simbol `#` (gaya skrip) atau `//` (gaya C-style):

*   **Menggunakan `#`**:
    ```nlpsx
    # Ini adalah komentar satu baris menggunakan pagar
    angka x adalah 10
    ```
*   **Menggunakan `//`**:
    ```nlpsx
    angka y adalah 20 // Ini adalah komentar di akhir baris kode
    ```
