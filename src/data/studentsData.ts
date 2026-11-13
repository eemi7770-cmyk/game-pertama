import { Student, SchoolInfo, StudentScore } from '../types';

export const INITIAL_STUDENTS: Student[] = [
  { id: 1, no: 1, name: "ABQARI THUFAILAH" },
  { id: 2, no: 2, name: "ADILA NISA ARDANI" },
  { id: 3, no: 3, name: "ALYA NAILA PUTRI" },
  { id: 4, no: 4, name: "AMBARWATI" },
  { id: 5, no: 5, name: "ASYISYIFA RIZKA" },
  { id: 6, no: 6, name: "ANDRA FRATAMA" },
  { id: 7, no: 7, name: "ENO GITARA" },
  { id: 8, no: 8, name: "KITYA DWI RAMADHANI" },
  { id: 9, no: 9, name: "MUHAMMAD RAFFI HARIANSYAH" },
  { id: 10, no: 10, name: "MUHAMMAD ZINAN FAYI" },
  { id: 11, no: 11, name: "NUFAIL AMMAR ATHALLAH" },
  { id: 12, no: 12, name: "NUR ASYIFA" },
  { id: 13, no: 13, name: "RAHMAT AL FAJAR" },
  { id: 14, no: 14, name: "REFANDO RIZQI PARHAT AZIZ" },
  { id: 15, no: 15, name: "RISMA HASANAH" },
  { id: 16, no: 16, name: "SETIAWATI" },
  { id: 17, no: 17, name: "SILMI ASILAH" },
  { id: 18, no: 18, name: "SITI ADIBA ADAWIYAH" },
  { id: 19, no: 19, name: "SITI MARDIRA AZZAHRA" },
  { id: 20, no: 20, name: "SITI ZAHWA" },
  { id: 21, no: 21, name: "SYANNY" },
  { id: 22, no: 22, name: "TRIVA JUNIA RAMADANI" },
  { id: 23, no: 23, name: "HERO ADI PUTRA" },
  { id: 24, no: 24, name: "NAJWA ANGGELA" },
  { id: 25, no: 25, name: "MUHAMMAD RIDHO PRIANDA" },
];

export const DEFAULT_SCHOOL_INFO: SchoolInfo = {
  schoolName: "SD NEGERI 01 MEKAR SARI",
  className: "Kelas V (Lima)",
  teacherName: "Emi, S.Pd.",
  teacherNip: "19880517 201101 2 003",
  principalName: "Drs. H. Mulyadi, M.Pd.",
  principalNip: "19720315 199803 1 004",
  academicYear: "2024 / 2025",
  semester: "Genap",
  kkm: 75,
};

// Seed realistic initial score records so teacher report has immediately visible data
export const generateInitialScores = (): StudentScore[] => {
  return INITIAL_STUDENTS.map((student, idx) => {
    // Let 12 students already have sample completed scores, others pending
    if (idx < 12) {
      const correct = 8 + (idx % 3);
      const wrong = 10 - correct;
      const score = Math.round((correct / 10) * 100);
      return {
        studentId: student.id,
        studentName: student.name,
        hasPlayed: true,
        score,
        correctCount: correct,
        wrongCount: wrong,
        tilesReached: 50,
        finished: true,
        durationSeconds: 320 + idx * 25,
        completedAt: new Date(Date.now() - (idx + 1) * 3600000).toLocaleString('id-ID', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        notes: score >= 85 ? "Sangat Menguasai Materi Daur Air" : score >= 75 ? "Tuntas Memenuhi KKM" : "Perlu Bimbingan Tambahan",
      };
    }

    return {
      studentId: student.id,
      studentName: student.name,
      hasPlayed: false,
      score: 0,
      correctCount: 0,
      wrongCount: 0,
      tilesReached: 1,
      finished: false,
      durationSeconds: 0,
      notes: "Belum Mengerjakan",
    };
  });
};
