import React from 'react';
import { 
  BookOpen, 
  Dices, 
  GraduationCap, 
  FileText, 
  Volume2, 
  VolumeX, 
  Settings, 
  Sparkles,
  School
} from 'lucide-react';
import { SchoolInfo } from '../types';

interface HeaderProps {
  activeTab: 'reading' | 'game' | 'report' | 'guide';
  setActiveTab: (tab: 'reading' | 'game' | 'report' | 'guide') => void;
  schoolInfo: SchoolInfo;
  onOpenSettings: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  activePlayerName?: string;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  schoolInfo,
  onOpenSettings,
  isMuted,
  onToggleMute,
}) => {
  return (
    <header className="bg-white/95 backdrop-blur border-b border-sky-100 sticky top-0 z-30 shadow-xs">
      {/* Top Banner: School & Subject Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-500 via-sky-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-cyan-200">
              <span className="text-2xl font-black">💧</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-800 border border-cyan-200">
                  IPAS KELAS 5 SD
                </span>
                <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                  <School className="w-3.5 h-3.5 text-sky-600" />
                  {schoolInfo.schoolName}
                </span>
              </div>
              <h1 className="text-lg sm:text-xl font-extrabold text-slate-800 tracking-tight flex items-center gap-1.5">
                Game Ular Tangga: <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-cyan-600">Air Sumber Kehidupan</span>
              </h1>
            </div>
          </div>

          {/* Quick controls: School Settings, Sound Toggle, Teacher Badge */}
          <div className="flex items-center gap-2">
            <div className="hidden md:flex flex-col text-right pr-2 border-r border-slate-200">
              <span className="text-xs font-semibold text-slate-700">{schoolInfo.teacherName}</span>
              <span className="text-[11px] text-slate-500">{schoolInfo.className} • TA {schoolInfo.academicYear}</span>
            </div>

            <button
              onClick={onToggleMute}
              title={isMuted ? "Nyalakan Suara" : "Matikan Suara"}
              className={`p-2.5 rounded-xl border transition-all ${
                isMuted 
                  ? 'bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100' 
                  : 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
              }`}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            <button
              onClick={onOpenSettings}
              title="Pengaturan Identitas Sekolah & Guru"
              className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition-all flex items-center gap-1.5 text-xs font-semibold"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Pengaturan</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-sky-50/70 border-t border-sky-100/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1 sm:space-x-2 py-2 overflow-x-auto no-scrollbar" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('reading')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
                activeTab === 'reading'
                  ? 'bg-sky-600 text-white shadow-sm shadow-sky-300'
                  : 'text-slate-600 hover:text-sky-700 hover:bg-white/80'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>1. Bahan Bacaan & Suara</span>
              <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-md ml-1">Wajib Baca</span>
            </button>

            <button
              onClick={() => setActiveTab('game')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
                activeTab === 'game'
                  ? 'bg-gradient-to-r from-cyan-600 to-sky-600 text-white shadow-sm shadow-cyan-300'
                  : 'text-slate-600 hover:text-cyan-700 hover:bg-white/80'
              }`}
            >
              <Dices className="w-4 h-4" />
              <span>2. Main Ular Tangga</span>
              <span className="text-[10px] bg-amber-400 text-amber-950 font-black px-1.5 py-0.5 rounded-md ml-1">Kuis Seru</span>
            </button>

            <button
              onClick={() => setActiveTab('report')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
                activeTab === 'report'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-300'
                  : 'text-slate-600 hover:text-indigo-700 hover:bg-white/80'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>3. Laporan Nilai Guru</span>
              <span className="text-[10px] bg-indigo-100 text-indigo-800 font-extrabold px-1.5 py-0.5 rounded-md ml-1">25 Siswa</span>
            </button>

            <button
              onClick={() => setActiveTab('guide')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
                activeTab === 'guide'
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-300'
                  : 'text-slate-600 hover:text-emerald-700 hover:bg-white/80'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>4. Modul & Salin Prompt</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
