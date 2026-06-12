const Lexer = require("../src/lexer/lexer");
const Parser = require("../src/parser/parser");
const Interpreter = require("../src/interpreter/interpreter");

const tests = [
  {
    name: "Deklarasi dan Tampilkan Teks",
    code: `
      buat teks nama = "Budi"
      tampilkan nama
    `,
    expected: ["Budi"],
  },
  {
    name: "Penjumlahan Angka",
    code: `
      buat angka a = 5
      buat angka b = 10
      buat angka c = a + b
      tampilkan c
    `,
    expected: [15],
  },
  {
    name: "Kondisi jika-maka Benar",
    code: `
      buat angka umur = 20
      jika umur > 18 maka
          tampilkan "Dewasa"
    `,
    expected: ["Dewasa"],
  },
  {
    name: "Kondisi jika-maka Salah dengan Jika Tidak",
    code: `
      buat angka umur = 10
      jika umur > 18 maka
          tampilkan "Dewasa"
      jika tidak
          tampilkan "Anak-anak"
    `,
    expected: ["Anak-anak"],
  },
  {
    name: "Error Runtime: Variabel Belum Dideklarasikan",
    code: `
      tampilkan nama_baru
    `,
    expectedError: "Error Runtime [Baris 2]: Variabel \"nama_baru\" belum dibuat",
  },
  {
    name: "Error Sintaks: Kurang Keyword maka",
    code: `
      jika 5 > 3
          tampilkan "OK"
    `,
    expectedError: "Error Sintaks [di Baris 3, Kolom 11]: Mengharapkan simbol atau kata kunci \"THEN\"",
  },
  {
    name: "Angka Desimal & Uner Negatif",
    code: `
      buat angka a = 3.5
      buat angka b = -1.5
      buat angka c = a + b
      tampilkan c
    `,
    expected: [2],
  },
  {
    name: "String Escape Characters",
    code: `
      buat teks s = "Halo\\t\\"Budi\\"\\nKabar Baik"
      tampilkan s
    `,
    expected: ["Halo\t\"Budi\"\nKabar Baik"],
  },
  {
    name: "Error Runtime: Type Mismatch Angka diisi Teks",
    code: `
      buat angka var_salah = "Halo"
    `,
    expectedError: "Error Runtime [Baris 2]: Tipe data tidak cocok. Variabel \"var_salah\" dideklarasikan sebagai \"angka\", tetapi Anda mengisinya dengan tipe \"string\"",
  },
  {
    name: "Error Runtime: Type Mismatch Teks diisi Boolean",
    code: `
      buat teks var_salah = benar
    `,
    expectedError: "Error Runtime [Baris 2]: Tipe data tidak cocok. Variabel \"var_salah\" dideklarasikan sebagai \"teks\", tetapi Anda mengisinya dengan tipe \"boolean\"",
  },
  {
    name: "Error Runtime: Type Mismatch Boolean diisi Angka",
    code: `
      buat boolean var_salah = 12
    `,
    expectedError: "Error Runtime [Baris 2]: Tipe data tidak cocok. Variabel \"var_salah\" dideklarasikan sebagai \"boolean\", tetapi Anda mengisinya dengan tipe \"number\"",
  },
  {
    name: "Perulangan Dasar",
    code: `
      buat angka i = 1
      selama i <= 3 lakukan
      {
          tampilkan i
          i = i + 1
      }
    `,
    expected: [1, 2, 3],
  },
  {
    name: "Error Runtime: Re-assignment Tipe Data Tidak Cocok",
    code: `
      buat angka i = 1
      i = "salah"
    `,
    expectedError: "Error Runtime [Baris 3]: Tipe data tidak cocok. Variabel \"i\" dideklarasikan sebagai \"angka\", tetapi Anda mengisinya dengan tipe \"string\"",
  },
  {
    name: "Error Runtime: Re-assignment Variabel Belum Dibuat",
    code: `
      x = 5
    `,
    expectedError: "Error Runtime [Baris 2]: Variabel \"x\" belum dibuat. Silakan buat terlebih dahulu menggunakan \"buat\"",
  },
  {
    name: "Error Sintaks: Kurang Keyword lakukan",
    code: `
      buat angka i = 1
      selama i <= 5
          tampilkan i
    `,
    expectedError: "Tips: Anda menulis pernyataan perulangan \"selama\" tetapi lupa menulis kata kunci \"lakukan\" setelah kondisi",
  },
  {
    name: "Error Sintaks: Blok Kurang Tutup Kurawal",
    code: `
      buat angka i = 1
      selama i <= 5 lakukan
      {
          tampilkan i
          i = i + 1
    `,
    expectedError: "Tips: Pastikan Anda menutup blok perulangan/kondisi dengan kurung kurawal tutup \"}\"",
  },
  {
    name: "Error Sintaks: Kurang Kondisi Perulangan",
    code: `
      selama lakukan
          tampilkan 1
    `,
    expectedError: "Tips: Anda menulis \"selama\" diikuti langsung oleh \"lakukan\". Pastikan Anda menulis kondisi perulangan (seperti \"i <= 5\") di antara keduanya",
  },
  {
    name: "Fungsi Tanpa Parameter",
    code: `
      fungsi halo()
      {
          tampilkan "Halo Dunia!"
      }
      halo()
    `,
    expected: ["Halo Dunia!"],
  },
  {
    name: "Fungsi Dengan Parameter",
    code: `
      fungsi tambah(angka a, angka b)
      {
          tampilkan a + b
      }
      tambah(10, 20)
    `,
    expected: [30],
  },
  {
    name: "Fungsi Scope Isolation",
    code: `
      buat teks nama = "Global"
      fungsi ubah(teks nama)
      {
          tampilkan nama
      }
      ubah("Lokal")
      tampilkan nama
    `,
    expected: ["Lokal", "Global"],
  },
  {
    name: "Error Runtime: Fungsi Parameter Type Mismatch",
    code: `
      fungsi angkaSaja(angka x)
      {
          tampilkan x
      }
      angkaSaja("salah")
    `,
    expectedError: "Argumen ke-1 tidak cocok. Fungsi \"angkaSaja\" mengharapkan parameter \"x\" bernilai tipe \"angka\", tetapi Anda memberikan tipe \"string\"",
  },
  {
    name: "Fungsi Kembalikan Nilai",
    code: `
      fungsi jumlah(angka a, angka b)
      {
          kembalikan a + b
      }
      buat angka hasil = jumlah(100, 200)
      tampilkan hasil
    `,
    expected: [300],
  },
  {
    name: "Fungsi Early Return",
    code: `
      fungsi cekPositif(angka x)
      {
          jika x < 0 maka
          {
              tampilkan "Negatif"
              kembalikan "Selesai"
          }
          tampilkan "Positif"
          kembalikan "Selesai"
      }
      cekPositif(-5)
      cekPositif(10)
    `,
    expected: ["Negatif", "Positif"],
  },
  {
    name: "Fungsi Kembalikan Ekspresi Kompleks",
    code: `
      fungsi gabung(teks teksA, teks teksB)
      {
          kembalikan teksA + " " + teksB
      }
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
