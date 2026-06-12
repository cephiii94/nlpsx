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
    expectedError: "Error Runtime: Variabel \"nama_baru\" belum dideklarasikan",
  },
  {
    name: "Error Sintaks: Kurang Keyword maka",
    code: `
      jika 5 > 3
          tampilkan "OK"
    `,
    expectedError: "Error Sintaks: Mengharapkan token tipe \"THEN\"",
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
