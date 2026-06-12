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
    name: "Kondisi jika-maka Salah dengan Selain",
    code: `
      buat angka umur = 10
      jika umur > 18 maka
          tampilkan "Dewasa"
      selain
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
