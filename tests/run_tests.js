const Lexer = require("../src/lexer/lexer");
const Parser = require("../src/parser/parser");
const Interpreter = require("../src/interpreter/interpreter");

const tests = [
  {
    name: "Deklarasi dan Tampilkan Teks",
    code: `
      teks nama adalah "Budi"
      tampilkan nama
    `,
    expected: ["Budi"],
  },
  {
    name: "Penjumlahan Angka",
    code: `
      angka a adalah 5
      angka b adalah 10
      angka c adalah a + b
      tampilkan c
    `,
    expected: [15],
  },
  {
    name: "Kondisi jika-maka Benar",
    code: `
      angka umur adalah 20
      jika umur > 18 maka
          tampilkan "Dewasa"
      selesai
    `,
    expected: ["Dewasa"],
  },
  {
    name: "Kondisi jika-maka Salah dengan Jika Tidak",
    code: `
      angka umur adalah 10
      jika umur > 18 maka
          tampilkan "Dewasa"
      jika tidak
          tampilkan "Anak-anak"
      selesai
    `,
    expected: ["Anak-anak"],
  },
  {
    name: "Error Runtime: Variabel Belum Dideklarasikan",
    code: `
      tampilkan nama_baru
    `,
    expectedError: "Error Runtime [Baris 2]: Variabel \"nama_baru\" belum dideklarasikan",
  },
  {
    name: "Error Sintaks: Kurang Keyword maka",
    code: `
      jika 5 > 3
          tampilkan "OK"
      selesai
    `,
    expectedError: "Error Sintaks [di Baris 3, Kolom 11]: Mengharapkan simbol atau kata kunci \"THEN\"",
  },
  {
    name: "Angka Desimal & Uner Negatif",
    code: `
      angka a adalah 3.5
      angka b adalah -1.5
      angka c adalah a + b
      tampilkan c
    `,
    expected: [2],
  },
  {
    name: "String Escape Characters",
    code: `
      teks s adalah "Halo\\t\\"Budi\\"\\nKabar Baik"
      tampilkan s
    `,
    expected: ["Halo\t\"Budi\"\nKabar Baik"],
  },
  {
    name: "Error Runtime: Type Mismatch Angka diisi Teks",
    code: `
      angka var_salah adalah "Halo"
    `,
    expectedError: "Error Runtime [Baris 2]: Tipe data tidak cocok. Variabel \"var_salah\" dideklarasikan sebagai \"angka\", tetapi Anda mengisinya dengan tipe \"string\"",
  },
  {
    name: "Error Runtime: Type Mismatch Teks diisi Boolean",
    code: `
      teks var_salah adalah benar
    `,
    expectedError: "Error Runtime [Baris 2]: Tipe data tidak cocok. Variabel \"var_salah\" dideklarasikan sebagai \"teks\", tetapi Anda mengisinya dengan tipe \"boolean\"",
  },
  {
    name: "Error Runtime: Type Mismatch Boolean diisi Angka",
    code: `
      boolean var_salah adalah 12
    `,
    expectedError: "Error Runtime [Baris 2]: Tipe data tidak cocok. Variabel \"var_salah\" dideklarasikan sebagai \"boolean\", tetapi Anda mengisinya dengan tipe \"number\"",
  },
  {
    name: "Perulangan Dasar",
    code: `
      angka i adalah 1
      selama i <= 3 lakukan
          tampilkan i
          i = i + 1
      selesai
    `,
    expected: [1, 2, 3],
  },
  {
    name: "Error Runtime: Re-assignment Tipe Data Tidak Cocok",
    code: `
      angka i adalah 1
      i = "salah"
    `,
    expectedError: "Error Runtime [Baris 3]: Tipe data tidak cocok. Variabel \"i\" dideklarasikan sebagai \"angka\", tetapi Anda mengisinya dengan tipe \"string\"",
  },
  {
    name: "Error Runtime: Re-assignment Variabel Belum Dibuat",
    code: `
      x = 5
    `,
    expectedError: "Error Runtime [Baris 2]: Variabel \"x\" belum dideklarasikan. Silakan deklarasikan terlebih dahulu menggunakan kata kunci \"adalah\"",
  },
  {
    name: "Error Sintaks: Kurang Keyword lakukan",
    code: `
      angka i adalah 1
      selama i <= 5
          tampilkan i
      selesai
    `,
    expectedError: "Tips: Anda menulis pernyataan perulangan \"selama\" tetapi lupa menulis kata kunci \"lakukan\" setelah kondisi",
  },
  {
    name: "Error Sintaks: Blok Kurang Tutup Selesai",
    code: `
      angka i adalah 1
      selama i <= 5 lakukan
          tampilkan i
          i = i + 1
    `,
    expectedError: "Tips: Pastikan Anda menutup blok perulangan/kondisi/fungsi dengan kata penutup \"selesai\"",
  },
  {
    name: "Error Sintaks: Kurang Kondisi Perulangan",
    code: `
      selama lakukan
          tampilkan 1
      selesai
    `,
    expectedError: "Tips: Anda menulis \"selama\" diikuti langsung oleh \"lakukan\". Pastikan Anda menulis kondisi perulangan (seperti \"i <= 5\") di antara keduanya",
  },
  {
    name: "Fungsi Tanpa Parameter",
    code: `
      fungsi halo()
          tampilkan "Halo Dunia!"
      selesai
      halo()
    `,
    expected: ["Halo Dunia!"],
  },
  {
    name: "Fungsi Dengan Parameter",
    code: `
      fungsi tambah(angka a, angka b)
          tampilkan a + b
      selesai
      tambah(10, 20)
    `,
    expected: [30],
  },
  {
    name: "Fungsi Scope Isolation",
    code: `
      teks nama adalah "Global"
      fungsi ubah(teks nama)
          tampilkan nama
      selesai
      ubah("Lokal")
      tampilkan nama
    `,
    expected: ["Lokal", "Global"],
  },
  {
    name: "Error Runtime: Fungsi Parameter Type Mismatch",
    code: `
      fungsi angkaSaja(angka x)
          tampilkan x
      selesai
      angkaSaja("salah")
    `,
    expectedError: "Argumen ke-1 tidak cocok. Fungsi \"angkaSaja\" mengharapkan parameter \"x\" bernilai tipe \"angka\", tetapi Anda memberikan tipe \"string\"",
  },
  {
    name: "Fungsi Kembalikan Nilai",
    code: `
      fungsi jumlah(angka a, angka b)
          kembalikan a + b
      selesai
      angka hasil adalah jumlah(100, 200)
      tampilkan hasil
    `,
    expected: [300],
  },
  {
    name: "Fungsi Early Return",
    code: `
      fungsi cekPositif(angka x)
          jika x < 0 maka
              tampilkan "Negatif"
              kembalikan "Selesai"
          selesai
          tampilkan "Positif"
          kembalikan "Selesai"
      selesai
      cekPositif(-5)
      cekPositif(10)
    `,
    expected: ["Negatif", "Positif"],
  },
  {
    name: "Fungsi Kembalikan Ekspresi Kompleks",
    code: `
      fungsi gabung(teks teksA, teks teksB)
          kembalikan teksA + " " + teksB
      selesai
      tampilkan gabung("Halo", "Dunia")
    `,
    expected: ["Halo Dunia"],
  },
  {
    name: "Error Runtime: Fungsi Belum Dibuat",
    code: `
      panggilFungsiGaib()
    `,
    expectedError: "Error Runtime [Baris 2]: Fungsi \"panggilFungsiGaib\" belum dibuat. Silakan buat fungsi ini terlebih dahulu menggunakan perintah: fungsi panggilFungsiGaib(...)",
  },
  {
    name: "Error Runtime: Return Di Luar Fungsi",
    code: `
      kembalikan 10
    `,
    expectedError: "Error Runtime [Baris 2]: Perintah \"kembalikan\" hanya dapat ditulis di dalam fungsi.",
  },
  {
    name: "Pemisah Titik Koma Semicolon",
    code: `
      angka a adalah 5; angka b adalah 10;
      tampilkan a + b;
      jika a < b maka
          tampilkan "A kurang dari B";
      selesai;
    `,
    expected: [15, "A kurang dari B"],
  },
  {
    name: "Sinonim Operator Perbandingan",
    code: `
      angka x adalah 10;
      jika x adalah 10 maka tampilkan "adalah"; selesai
      jika x sama dengan 10 maka tampilkan "sama dengan"; selesai
      jika x bukan 5 maka tampilkan "bukan"; selesai
      jika x lebih dari 5 maka tampilkan "lebih dari"; selesai
      jika x kurang dari 15 maka tampilkan "kurang dari"; selesai
      jika x minimal 10 maka tampilkan "minimal"; selesai
      jika x maksimal 10 maka tampilkan "maksimal"; selesai
    `,
    expected: ["adalah", "sama dengan", "bukan", "lebih dari", "kurang dari", "minimal", "maksimal"],
  },
  {
    name: "Penulisan Komentar (# dan //)",
    code: `
      # Ini adalah komentar pagar
      angka x adalah 100 // Ini adalah komentar double slash
      // Komentar baris penuh
      tampilkan x
    `,
    expected: [100],
  }
];

