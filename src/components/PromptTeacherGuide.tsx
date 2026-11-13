import React, { useState } from 'react';
import { Copy, Check, Sparkles, BookOpen, FileCheck, Layers, ExternalLink } from 'lucide-react';
import { SchoolInfo } from '../types';

interface PromptTeacherGuideProps {
  schoolInfo: SchoolInfo;
}

export const PromptTeacherGuide: React.FC<PromptTeacherGuideProps> = ({ schoolInfo }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey(null);
    }, 2000);
  };

  const MASTER_PROMPT = `Sebagai ahli pedagogi dan pengembang media pembelajaran interaktif Kurikulum Merdeka, buatkan aplikasi media pembelajaran berbasis Gamifikasi Game Ular Tangga untuk mata pelajaran Ilmu Pengetahuan Alam dan Sosial (IPAS) Kelas 5 SD Fase C dengan tema 'Air Sumber Kehidupan dan Daur Air'.

Kriteria dan Struktur Wajib:
1. Bahan Bacaan Terlebih Dahulu:
   - Sediakan bahan bacaan literasi sains interaktif yang ramah anak kelas 5 SD sebelum permainan dimulai.
   - Muat sub-materi: Pentingnya air bagi makhluk hidup, 6 tahapan daur air (Evaporasi, Transpirasi, Kondensasi, Presipitasi, Infiltrasi, Limpasan), jenis-jenis sumber air bersih, serta aksi nyata pencegahan pencemaran dan konservasi air.
   - Fitur suara narasi (Text-to-Speech audio narator bahasa Indonesia) dengan tombol dengarkan bacaan dan kontrol kecepatan bicara.

2. Game Ular Tangga Interaktif (50 Petak):
   - Papan petak 1 sampai 50 dengan lintasan ular tangga bertema air.
   - Tangga Kebaikan Air (misal: menanam pohon, biopori, gotong royong bersih sungai, perbaiki kran bocor).
   - Ular Pencemaran (misal: membuang limbah ke sungai, kran meluap, penebangan hutan liar, sampah plastik parit).
   - Petak Tantangan Kuis IPAS: memunculkan soal pilihan ganda dengan fitur suara bacakan soal dan pembahasan edukatif.
   - Dadu 3D bersuara dan animasi pion tetes air.

3. Integrasi Data 25 Siswa Kelas 5:
   - Daftar 25 siswa:
     1. ABQARI THUFAILAH
     2. ADILA NISA ARDANI
     3. ALYA NAILA PUTRI
     4. AMBARWATI
     5. ASYISYIFA RIZKA
     6. ANDRA FRATAMA
     7. ENO GITARA
     8. KITYA DWI RAMADHANI
     9. MUHAMMAD RAFFI HARIANSYAH
     10. MUHAMMAD ZINAN FAYI
     11. NUFAIL AMMAR ATHALLAH
     12. NUR ASYIFA
     13. RAHMAT AL FAJAR
     14. REFANDO RIZQI PARHAT AZIZ
     15. RISMA HASANAH
     16. SETIAWATI
     17. SILMI ASILAH
     18. SITI ADIBA ADAWIYAH
     19. SITI MARDIRA AZZAHRA
     20. SITI ZAHWA
     21. SYANNY
     22. TRIVA JUNIA RAMADANI
     23. HERO ADI PUTRA
     24. NAJWA ANGGELA
     25. MUHAMMAD RIDHO PRIANDA
   - Pengaturan nama sekolah (${schoolInfo.schoolName}), kelas (${schoolInfo.className}), dan guru pengampu (${schoolInfo.teacherName}).

4. Buku Laporan Nilai Guru (Asesmen Formatif):
   - Rekap nilai otomatis untuk 25 siswa lengkap dengan skor (0-100), jumlah benar/salah, status ketuntasan (KKM ${schoolInfo.kkm}), predikat capaian, dan catatan guru.
   - Fitur Cetak Laporan / PDF resmi dengan Kop Surat dan tanda tangan Kepala Sekolah & Guru.
   - Fitur Ekspor data ke spreadsheet CSV / Excel.`;

  const MODUL_AJAR = `MODUL AJAR KURIKULUM MERDEKA (GAME-BASED LEARNING)
Mata Pelajaran : IPAS (Ilmu Pengetahuan Alam dan Sosial)
Fase / Kelas   : Fase C / Kelas V (Lima)
Alokasi Waktu  : 2 x 35 Menit (1 Pertemuan)
Topik          : Air Sumber Kehidupan & Siklus Daur Air

A. CAPAIAN PEMBELAJARAN (CP):
Peserta didik dapat mengidentifikasi keterkaitan antara sistem organ tubuh dengan kebutuhan cairan serta menganalisis daur air dan pengaruh aktivitas manusia terhadap ketersediaan air bersih di bumi.

B. TUJUAN PEMBELAJARAN (TP):
1. Melalui bahan bacaan interaktif bersuara, peserta didik dapat menguraikan tahapan daur air (evaporasi, transpirasi, kondensasi, presipitasi, dan infiltrasi) secara runtut.
2. Melalui game ular tangga kuis, peserta didik dapat menganalisis tindakan positif penghematan air serta bahaya pencemaran air secara kritis.
3. Peserta didik menunjukkan sikap kerja sama dan kejujuran saat bermain dalam kelompok.

C. PROFIL PELAJAR PANCASILA:
- Beriman, Bertakwa kepada Tuhan YME dan Berakhlak Mulia (Menjaga alam dan lingkungan sekitar)
- Bernalar Kritis (Menganalisis sebab-akibat pencemaran air)
- Gotong Royong (Bermain giliran dan berdiskusi memecahkan soal kuis)

D. KEGIATAN PEMBELAJARAN:
1. Pendahuluan (10 Menit): Guru menyapa, berdoa, presensi 25 siswa, dan apersepsi 'Dari manakah asal air hujan?'.
2. Kegiatan Inti (50 Menit):
   - Siswa menyimak bahan bacaan interaktif di aplikasi dan mendengarkan audio narasi daur air.
   - Siswa dibagi menjadi kelompok kecil atau bergantian bermain Game Ular Tangga Air.
   - Setiap siswa melempar dadu dan menjawab soal kuis pada petak tantangan dengan fitur suara.
3. Penutup (10 Menit):
   - Refleksi bersama dan pemberian apresiasi kepada seluruh siswa.
   - Guru memeriksa rekapitulasi pada menu Laporan Nilai Guru dan mencetak hasil asesmen formatif.`;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-sky-100 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
              Dokumen Perangkat Ajar & Salinan Prompt
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-800 mt-1">
            Prompt Master & Modul Ajar IPAS Kelas 5
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Dapat disalin untuk arsip RPP, instrumen akreditasi guru, atau pengembangan materi selanjutnya.
          </p>
        </div>
      </div>

      {/* Card 1: Master Prompt Generator */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-sky-100 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-100 rounded-xl text-emerald-700">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-800 text-base sm:text-lg">
                1. Teks Prompt Master AI (Salin untuk Guru)
              </h3>
              <p className="text-xs text-slate-500">
                Gunakan teks ini untuk mereplikasi atau memperluas media pembelajaran di platform AI
              </p>
            </div>
          </div>

          <button
            onClick={() => copyToClipboard(MASTER_PROMPT, 'prompt')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all"
          >
            {copiedKey === 'prompt' ? (
              <>
                <Check className="w-4 h-4" />
                <span>Tersalin!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Salin Prompt</span>
              </>
            )}
          </button>
        </div>

        <div className="relative">
          <pre className="p-4 rounded-2xl bg-slate-900 text-emerald-300 font-mono text-xs overflow-x-auto whitespace-pre-wrap max-h-72 leading-relaxed">
            {MASTER_PROMPT}
          </pre>
        </div>
      </div>

      {/* Card 2: Modul Ajar Kurikulum Merdeka */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-sky-100 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-sky-100 rounded-xl text-sky-700">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-800 text-base sm:text-lg">
                2. Modul Ajar & Skenario Gamifikasi (RPP 1 Lembar)
              </h3>
              <p className="text-xs text-slate-500">
                Lengkap dengan Capaian Pembelajaran (CP), Alur Tujuan Pembelajaran (ATP), dan sintaks pembelajaran
              </p>
            </div>
          </div>

          <button
            onClick={() => copyToClipboard(MODUL_AJAR, 'modul')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-sm transition-all"
          >
            {copiedKey === 'modul' ? (
              <>
                <Check className="w-4 h-4" />
                <span>Tersalin!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Salin Modul</span>
              </>
            )}
          </button>
        </div>

        <div className="relative">
          <pre className="p-4 rounded-2xl bg-slate-50 text-slate-800 font-sans text-xs border border-slate-200 overflow-x-auto whitespace-pre-wrap max-h-80 leading-relaxed">
            {MODUL_AJAR}
          </pre>
        </div>
      </div>
    </div>
  );
};
