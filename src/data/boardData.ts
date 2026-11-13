import { LadderSnake } from '../types';

export const TOTAL_TILES = 50;
export const BOARD_COLUMNS = 10;
export const BOARD_ROWS = 5;

export const LADDERS_AND_SNAKES: LadderSnake[] = [
  // TANGGA KEBAIKAN AIR
  {
    start: 4,
    end: 16,
    type: 'ladder',
    label: 'Reboisasi & Menanam Pohon',
    description: 'Akar pohon menyerap banyak air hujan! Kamu naik dari petak 4 ke 16!',
    iconName: 'Trees'
  },
  {
    start: 10,
    end: 24,
    type: 'ladder',
    label: 'Membuat Lubang Biopori',
    description: 'Resapan air tanah meningkat pesat! Melompat dari petak 10 ke 24!',
    iconName: 'Droplet'
  },
  {
    start: 19,
    end: 32,
    type: 'ladder',
    label: 'Gotong Royong Bersih Sungai',
    description: 'Sungai kembali bersih dan jernih! Naik tangga dari petak 19 ke 32!',
    iconName: 'Sparkles'
  },
  {
    start: 28,
    end: 40,
    type: 'ladder',
    label: 'Memperbaiki Pipa Kran Bocor',
    description: 'Berhasil menghemat ratusan liter air! Melesat dari petak 28 ke 40!',
    iconName: 'Wrench'
  },
  {
    start: 37,
    end: 48,
    type: 'ladder',
    label: 'Penampungan Air Bersih Alami',
    description: 'Cadangan air tawar aman! Naik cepat dari petak 37 ke petak 48!',
    iconName: 'ShieldCheck'
  },

  // ULAR PENCEMARAN & PEMBOROSAN
  {
    start: 17,
    end: 6,
    type: 'snake',
    label: 'Buang Limbah ke Sungai',
    description: 'Air beracun dan ikan mati! Terpeleset turun dari petak 17 ke 6!',
    iconName: 'Skull'
  },
  {
    start: 25,
    end: 13,
    type: 'snake',
    label: 'Kran Dibiarkan Mengalir Meluap',
    description: 'Air bersih terbuang sia-sia! Meluncur turun dari petak 25 ke 13!',
    iconName: 'AlertTriangle'
  },
  {
    start: 35,
    end: 22,
    type: 'snake',
    label: 'Penebangan Hutan Secara Liar',
    description: 'Resapan air hilang dan tanah longsor! Turun dari petak 35 ke 22!',
    iconName: 'Axe'
  },
  {
    start: 43,
    end: 27,
    type: 'snake',
    label: 'Pencemaran Sumur Warga',
    description: 'Air keruh dan berbau tidak sedap! Meluncur turun dari petak 43 ke 27!',
    iconName: 'Biohazard'
  },
  {
    start: 49,
    end: 33,
    type: 'snake',
    label: 'Tumpukan Sampah Plastik Menutup Parit',
    description: 'Banjir besar terjadi tepat di depan garis finish! Turun ke petak 33!',
    iconName: 'Trash2'
  }
];

export const QUIZ_TILES = [3, 7, 11, 15, 21, 26, 30, 36, 42, 46];

// Helper to calculate coordinates for boustrophedon (zig-zag) layout
// Row 0 is at bottom (tiles 1-10 left-to-right)
// Row 1 (tiles 20-11 right-to-left)
// Row 2 (tiles 21-30 left-to-right)
// Row 3 (tiles 40-31 right-to-left)
// Row 4 (tiles 41-50 left-to-right)
export const getTileCoordinates = (tileNum: number) => {
  const zeroIndexed = tileNum - 1;
  const row = Math.floor(zeroIndexed / BOARD_COLUMNS); // 0 to 4
  const colInRow = zeroIndexed % BOARD_COLUMNS; // 0 to 9
  
  // If row is odd, it goes right to left
  const col = row % 2 === 0 ? colInRow : (BOARD_COLUMNS - 1 - colInRow);
  
  return {
    row, // from bottom
    col, // 0 to 9 from left
  };
};
