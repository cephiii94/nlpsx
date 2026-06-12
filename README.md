# NLPSX

**Code the Way You Think.**

NLPSX adalah eksperimen bahasa pemrograman yang dirancang agar lebih dekat dengan cara manusia berpikir, namun tetap memiliki struktur yang jelas dan konsisten untuk dipahami komputer.

---

## Visi

NLPSX ingin menjadi bahasa pemrograman yang menuliskan makna, bukan mekanisme.

Bahasa ini dirancang agar manusia dapat menulis instruksi secara lebih natural, mudah dibaca, dan tetap memiliki struktur yang kuat untuk dieksekusi oleh mesin. Jadi, mesin mempelajari bahasa manusia.

---

## Misi

* Membuat sintaks pemrograman yang ramah untuk pemula.
* Menggunakan Bahasa Indonesia sebagai identitas awal NLPSX.
* Menyederhanakan cara manusia menulis logika program.
* Membangun fondasi bahasa melalui Lexer, Parser, AST, dan Interpreter.
* Menjadi proyek open-source yang dapat dipelajari, dikembangkan, dan dikritik bersama.

---

## Origin Story

NLPSX dimulai pada Juni 2026 di Indonesia sebagai eksperimen untuk memahami bagaimana bahasa pemrograman dibangun dari nol.

Ide awal berkembang melalui diskusi, riset, eksperimen, dan AI-assisted brainstorming. AI digunakan sebagai partner diskusi untuk mengeksplorasi konsep bahasa, arsitektur compiler/interpreter, sintaks, dokumentasi, dan perencanaan proyek.

Seluruh visi, arah pengembangan, spesifikasi bahasa, dan implementasi tetap ditentukan oleh maintainer dan kontributor proyek.

---

## Arsitektur

```text
File .nlpsx
↓
Lexer
↓
Parser
↓
AST
↓
Interpreter
↓
Output
```

### Komponen

* **Lexer** → Mengubah teks menjadi token.
* **Parser** → Menyusun token menjadi struktur program.
* **AST** → Representasi internal dari program.
* **Interpreter** → Menjalankan AST.
* **Output** → Menampilkan hasil eksekusi.

---

## Fitur Utama (Pembeda NLPSX)

Berikut adalah beberapa fitur utama yang membedakan NLPSX dari bahasa pemrograman lainnya, khususnya bagi pemula:

1.  **Sintaksis Natural & Identitas Lokal**: Ditulis menggunakan Bahasa Indonesia yang mendekatkan logika pemrograman ke bahasa sehari-hari manusia (contoh: `buat`, `tampilkan`, `jika`, `maka`, `jika tidak`).
2.  **Keamanan Tipe Data Alami (*Type-Safe by Default*)**: Menerapkan pengecekan tipe data variabel yang ketat (`angka`, `teks`, `boolean`) saat runtime, melatih kebiasaan penulisan kode yang aman dan minim bug.
3.  **Pesan Kesalahan Ramah Pemula (*Friendly Error*)**: Setiap kesalahan penulisan kode disajikan dengan kalimat bahasa manusia yang santun, informatif, lengkap dengan koordinat baris/kolom, serta saran/tips cara memperbaikinya.
4.  **Dukungan Desimal & Escape Character**: Memiliki lexer cerdas yang langsung mengenali bilangan desimal pecahan, angka uner negatif, serta pemrosesan escape characters (`\n`, `\t`, `\"`) pada teks.
5.  **Arsitektur Modular**: Dirancang dari nol agar sangat mudah dipelajari strukturnya oleh pemula yang ingin belajar membuat compiler/interpreter sendiri.

---

## Status

NLPSX saat ini masih berada pada tahap desain dan spesifikasi bahasa.

Target awal:

* [ ] Language Specification v0.1
* [ ] Lexer
* [ ] Parser
* [ ] AST
* [ ] Interpreter
* [ ] Hello World

---

## Fitur

* Friendly Error : debugging eror yang ramah untuk pemula untuk sistem pelaporannya.
---

## License

MIT License
