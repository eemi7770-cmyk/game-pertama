import { Question } from '../types';

export const IPAS_QUESTIONS: Question[] = [
  {
    id: 1,
    question: "Peristiwa penguapan air di laut, danau, dan sungai ke udara akibat panas matahari dinamakan...",
    options: ["Evaporasi", "Kondensasi", "Presipitasi", "Infiltrasi"],
    correctIndex: 0,
    explanation: "Evaporasi adalah proses perubahan air dari wujud cair menjadi gas (uap air) yang naik ke atmosfer karena energi panas matahari.",
    category: "daur-air",
    difficulty: "mudah"
  },
  {
    id: 2,
    question: "Pada tumbuhan, proses pengeluaran uap air ke udara melalui mulut daun (stomata) disebut...",
    options: ["Respirasi", "Transpirasi", "Fotosintesis", "Kondensasi"],
    correctIndex: 1,
    explanation: "Transpirasi adalah proses penguapan air yang berasal dari jaringan makhluk hidup, khususnya tumbuhan melalui stomata daun.",
    category: "daur-air",
    difficulty: "sedang"
  },
  {
    id: 3,
    question: "Uap air yang naik ke atmosfer mengalami pendinginan dan berubah menjadi butiran air kecil pembentuk awan. Proses ini dinamakan...",
    options: ["Evaporasi", "Infiltrasi", "Kondensasi", "Presipitasi"],
    correctIndex: 2,
    explanation: "Kondensasi atau pengembunan terjadi ketika uap air yang naik mendingin pada suhu rendah di atmosfer, membentuk kumpulan titik air yang kita kenal sebagai awan.",
    category: "daur-air",
    difficulty: "mudah"
  },
  {
    id: 4,
    question: "Peristiwa turunnya titik-titik air dari awan menuju ke permukaan bumi dalam bentuk hujan disebut...",
    options: ["Presipitasi", "Kondensasi", "Evaporasi", "Transpirasi"],
    correctIndex: 0,
    explanation: "Presipitasi adalah segala bentuk curahan air dari atmosfer ke permukaan bumi, seperti hujan air, embun, hujan es, atau salju.",
    category: "daur-air",
    difficulty: "mudah"
  },
  {
    id: 5,
    question: "Sebagian air hujan yang jatuh ke permukaan bumi akan meresap ke dalam pori-pori tanah. Proses ini disebut...",
    options: ["Limpasan", "Infiltrasi", "Evaporasi", "Sublimasi"],
    correctIndex: 1,
    explanation: "Infiltrasi adalah proses meresapnya air hujan ke dalam lapisan tanah melalui pori-pori tanah dan bebatuan, yang nantinya menjadi cadangan air tanah.",
    category: "daur-air",
    difficulty: "sedang"
  },
  {
    id: 6,
    question: "Mengapa air di bumi tidak pernah habis meskipun digunakan setiap hari oleh manusia, hewan, dan tumbuhan?",
    options: [
      "Karena manusia selalu membuat air baru di laboratorium",
      "Karena air mengalami daur atau siklus hidrologi secara terus menerus",
      "Karena air laut terus bertambah dari luar angkasa",
      "Karena air tidak bisa menguap di bumi"
    ],
    correctIndex: 1,
    explanation: "Jumlah total air di bumi relatif tetap karena air mengalami siklus hidrologi (daur air) yang berputar tiada henti antara bumi dan atmosfer.",
    category: "daur-air",
    difficulty: "mudah"
  },
  {
    id: 7,
    question: "Bagi tumbuhan hijau, air memiliki peranan yang sangat penting, terutama sebagai bahan utama proses...",
    options: ["Gugur daun", "Fotosintesis", "Penyerbukan", "Pembuahan"],
    correctIndex: 1,
    explanation: "Air diserap oleh akar tumbuhan lalu dibawa ke daun sebagai bahan utama fotosintesis (membuat makanan sendiri) bersama gas karbon dioksida dan cahaya matahari.",
    category: "fungsi-air",
    difficulty: "mudah"
  },
  {
    id: 8,
    question: "Ciri-ciri air bersih yang sehat dan aman untuk digunakan sehari-hari adalah...",
    options: [
      "Berwarna kekuningan dan berbau harum",
      "Tidak berwarna (jernih), tidak berbau, dan tidak berasa",
      "Memiliki rasa manis dan bergelembung",
      "Mengandung banyak endapan lumpur"
    ],
    correctIndex: 1,
    explanation: "Syarat fisik air bersih adalah jernih (tidak berwarna), tidak berbau, tidak berasa (tawar), dan suhunya sejuk atau normal.",
    category: "sumber-air",
    difficulty: "mudah"
  },
  {
    id: 9,
    question: "Tindakan berikut ini yang merupakan contoh perilaku boros air dan harus kita hindari adalah...",
    options: [
      "Mematikan kran air saat sedang menyikat gigi",
      "Menyiram tanaman dengan air sisa mencuci beras",
      "Membiarkan kran wastafel terus mengalir saat mencuci tangan",
      "Mandi menggunakan pancuran (shower) hemat air"
    ],
    correctIndex: 2,
    explanation: "Membiarkan kran wastafel terus mengucur deras dapat membuang belasan liter air bersih secara sia-sia.",
    category: "kelestarian",
    difficulty: "mudah"
  },
  {
    id: 10,
    question: "Penebangan pohon di hutan secara liar (deforestasi) dapat berdampak buruk terhadap siklus air, yaitu...",
    options: [
      "Menyebabkan air tanah semakin melimpah ruah",
      "Mengurangi kemampuan tanah menyerap air sehingga memicu banjir dan kekeringan",
      "Membuat hujan turun setiap hari tanpa henti",
      "Menjadikan udara terasa semakin sejuk dan segar"
    ],
    correctIndex: 1,
    explanation: "Akar-akar pohon berfungsi mengikat butir tanah dan menyerap air hujan ke dalam tanah. Jika hutan gundul, air hujan tidak terserap melainkan langsung mengalir memicu banjir dan longsor.",
    category: "kelestarian",
    difficulty: "sedang"
  },
  {
    id: 11,
    question: "Pembuatan lubang resapan biopori di pekarangan rumah dan sekolah sangat bermanfaat untuk...",
    options: [
      "Membakar sampah plastik",
      "Membantu penyerapan air hujan ke tanah dan mencegah genangan air",
      "Tempat membuang limbah sabun",
      "Mengurangi jumlah oksigen di dalam tanah"
    ],
    correctIndex: 1,
    explanation: "Lubang biopori meningkatkan daya resap air hujan ke dalam tanah sehingga mencegah banjir serta mengisi kembali cadangan air tanah.",
    category: "kelestarian",
    difficulty: "sedang"
  },
  {
    id: 12,
    question: "Air yang keluar secara alami dari lapisan batuan di lereng gunung atau bukit dan biasanya terasa sangat jernih serta sejuk dinamakan...",
    options: ["Air limbah", "Mata air", "Air rawa", "Air got"],
    correctIndex: 1,
    explanation: "Mata air adalah air tanah yang keluar dengan sendirinya ke permukaan tanah karena tekanan hidrostatik alami.",
    category: "sumber-air",
    difficulty: "mudah"
  },
  {
    id: 13,
    question: "Sebagian besar cairan di dalam tubuh manusia terdiri atas air, yaitu sekitar...",
    options: ["10 - 20%", "30 - 40%", "60 - 70%", "95 - 99%"],
    correctIndex: 2,
    explanation: "Tubuh manusia tersusun atas sekitar 60% hingga 70% air, yang berperan penting dalam sirkulasi darah, pencernaan, dan pengaturan suhu tubuh.",
    category: "fungsi-air",
    difficulty: "sedang"
  },
  {
    id: 14,
    question: "Jika air sungai tercemar oleh limbah detergen dan sampah plastik pabrik, dampak langsung bagi kehidupan perairan adalah...",
    options: [
      "Populasi ikan dan tumbuhan air akan mati kekurangan oksigen",
      "Sungai menjadi tempat wisata yang disukai banyak orang",
      "Ikan bertelur lebih banyak dan bertubuh gemuk",
      "Air sungai menjadi lebih harum dan aman diminum"
    ],
    correctIndex: 0,
    explanation: "Limbah kimia dan sampah menutup permukaan air, memicu pertumbuhan alga berbahaya dan menghabiskan oksigen terlarut sehingga hewan air mati.",
    category: "kelestarian",
    difficulty: "mudah"
  },
  {
    id: 15,
    question: "Aliran air yang mengalir di atas permukaan tanah menuju ke tempat yang lebih rendah seperti parit, sungai, dan danau disebut...",
    options: ["Limpasan permukaan (Runoff)", "Transpirasi", "Kondensasi", "Sublimasi"],
    correctIndex: 0,
    explanation: "Limpasan permukaan (surface runoff) adalah air hujan yang tidak meresap ke tanah dan mengalir di atas permukaan tanah menuju sungai dan laut.",
    category: "daur-air",
    difficulty: "menantang"
  },
  {
    id: 16,
    question: "Sumber energi utama yang menggerakkan seluruh proses daur air di bumi adalah...",
    options: ["Angin kencang", "Energi panas matahari", "Gravitasi bulan", "Panas api gunung berapi"],
    correctIndex: 1,
    explanation: "Sinar dan energi panas matahari adalah motor utama penggerak daur air, memanaskan air laut dan daratan untuk menguap ke angkasa.",
    category: "daur-air",
    difficulty: "mudah"
  },
  {
    id: 17,
    question: "Air tanah biasanya lebih bersih dan jernih dibanding air permukaan karena...",
    options: [
      "Telah disaring secara alami oleh lapisan pasir, kerikil, dan batuan di dalam tanah",
      "Dicampur dengan zat pemutih kimia oleh cacing",
      "Tidak pernah terkena sinar matahari",
      "Berasal dari air mineral kemasan"
    ],
    correctIndex: 0,
    explanation: "Saat air hujan meresap ke dalam tanah, lapisan pasir dan batuan bertindak sebagai saringan alami yang menahan kotoran dan partikel lumpur.",
    category: "sumber-air",
    difficulty: "sedang"
  },
  {
    id: 18,
    question: "Manakah cara berikut yang tepat untuk menghemat penggunaan air bersih di rumah?",
    options: [
      "Mencuci sepeda motor dengan selang air mengalir nonstop selama 1 jam",
      "Menampung air cucian sayur atau buah untuk menyiram bunga di kebun",
      "Membiarkan bak mandi meluap-luap sampai tumpah ke lantai",
      "Menyiram halaman aspal dengan air bersih yang banyak"
    ],
    correctIndex: 1,
    explanation: "Memanfaatkan kembali air bekas cucian buah atau sayuran untuk menyiram tanaman adalah contoh bijak pemanfaatan air (reuse).",
    category: "kelestarian",
    difficulty: "mudah"
  }
];
