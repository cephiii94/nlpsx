# NLPSX Language Specification v0.1

## Tentang

NLPSX adalah bahasa pemrograman eksperimental yang dirancang agar lebih dekat dengan cara manusia berpikir.

Tagline:

**Code the Way You Think.**

---

## Filosofi

NLPSX berfokus pada:

* Keterbacaan manusia.
* Sintaks yang sederhana.
* Struktur yang jelas.
* Mudah dipelajari oleh pemula.

---

## Keyword

Keyword adalah kata khusus yang memiliki arti dalam bahasa NLPSX.

### Deklarasi & Nilai Variabel

```text
adalah
```

### Output

```text
tampilkan
```

### Kondisi

```text
jika
maka
jika tidak
selesai
```

### Perulangan

```text
selama
lakukan
selesai
```

### Fungsi

```text
fungsi
kembalikan
selesai
```

---

## Tipe Data

### angka

Menyimpan nilai numerik.

```nlpsx
angka umur adalah 20
```

### teks

Menyimpan karakter atau kalimat.

```nlpsx
teks nama adalah "Cecep"
```

### boolean

Menyimpan nilai benar atau salah.

```nlpsx
boolean aktif adalah benar
```

---

## Nilai Boolean

```text
benar
salah
```

Contoh:

```nlpsx
boolean premium adalah benar
```

---

## Operator

### Assignment

```text
adalah (untuk inisialisasi awal)
= (untuk re-assignment variabel yang ada)
```

Contoh:

```nlpsx
angka level adalah 1
level = 2
```

### Matematika

```text
+
-
*
/
```

Contoh:

```nlpsx
angka total adalah 10 + 5
```

### Perbandingan

NLPSX mendukung simbol matematika maupun kata kunci Bahasa Indonesia alami (sinonim):

*   `==` atau `adalah` atau `sama dengan`
*   `!=` atau `bukan`
*   `>` atau `lebih dari`
*   `<` atau `kurang dari`
*   `>=` atau `minimal`
*   `<=` atau `maksimal`

Contoh:

```nlpsx
jika umur lebih dari 18 maka
```

---

## Menampilkan Data

```nlpsx
tampilkan "Halo Dunia"
```

```nlpsx
teks nama adalah "Cecep"

tampilkan nama
```

---

## Deklarasi Variabel

```nlpsx
angka umur adalah 20
teks nama adalah "Cecep"
boolean aktif adalah benar
```

---

## Kondisi

```nlpsx
jika umur >= 18 maka
    tampilkan "Dewasa"
selesai
```

```nlpsx
jika umur >= 18 maka
    tampilkan "Dewasa"
jika tidak
    tampilkan "Anak-anak"
selesai
```

---

## Perulangan

```nlpsx
angka i adalah 1
selama i <= 5 lakukan
    tampilkan i
    i = i + 1
selesai
```

---

## Fungsi & Kembalikan

```nlpsx
fungsi tambah(angka a, angka b)
    kembalikan a + b
selesai

angka hasil adalah tambah(5, 10)
tampilkan hasil
```

---

## Program Hello World

```nlpsx
tampilkan "Halo Dunia dari NLPSX"
```

---

## Komentar

NLPSX mendukung komentar satu baris menggunakan simbol `#` atau `//`. Semua teks di dalam komentar akan diabaikan oleh parser.

```nlpsx
# Ini komentar pagar
teks nama adalah "Cecep" // Ini komentar double slash
```

---

## Target Implementasi v0.1

Fitur yang wajib tersedia:

* Lexer
* Parser
* AST
* Interpreter
* Output teks

Contoh yang harus berhasil dijalankan:

```nlpsx
tampilkan "Halo Dunia dari NLPSX"
```
