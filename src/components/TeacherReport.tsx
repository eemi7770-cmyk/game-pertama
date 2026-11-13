import React, { useState } from 'react';
import { 
  Printer, 
  Download, 
  Search, 
  Filter, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Award, 
  Users, 
  TrendingUp, 
  Sparkles,
  Edit2,
  Trash2,
  Save,
  X,
  School,
  Calendar,
  FileSpreadsheet
} from 'lucide-react';
import { Student, StudentScore, SchoolInfo } from '../types';

interface TeacherReportProps {
  students: Student[];
  scores: StudentScore[];
  schoolInfo: SchoolInfo;
  onUpdateScore: (updatedScore: StudentScore) => void;
  onResetAllScores: () => void;
  onAutoPopulateDemoScores: () => void;
}

export const TeacherReport: React.FC<TeacherReportProps> = ({
  students,
  scores,
  schoolInfo,
  onUpdateScore,
  onResetAllScores,
  onAutoPopulateDemoScores,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'tuntas' | 'remedial' | 'pending'>('all');
  const [editingStudentId, setEditingStudentId] = useState<number | null>(null);
  const [editScoreValue, setEditScoreValue] = useState<number>(0);
  const [editNotesValue, setEditNotesValue] = useState<string>('');

  // Combine student master roster with score records
  const fullReport = students.map((s) => {
    const scoreRecord = scores.find(sc => sc.studentId === s.id) || {
      studentId: s.id,
      studentName: s.name,
      hasPlayed: false,
      score: 0,
      correctCount: 0,
      wrongCount: 0,
      tilesReached: 1,
      finished: false,
      durationSeconds: 0,
      notes: "Belum Mengerjakan",
    };
    return {
      ...s,
      ...scoreRecord,
    };
  });

  // Filtered list
  const filteredStudents = fullReport.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;

    if (statusFilter === 'all') return true;
    if (statusFilter === 'tuntas') return item.hasPlayed && item.score >= schoolInfo.kkm;
    if (statusFilter === 'remedial') return item.hasPlayed && item.score < schoolInfo.kkm;
    if (statusFilter === 'pending') return !item.hasPlayed;
    return true;
  });

  // Statistics
  const playedCount = fullReport.filter(s => s.hasPlayed).length;
  const tuntasCount = fullReport.filter(s => s.hasPlayed && s.score >= schoolInfo.kkm).length;
  const remedialCount = fullReport.filter(s => s.hasPlayed && s.score < schoolInfo.kkm).length;
  const pendingCount = fullReport.filter(s => !s.hasPlayed).length;
  
  const totalScores = fullReport.filter(s => s.hasPlayed).reduce((acc, curr) => acc + curr.score, 0);
  const averageScore = playedCount > 0 ? (totalScores / playedCount).toFixed(1) : '0';
  const completenessPercent = playedCount > 0 ? Math.round((tuntasCount / playedCount) * 100) : 0;
  
  const playedScoresOnly = fullReport.filter(s => s.hasPlayed).map(s => s.score);
  const maxScore = playedScoresOnly.length > 0 ? Math.max(...playedScoresOnly) : 0;
  const minScore = playedScoresOnly.length > 0 ? Math.min(...playedScoresOnly) : 0;

  // Print Report Handler
  const handlePrint = () => {
    window.print();
  };

  // Export CSV Handler
  const handleExportCSV = () => {
    const headers = ["No Absen", "Nama Siswa", "Nilai Akhir", "Status Ketuntasan", "Jawaban Benar", "Jawaban Salah", "Posisi Petak", "Predikat", "Catatan Guru"];
    const rows = fullReport.map((s) => [
      s.no,
      `"${s.name}"`,
      s.hasPlayed ? s.score : "-",
      !s.hasPlayed ? "Belum Main" : s.score >= schoolInfo.kkm ? "TUNTAS" : "REMEDIAL",
      s.correctCount,
      s.wrongCount,
      `Petak ${s.tilesReached}`,
      getPredicate(s.score, s.hasPlayed),
      `"${s.notes || '-'}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Laporan_Nilai_IPAS_Air_${schoolInfo.className.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getPredicate = (score: number, hasPlayed: boolean) => {
    if (!hasPlayed) return "-";
    if (score >= 90) return "Sangat Baik (A)";
    if (score >= 80) return "Baik (B)";
    if (score >= 75) return "Cukup (C)";
    return "Perlu Bimbingan (D)";
  };

  const handleStartEdit = (student: typeof fullReport[0]) => {
    setEditingStudentId(student.id);
    setEditScoreValue(student.score);
    setEditNotesValue(student.notes || '');
  };

  const handleSaveEdit = (studentId: number) => {
    const current = scores.find(s => s.studentId === studentId);
    const updated: StudentScore = {
      studentId,
      studentName: students.find(s => s.id === studentId)?.name || '',
      hasPlayed: true,
      score: editScoreValue,
      correctCount: current?.correctCount || Math.round(editScoreValue / 10),
      wrongCount: current?.wrongCount || 10 - Math.round(editScoreValue / 10),
      tilesReached: current?.tilesReached || 50,
      finished: current?.finished || true,
      durationSeconds: current?.durationSeconds || 300,
      completedAt: new Date().toLocaleDateString('id-ID'),
      notes: editNotesValue,
    };
    onUpdateScore(updated);
    setEditingStudentId(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Print-Only Header: Formal School Letterhead */}
      <div className="hidden print:block text-center border-b-2 border-slate-900 pb-4 mb-6">
        <h2 className="text-xl font-bold uppercase tracking-wide">
          PEMERINTAH KOTA / KABUPATEN PENDIDIKAN DASAR
        </h2>
        <h1 className="text-2xl font-black uppercase text-slate-900 mt-1">
          {schoolInfo.schoolName}
        </h1>
        <p className="text-sm text-slate-700 mt-1">
          REKAPITULASI LAPORAN NILAI ASESMEN FORMATIF IPAS (GAME ULAR TANGGA: AIR SUMBER KEHIDUPAN)
        </p>
        <div className="mt-4 flex justify-between text-xs font-semibold px-4">
          <div>
            <p>Mata Pelajaran: <strong>IPAS (Fase C)</strong></p>
            <p>Materi: <strong>Air Sumber Kehidupan & Daur Air</strong></p>
          </div>
          <div>
            <p>Kelas / Semester: <strong>{schoolInfo.className} / {schoolInfo.semester}</strong></p>
            <p>Tahun Pelajaran: <strong>{schoolInfo.academicYear}</strong></p>
          </div>
          <div>
            <p>KKM / Standar Tuntas: <strong>{schoolInfo.kkm}</strong></p>
            <p>Guru Pengampu: <strong>{schoolInfo.teacherName}</strong></p>
          </div>
        </div>
      </div>

      {/* Screen Header & Top Action Controls */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-sky-100 flex flex-wrap items-center justify-between gap-4 print:hidden">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-indigo-100 text-indigo-800">
              Buku Nilai Guru
            </span>
            <span className="text-xs text-slate-500">
              Total: <strong>25 Siswa</strong>
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-800 mt-1">
            Laporan Nilai Siswa: IPAS Air Sumber Kehidupan
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            {schoolInfo.schoolName} • {schoolInfo.className} • Guru: {schoolInfo.teacherName} (KKM: {schoolInfo.kkm})
          </p>
        </div>

        {/* Buttons: Print, Export, Populate */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onAutoPopulateDemoScores}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-sky-200 bg-sky-50 hover:bg-sky-100 text-sky-800 text-xs font-bold transition-all"
            title="Isi contoh simulasi nilai kelas"
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-600" />
            <span>Simulasi Nilai Otomatis</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition-all"
            title="Download file CSV / Excel"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Ekspor Excel/CSV</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-200 transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak / Simpan PDF</span>
          </button>
        </div>
      </div>

      {/* KPI Statistic Cards (Visible on screen and print) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex items-center gap-3">
          <div className="p-3 bg-sky-100 rounded-xl text-sky-700">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase">Sudah Mengerjakan</div>
            <div className="text-xl font-black text-slate-800">
              {playedCount} <span className="text-xs font-normal text-slate-500">/ 25 Siswa</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex items-center gap-3">
          <div className="p-3 bg-emerald-100 rounded-xl text-emerald-700">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase">Tuntas KKM (&ge;{schoolInfo.kkm})</div>
            <div className="text-xl font-black text-emerald-700">
              {tuntasCount} <span className="text-xs font-normal text-emerald-600">({completenessPercent}%)</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex items-center gap-3">
          <div className="p-3 bg-indigo-100 rounded-xl text-indigo-700">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase">Rata-Rata Kelas</div>
            <div className="text-xl font-black text-indigo-700">
              {averageScore} <span className="text-xs font-normal text-slate-500">/ 100</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex items-center gap-3">
          <div className="p-3 bg-amber-100 rounded-xl text-amber-700">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase">Tertinggi / Terendah</div>
            <div className="text-xl font-black text-slate-800">
              {maxScore} <span className="text-xs font-normal text-slate-400">/ {minScore}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar (Screen only) */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-sky-100 flex flex-wrap items-center justify-between gap-3 print:hidden">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nama siswa dari 25 anak..."
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              statusFilter === 'all'
                ? 'bg-slate-800 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Semua (25)
          </button>
          <button
            onClick={() => setStatusFilter('tuntas')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              statusFilter === 'tuntas'
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
            }`}
          >
            Tuntas ({tuntasCount})
          </button>
          <button
            onClick={() => setStatusFilter('remedial')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              statusFilter === 'remedial'
                ? 'bg-rose-600 text-white'
                : 'bg-rose-50 text-rose-800 hover:bg-rose-100'
            }`}
          >
            Remedial ({remedialCount})
          </button>
          <button
            onClick={() => setStatusFilter('pending')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              statusFilter === 'pending'
                ? 'bg-amber-600 text-white'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
            }`}
          >
            Belum Main ({pendingCount})
          </button>
        </div>
      </div>

      {/* Main 25-Students Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-extrabold uppercase text-[11px] tracking-wider">
                <th className="py-3 px-3 sm:px-4 text-center w-12">No</th>
                <th className="py-3 px-3 sm:px-4">Nama Siswa</th>
                <th className="py-3 px-3 sm:px-4 text-center">Status</th>
                <th className="py-3 px-3 sm:px-4 text-center">Nilai (0-100)</th>
                <th className="py-3 px-3 sm:px-4 text-center">Kuis Benar</th>
                <th className="py-3 px-3 sm:px-4 text-center">Petak Terakhir</th>
                <th className="py-3 px-3 sm:px-4">Predikat Capaian</th>
                <th className="py-3 px-3 sm:px-4">Catatan Guru</th>
                <th className="py-3 px-3 sm:px-4 text-center print:hidden">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((student) => {
                const isEditing = editingStudentId === student.id;
                const isTuntas = student.hasPlayed && student.score >= schoolInfo.kkm;

                return (
                  <tr 
                    key={student.id} 
                    className="hover:bg-sky-50/40 transition-colors"
                  >
                    <td className="py-3 px-3 sm:px-4 text-center font-bold text-slate-500">
                      {student.no}
                    </td>

                    <td className="py-3 px-3 sm:px-4 font-black text-slate-800">
                      {student.name}
                    </td>

                    <td className="py-3 px-3 sm:px-4 text-center">
                      {!student.hasPlayed ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                          <Clock className="w-3 h-3" />
                          Belum
                        </span>
                      ) : isTuntas ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          <CheckCircle className="w-3 h-3" />
                          Tuntas
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                          <AlertCircle className="w-3 h-3" />
                          Remedial
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-3 sm:px-4 text-center font-black">
                      {isEditing ? (
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={editScoreValue}
                          onChange={(e) => setEditScoreValue(Number(e.target.value))}
                          className="w-16 px-1.5 py-1 text-center font-black border border-indigo-500 rounded-lg"
                        />
                      ) : (
                        <span className={student.hasPlayed ? (isTuntas ? 'text-emerald-700 text-base' : 'text-rose-700 text-base') : 'text-slate-400'}>
                          {student.hasPlayed ? student.score : '-'}
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-3 sm:px-4 text-center text-slate-600 font-semibold">
                      {student.hasPlayed ? `${student.correctCount} / ${student.correctCount + student.wrongCount}` : '-'}
                    </td>

                    <td className="py-3 px-3 sm:px-4 text-center font-bold text-sky-800">
                      {student.hasPlayed ? `Petak ${student.tilesReached}` : '-'}
                    </td>

                    <td className="py-3 px-3 sm:px-4 text-xs font-semibold text-slate-700">
                      {getPredicate(student.score, student.hasPlayed)}
                    </td>

                    <td className="py-3 px-3 sm:px-4 text-xs text-slate-600">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editNotesValue}
                          onChange={(e) => setEditNotesValue(e.target.value)}
                          className="w-full px-2 py-1 border border-indigo-500 rounded-lg text-xs"
                          placeholder="Catatan hasil belajar siswa..."
                        />
                      ) : (
                        student.notes || '-'
                      )}
                    </td>

                    <td className="py-3 px-3 sm:px-4 text-center print:hidden">
                      {isEditing ? (
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleSaveEdit(student.id)}
                            className="p-1 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
                            title="Simpan"
                          >
                            <Save className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setEditingStudentId(null)}
                            className="p-1 rounded-lg bg-slate-200 text-slate-700 hover:bg-slate-300"
                            title="Batal"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleStartEdit(student)}
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-indigo-600"
                          title="Edit Nilai Manual"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Official Signatures Block (For Print layout) */}
      <div className="hidden print:grid grid-cols-2 gap-8 pt-8 mt-6 border-t border-slate-300 text-xs">
        <div className="text-center">
          <p>Mengetahui,</p>
          <p className="font-bold">Kepala Sekolah {schoolInfo.schoolName}</p>
          <div className="h-20"></div>
          <p className="font-bold underline uppercase">{schoolInfo.principalName}</p>
          <p>NIP: {schoolInfo.principalNip || '.................................'}</p>
        </div>

        <div className="text-center">
          <p>{schoolInfo.schoolName}, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          <p className="font-bold">Guru Kelas V / Pengampu IPAS</p>
          <div className="h-20"></div>
          <p className="font-bold underline uppercase">{schoolInfo.teacherName}</p>
          <p>NIP: {schoolInfo.teacherNip || '.................................'}</p>
        </div>
      </div>
    </div>
  );
};