let passed = 0;

for (const t of tests) {
  const output = [];
  try {
    const lexer = new Lexer(t.code);
    const tokens = lexer.tokenize();
    const parser = new Parser(tokens);
    const ast = parser.parse();
    const interpreter = new Interpreter(ast, (val) => output.push(val));
    interpreter.run();

    if (t.expectedError) {
      console.log(`❌ Fail: ${t.name} (Diharapkan error "${t.expectedError}", tapi sukses)`);
    } else {
      const match = JSON.stringify(output) === JSON.stringify(t.expected);
      if (match) {
        console.log(`✅ Pass: ${t.name}`);
        passed++;
      } else {
        console.log(`❌ Fail: ${t.name} (Hasil: ${JSON.stringify(output)}, Diharapkan: ${JSON.stringify(t.expected)})`);
      }
    }
  } catch (err) {
    if (t.expectedError && err.message.includes(t.expectedError)) {
      console.log(`✅ Pass: ${t.name} (Error sesuai: ${err.message})`);
      passed++;
    } else {
      console.log(`❌ Fail: ${t.name} (Eror tidak terduga: ${err.message})`);
    }
  }
}

console.log(`\nHasil: ${passed}/${tests.length} pengujian berhasil.`);
if (passed !== tests.length) {
  process.exit(1);
}
