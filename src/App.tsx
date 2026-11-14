import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ReadingSection } from './components/ReadingSection';
import { GameBoard } from './components/GameBoard';
import { TeacherReport } from './components/TeacherReport';
import { PromptTeacherGuide } from './components/PromptTeacherGuide';
import { SchoolSettingsModal } from './components/SchoolSettingsModal';
import { INITIAL_STUDENTS, DEFAULT_SCHOOL_INFO, generateInitialScores } from './data/studentsData';
import { StudentScore, SchoolInfo } from './types';
import { sound } from './utils/audio';

const STORAGE_KEY_SCORES = 'ipas_snakes_ladders_scores_v1';
const STORAGE_KEY_SCHOOL = 'ipas_snakes_ladders_school_v1';

export default function App() {
  const [activeTab, setActiveTab] = useState<'reading' | 'game' | 'report' | 'guide'>('reading');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Load School Info from localStorage or fallback
  const [schoolInfo, setSchoolInfo] = useState<SchoolInfo>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY_SCHOOL);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error(e);
        }
      }
    }
    return DEFAULT_SCHOOL_INFO;
  });

  // Load Student Scores from localStorage or fallback to initial realistic demo records
  const [studentScores, setStudentScores] = useState<StudentScore[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY_SCORES);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error(e);
        }
      }
    }
    return generateInitialScores();
  });

  // Persist School Info
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SCHOOL, JSON.stringify(schoolInfo));
  }, [schoolInfo]);

  // Persist Student Scores
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SCORES, JSON.stringify(studentScores));
  }, [studentScores]);

  // Sound toggle handler
  const handleToggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    sound.setMute(next);
  };

  // Score handlers
  const handleSaveScore = (newScore: StudentScore) => {
    setStudentScores((prev) => {
      const existingIdx = prev.findIndex((s) => s.studentId === newScore.studentId);
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx] = newScore;
        return updated;
      }
      return [...prev, newScore];
    });
  };

  const handleUpdateScore = (updatedScore: StudentScore) => {
    handleSaveScore(updatedScore);
  };

  const handleResetAllScores = () => {
    if (confirm("Apakah Anda yakin ingin mereset seluruh nilai 25 siswa ke 0?")) {
      const freshScores = INITIAL_STUDENTS.map((student) => ({
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
      }));
      setStudentScores(freshScores);
    }
  };

  const handleAutoPopulateDemoScores = () => {
    setStudentScores(generateInitialScores());
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-cyan-200">
      {/* Top Application Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        schoolInfo={schoolInfo}
        onOpenSettings={() => setIsSettingsOpen(true)}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {activeTab === 'reading' && (
          <ReadingSection onStartGame={() => setActiveTab('game')} />
        )}

        {activeTab === 'game' && (
          <GameBoard
            students={INITIAL_STUDENTS}
            studentScores={studentScores}
            defaultClassName={schoolInfo.className}
            onSaveScore={handleSaveScore}
            onNavigateToReport={() => setActiveTab('report')}
            onNavigateToReading={() => setActiveTab('reading')}
          />
        )}

        {activeTab === 'report' && (
          <TeacherReport
            students={INITIAL_STUDENTS}
            scores={studentScores}
            schoolInfo={schoolInfo}
            onUpdateScore={handleUpdateScore}
            onResetAllScores={handleResetAllScores}
            onAutoPopulateDemoScores={handleAutoPopulateDemoScores}
          />
        )}

        {activeTab === 'guide' && (
          <PromptTeacherGuide schoolInfo={schoolInfo} />
        )}
      </main>

      {/* School Settings Modal */}
      <SchoolSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        schoolInfo={schoolInfo}
        onSave={(updated) => setSchoolInfo(updated)}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 print:hidden text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            {schoolInfo.schoolName} • Media Pembelajaran IPAS Kelas 5 SD Kurikulum Merdeka
          </span>
          <span className="text-slate-400">
            Guru: {schoolInfo.teacherName} • Daur Air & Air Sumber Kehidupan
          </span>
        </div>
      </footer>
    </div>
  );
}
