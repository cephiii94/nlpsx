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

### Deklarasi

```text
buat
```

### Output

```text
tampilkan
```

### Kondisi

```text
jika
maka
selain
```

### Perulangan

```text
ulang
```

---

## Tipe Data

### angka

Menyimpan nilai numerik.

```nlpsx
buat angka umur = 20
```

### teks

Menyimpan karakter atau kalimat.

```nlpsx
buat teks nama = "Cecep"
```

### boolean

Menyimpan nilai benar atau salah.

```nlpsx
buat boolean aktif = benar
```

---

## Nilai Boolean

```text
benar
salah
```

Contoh:

```nlpsx
buat boolean premium = benar
```

---

## Operator

### Assignment

```text
=
```

Contoh:

```nlpsx
buat angka level = 1
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
buat angka total = 10 + 5
```

### Perbandingan

```text
>
<
>=
<=
==
!=
```

Contoh:

```nlpsx
jika umur >= 18 maka
```

---

## Menampilkan Data

```nlpsx
tampilkan "Halo Dunia"
```

```nlpsx
buat teks nama = "Cecep"

tampilkan nama
```

---

## Deklarasi Variabel

```nlpsx
buat angka umur = 20
buat teks nama = "Cecep"
buat boolean aktif = benar
```

---

## Kondisi

```nlpsx
jika umur >= 18 maka
    tampilkan "Dewasa"
```

```nlpsx
jika umur >= 18 maka
    tampilkan "Dewasa"
selain
    tampilkan "Anak-anak"
```

---

## Program Hello World

```nlpsx
tampilkan "Halo Dunia dari NLPSX"
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
