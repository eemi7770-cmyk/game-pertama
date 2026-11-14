import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  Trophy, 
  RotateCcw, 
  HelpCircle, 
  Users, 
  UserCheck, 
  Sparkles,
  Send,
  Loader2,
  CheckCircle,
  AlertCircle,
  User,
  GraduationCap
} from 'lucide-react';
import { Student, StudentScore, Question } from '../types';
import { TOTAL_TILES, BOARD_COLUMNS, BOARD_ROWS, LADDERS_AND_SNAKES, QUIZ_TILES } from '../data/boardData';
import { IPAS_QUESTIONS } from '../data/questionsData';
import { Dice } from './Dice';
import { QuizModal } from './QuizModal';
import { sound } from '../utils/audio';
import { sendScoreToGoogleSheets } from '../utils/sheets';

interface PlayerInGame {
  student: Student;
  position: number;
  score: number;
  correctAnswers: number;
  wrongAnswers: number;
  color: string;
  avatarIcon: string;
}

interface GameBoardProps {
  students: Student[];
  studentScores: StudentScore[];
  defaultClassName: string;
  onSaveScore: (scoreData: StudentScore) => void;
  onNavigateToReport: () => void;
  onNavigateToReading: () => void;
}

const PLAYER_COLORS = [
  { bg: 'bg-cyan-500', border: 'border-cyan-300', text: 'text-cyan-900', label: 'Biru Langit', ring: 'ring-cyan-400' },
  { bg: 'bg-emerald-500', border: 'border-emerald-300', text: 'text-emerald-900', label: 'Hijau Segar', ring: 'ring-emerald-400' },
  { bg: 'bg-amber-500', border: 'border-amber-300', text: 'text-amber-900', label: 'Kuning Mentari', ring: 'ring-amber-400' },
  { bg: 'bg-purple-500', border: 'border-purple-300', text: 'text-purple-900', label: 'Ungu Kristal', ring: 'ring-purple-400' },
];

export const GameBoard: React.FC<GameBoardProps> = ({
  students,
  studentScores,
  defaultClassName,
  onSaveScore,
  onNavigateToReport,
  onNavigateToReading,
}) => {
  // Game Setup State
  const [selectedStudentIds, setSelectedStudentIds] = useState<number[]>([1]); // default to first student
  const [gameMode, setGameMode] = useState<'single' | 'group'>('single');
  const [studentNameInput, setStudentNameInput] = useState<string>(students[0]?.name || '');
  const [studentClassInput, setStudentClassInput] = useState<string>(defaultClassName || 'Kelas 5 SD');
  const [groupCustomNames, setGroupCustomNames] = useState<Record<number, string>>({});
  const [setupError, setSetupError] = useState<string>('');
  const [isGameStarted, setIsGameStarted] = useState<boolean>(false);

  // Active Game State
  const [players, setPlayers] = useState<PlayerInGame[]>([]);
  const [activePlayerIndex, setActivePlayerIndex] = useState<number>(0);
  const [lastDiceValue, setLastDiceValue] = useState<number>(1);
  const [isMoving, setIsMoving] = useState<boolean>(false);
  const [gameLogs, setGameLogs] = useState<string[]>([
    "Selamat datang di Game Ular Tangga Air Sumber Kehidupan! Isi nama siswa & kelas lalu tekan Mulai Permainan."
  ]);
  const [winner, setWinner] = useState<PlayerInGame | null>(null);
  const [finalAwardedScore, setFinalAwardedScore] = useState<number>(0);

  // Google Sheets Sync State
  const [sheetSyncStatus, setSheetSyncStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [resendName, setResendName] = useState<string>('');
  const [resendClass, setResendClass] = useState<string>('');

  // Quiz Modal State
  const [activeQuiz, setActiveQuiz] = useState<{
    question: Question;
    playerIdx: number;
    questionNumber: number;
  } | null>(null);

  const [questionCount, setQuestionCount] = useState<number>(0);

  useEffect(() => {
    if (!isGameStarted && defaultClassName) {
      setStudentClassInput(defaultClassName);
    }
  }, [defaultClassName, isGameStarted]);

  const submitScoreToSheet = async (nama: string, kelas: string, nilai: number) => {
    if (!nama.trim() || !kelas.trim()) {
      setSheetSyncStatus('error');
      return;
    }
    setSheetSyncStatus('sending');
    try {
      await sendScoreToGoogleSheets({
        nama: nama.trim(),
        kelas: kelas.trim(),
        nilai,
      });
      setSheetSyncStatus('sent');
      addLog(`📊 Nilai (${nilai}) untuk ${nama.trim()} (${kelas.trim()}) otomatis terkirim ke Google Sheets!`);
    } catch (err) {
      console.error('Gagal mengirim ke Google Sheets:', err);
      setSheetSyncStatus('error');
      addLog(`⚠️ Gagal mengirim nilai ke Google Sheets. Silakan coba kirim ulang.`);
    }
  };

  // Initialize or start game
  const handleStartGame = () => {
    if (!studentClassInput.trim()) {
      setSetupError('Mohon isi Nama Kelas terlebih dahulu sebelum memulai permainan.');
      return;
    }

    let chosenStudents: Student[] = [];

    if (gameMode === 'single') {
      const trimmedName = studentNameInput.trim();
      if (!trimmedName) {
        setSetupError('Mohon isi Nama Siswa terlebih dahulu sebelum memulai permainan.');
        return;
      }
      const matched = students.find(
        (s) => s.name.toLowerCase() === trimmedName.toLowerCase()
      );
      if (matched) {
        chosenStudents = [matched];
      } else {
        chosenStudents = [{ id: Date.now(), no: 0, name: trimmedName.toUpperCase() }];
      }
    } else {
      const selected = students.filter(s => selectedStudentIds.includes(s.id));
      if (selected.length === 0) {
        setSetupError('Pilih minimal 1 siswa untuk mode kelompok.');
        return;
      }
      chosenStudents = selected.map((s) => ({
        ...s,
        name: (groupCustomNames[s.id] ?? s.name).trim() || s.name,
      }));
    }

    setSetupError('');

    const initializedPlayers: PlayerInGame[] = chosenStudents.map((s, idx) => ({
      student: s,
      position: 1,
      score: 50, // starting base points
      correctAnswers: 0,
      wrongAnswers: 0,
      color: PLAYER_COLORS[idx % PLAYER_COLORS.length].bg,
      avatarIcon: ['💧', '🌊', '🌧️', '🌱'][idx % 4],
    }));

    setPlayers(initializedPlayers);
    setActivePlayerIndex(0);
    setLastDiceValue(1);
    setWinner(null);
    setFinalAwardedScore(0);
    setSheetSyncStatus('idle');
    setIsMoving(false);
    setIsGameStarted(true);
    setQuestionCount(0);

    const welcomeMsg = `Permainan dimulai! Kelas ${studentClassInput.trim()}, giliran pertama: ${initializedPlayers[0].student.name}. Lempar dadumu!`;
    setGameLogs([welcomeMsg]);
    sound.speakText(welcomeMsg);
  };

  const handleResetGame = () => {
    setIsGameStarted(false);
    setWinner(null);
    setSheetSyncStatus('idle');
    setIsMoving(false);
    setActiveQuiz(null);
  };

  // Add a log message
  const addLog = (msg: string) => {
    setGameLogs(prev => [msg, ...prev.slice(0, 15)]);
  };

  // Handle dice roll
  const handleDiceRoll = (rolledNumber: number) => {
    if (isMoving || !isGameStarted || winner) return;

    setLastDiceValue(rolledNumber);
    const currPlayer = players[activePlayerIndex];
    addLog(`🎲 ${currPlayer.student.name} melempar dadu dan mendapatkan angka ${rolledNumber}!`);

    // Animate movement step-by-step
    animatePlayerMove(activePlayerIndex, currPlayer.position, rolledNumber);
  };

  // Animate movement tile-by-tile
  const animatePlayerMove = (playerIdx: number, fromTile: number, steps: number) => {
    setIsMoving(true);
    let target = fromTile + steps;
    if (target > TOTAL_TILES) {
      // Bounce back rule if overshoot finish
      const overshoot = target - TOTAL_TILES;
      target = TOTAL_TILES - overshoot;
      addLog(`⚠️ Melebihi petak finish 50! Memantul kembali ke petak ${target}.`);
    }

    let current = fromTile;
    const stepInterval = setInterval(() => {
      if (current === target) {
        clearInterval(stepInterval);
        handleTileLanded(playerIdx, target);
      } else {
        current = current < target ? current + 1 : current - 1;
        sound.playStepSound();
        setPlayers(prev => {
          const updated = [...prev];
          updated[playerIdx].position = current;
          return updated;
        });
      }
    }, 180);
  };

  // Check what happens when landing on a tile (Ladder, Snake, Quiz, or Finish)
  const handleTileLanded = (playerIdx: number, tileNum: number) => {
    const player = players[playerIdx];

    // 1. Reached Finish (Tile 50)
    if (tileNum === TOTAL_TILES) {
      handleGameWon(playerIdx);
      return;
    }

    // 2. Check Ladder
    const ladder = LADDERS_AND_SNAKES.find(item => item.start === tileNum && item.type === 'ladder');
    if (ladder) {
      sound.playLadderSound();
      addLog(`🪜 TANGGA KEBAIKAN: ${player.student.name} mendarat di petak ${ladder.start} (${ladder.label})! Naik ke petak ${ladder.end}!`);
      sound.speakText(`Hebat! ${ladder.description}`);

      setTimeout(() => {
        setPlayers(prev => {
          const updated = [...prev];
          updated[playerIdx].position = ladder.end;
          updated[playerIdx].score = Math.min(100, updated[playerIdx].score + 10);
          return updated;
        });

        if (ladder.end === TOTAL_TILES) {
          handleGameWon(playerIdx);
        } else {
          checkQuizOrNextTurn(playerIdx, ladder.end);
        }
      }, 700);
      return;
    }

    // 3. Check Snake
    const snake = LADDERS_AND_SNAKES.find(item => item.start === tileNum && item.type === 'snake');
    if (snake) {
      sound.playSnakeSound();
      addLog(`🐍 ULAR PENCEMARAN: ${player.student.name} mendarat di petak ${snake.start} (${snake.label})! Terperosok turun ke petak ${snake.end}!`);
      sound.speakText(`Waspada! ${snake.description}`);

      setTimeout(() => {
        setPlayers(prev => {
          const updated = [...prev];
          updated[playerIdx].position = snake.end;
          return updated;
        });
        checkQuizOrNextTurn(playerIdx, snake.end);
      }, 700);
      return;
    }

    // 4. Check Quiz
    checkQuizOrNextTurn(playerIdx, tileNum);
  };

  const checkQuizOrNextTurn = (playerIdx: number, tileNum: number) => {
    const isQuizTile = QUIZ_TILES.includes(tileNum);
    // Every quiz tile or every 3 turns guarantee question practice
    if (isQuizTile) {
      triggerQuiz(playerIdx);
    } else {
      setIsMoving(false);
      advanceTurn();
    }
  };

  const triggerQuiz = (playerIdx: number) => {
    const nextQIdx = (questionCount) % IPAS_QUESTIONS.length;
    const q = IPAS_QUESTIONS[nextQIdx];
    setQuestionCount(prev => prev + 1);

    setActiveQuiz({
      question: q,
      playerIdx,
      questionNumber: questionCount + 1,
    });
  };

  const handleQuizAnswer = (isCorrect: boolean) => {
    if (!activeQuiz) return;
    const { playerIdx } = activeQuiz;
    const p = players[playerIdx];

    setPlayers(prev => {
      const updated = [...prev];
      if (isCorrect) {
        updated[playerIdx].score = Math.min(100, updated[playerIdx].score + 10);
        updated[playerIdx].correctAnswers += 1;
      } else {
        updated[playerIdx].wrongAnswers += 1;
      }
      return updated;
    });

    if (isCorrect) {
      addLog(`✨ ${p.student.name} menjawab kuis dengan BENAR! Nilai bertambah +10!`);
    } else {
      addLog(`💡 ${p.student.name} belum tepat menjawab kuis, mari pelajari pembahasannya!`);
    }

    setActiveQuiz(null);
    setIsMoving(false);
    advanceTurn();
  };

  const advanceTurn = () => {
    if (players.length <= 1) {
      return;
    }
    const nextIdx = (activePlayerIndex + 1) % players.length;
    setActivePlayerIndex(nextIdx);
    const nextPlayer = players[nextIdx];
    addLog(`👉 Giliran selanjutnya: ${nextPlayer.student.name}. Silakan lempar dadu!`);
  };

  // Handle Game Victory
  const handleGameWon = (playerIdx: number) => {
    const winningPlayer = players[playerIdx];
    setWinner(winningPlayer);
    setIsMoving(false);

    sound.playVictoryFanfare();
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 }
    });

    const winSpeech = `Selamat kepada ${winningPlayer.student.name}! Kamu telah berhasil mencapai Samudra Air Bersih dan menyelesaikan permainan Ular Tangga IPAS!`;
    sound.speakText(winSpeech);
    addLog(`🏆 SELAMAT! ${winningPlayer.student.name} MENCAPAI FINISH SAMUDRA AIR BERSIH!`);

    // Compute final score consistently for UI, Teacher Gradebook, and Google Sheets
    const totalAnswered = winningPlayer.correctAnswers + winningPlayer.wrongAnswers;
    const computedScore = totalAnswered > 0 
      ? Math.round((winningPlayer.correctAnswers / totalAnswered) * 100)
      : Math.min(100, Math.max(75, winningPlayer.score));

    setFinalAwardedScore(computedScore);
    setResendName(winningPlayer.student.name);
    setResendClass(studentClassInput.trim());

    const finalRecord: StudentScore = {
      studentId: winningPlayer.student.id,
      studentName: winningPlayer.student.name,
      hasPlayed: true,
      score: computedScore,
      correctCount: winningPlayer.correctAnswers,
      wrongCount: winningPlayer.wrongAnswers,
      tilesReached: TOTAL_TILES,
      finished: true,
      durationSeconds: 280,
      completedAt: new Date().toLocaleString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      notes: computedScore >= 80 ? "Sangat Menguasai Materi Air Sumber Kehidupan" : "Tuntas Sesuai KKM",
    };

    onSaveScore(finalRecord);

    // Send score automatically to Google Sheets Web App
    void submitScoreToSheet(winningPlayer.student.name, studentClassInput, computedScore);
  };

  // Render individual tile in the 50-tile board
  const renderTile = (tileNumber: number) => {
    const ladder = LADDERS_AND_SNAKES.find(item => item.start === tileNumber && item.type === 'ladder');
    const snake = LADDERS_AND_SNAKES.find(item => item.start === tileNumber && item.type === 'snake');
    const isQuiz = QUIZ_TILES.includes(tileNumber);
    const isStart = tileNumber === 1;
    const isFinish = tileNumber === TOTAL_TILES;

    // Find players on this tile
    const playersOnThisTile = players.filter(p => p.position === tileNumber);

    let tileBg = "bg-white border-sky-100 hover:border-sky-300";
    if (isStart) tileBg = "bg-emerald-100 border-emerald-300 ring-2 ring-emerald-400";
    else if (isFinish) tileBg = "bg-gradient-to-tr from-amber-200 via-yellow-100 to-amber-300 border-amber-400 ring-2 ring-amber-400";
    else if (ladder) tileBg = "bg-cyan-50 border-cyan-300 ring-1 ring-cyan-400";
    else if (snake) tileBg = "bg-rose-50 border-rose-300 ring-1 ring-rose-400";
    else if (isQuiz) tileBg = "bg-sky-50 border-sky-200";

    return (
      <div
        key={tileNumber}
        className={`relative rounded-xl border p-1 sm:p-1.5 flex flex-col justify-between shadow-xs transition-all aspect-square select-none overflow-hidden ${tileBg}`}
      >
        {/* Top: Tile Number and Badge */}
        <div className="flex items-center justify-between z-10">
          <span className={`text-[10px] sm:text-xs font-black ${isFinish ? 'text-amber-900' : isStart ? 'text-emerald-900' : 'text-slate-600'}`}>
            {tileNumber}
          </span>

          {isStart && (
            <span className="text-[9px] font-black bg-emerald-600 text-white px-1 rounded-sm leading-tight">
              START
            </span>
          )}
          {isFinish && (
            <span className="text-[9px] font-black bg-amber-600 text-white px-1 rounded-sm leading-tight animate-pulse">
              FINISH
            </span>
          )}
          {isQuiz && !isStart && !isFinish && (
            <span className="p-0.5 rounded-full bg-sky-200 text-sky-800" title="Petak Kuis IPAS">
              <HelpCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            </span>
          )}
        </div>

        {/* Middle: Event Icon / Ladder / Snake */}
        <div className="flex-1 flex flex-col items-center justify-center my-0.5 text-center z-10">
          {ladder && (
            <div className="flex flex-col items-center text-cyan-700 animate-bounce">
              <span className="text-xs sm:text-sm">🪜</span>
              <span className="text-[8px] sm:text-[9px] font-extrabold text-cyan-800 leading-none">
                Naik ke {ladder.end}
              </span>
            </div>
          )}

          {snake && (
            <div className="flex flex-col items-center text-rose-700">
              <span className="text-xs sm:text-sm">🐍</span>
              <span className="text-[8px] sm:text-[9px] font-extrabold text-rose-800 leading-none">
                Turun ke {snake.end}
              </span>
            </div>
          )}

          {isStart && (
            <span className="text-base sm:text-xl">💧</span>
          )}

          {isFinish && (
            <span className="text-base sm:text-xl animate-spin">🌊</span>
          )}

          {!ladder && !snake && !isStart && !isFinish && isQuiz && (
            <span className="text-xs sm:text-sm">❓</span>
          )}
        </div>

        {/* Bottom: Player Pawns sitting on this tile */}
        <div className="flex items-center justify-center gap-1 z-20 min-h-[18px]">
          {playersOnThisTile.map((p, idx) => (
            <div
              key={idx}
              title={`${p.student.name} (Petak ${p.position})`}
              className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full ${p.color} border-2 border-white shadow-md flex items-center justify-center text-[9px] sm:text-[10px] font-black text-white transform hover:scale-125 transition-transform animate-bounce`}
            >
              {p.avatarIcon}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Generate 50 tiles in 5 rows (boustrophedon / zig-zag order from top row to bottom row)
  const renderBoardGrid = () => {
    const rows = [];
    // Row 4 is top (tiles 41-50), Row 0 is bottom (tiles 1-10)
    for (let r = BOARD_ROWS - 1; r >= 0; r--) {
      const rowTiles = [];
      const isEvenRow = r % 2 === 0;

      for (let c = 0; c < BOARD_COLUMNS; c++) {
        const tileIndexInRow = isEvenRow ? c : (BOARD_COLUMNS - 1 - c);
        const tileNum = r * BOARD_COLUMNS + tileIndexInRow + 1;
        rowTiles.push(renderTile(tileNum));
      }

      rows.push(
        <div key={r} className="grid grid-cols-10 gap-1 sm:gap-1.5">
          {rowTiles}
        </div>
      );
    }
    return rows;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 space-y-6">
      {/* If Game Not Started Yet: Student Selection Setup */}
      {!isGameStarted ? (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-sky-100 space-y-6">
          <div className="max-w-3xl space-y-2">
            <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-cyan-100 text-cyan-800">
              Langkah 2: Pilih Siswa Pemain
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-800">
              Persiapan Permainan Ular Tangga IPAS
            </h2>
            <p className="text-sm text-slate-600">
              Pilih mode bermain (Siswa Tunggal atau Kelompok 2-4 Siswa) dari daftar 25 siswa kelas 5 SD. Nilai hasil kuis dan penyelesaian game akan langsung tersimpan di Laporan Guru.
            </p>
          </div>

          {/* Mode Selector */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                setGameMode('single');
                const firstId = selectedStudentIds[0] || 1;
                setSelectedStudentIds([firstId]);
                const matched = students.find(s => s.id === firstId);
                if (matched) setStudentNameInput(matched.name);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold border transition-all ${
                gameMode === 'single'
                  ? 'bg-sky-600 text-white border-sky-600 shadow-md shadow-sky-200'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Mode Siswa Tunggal (1 Orang)</span>
            </button>

            <button
              onClick={() => {
                setGameMode('group');
                if (selectedStudentIds.length === 1) {
                  setSelectedStudentIds([selectedStudentIds[0], 2]);
                }
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold border transition-all ${
                gameMode === 'group'
                  ? 'bg-sky-600 text-white border-sky-600 shadow-md shadow-sky-200'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Mode Kelompok / Bergantian (2 - 4 Orang)</span>
            </button>
          </div>

          {/* Input Identitas Siswa & Kelas (untuk Google Sheets & Laporan) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-sky-50/80 border border-sky-200 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4 text-sky-700" />
                <h3 className="text-sm font-extrabold text-sky-950">
                  Data Siswa & Kelas (Otomatis Terkirim ke Google Sheets)
                </h3>
              </div>
              <span className="text-[11px] font-bold text-sky-700 bg-white px-2.5 py-0.5 rounded-full border border-sky-200">
                Wajib Diisi Sebelum Bermain
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {gameMode === 'single' ? (
                <div>
                  <label htmlFor="input-nama-siswa" className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Nama Siswa
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      id="input-nama-siswa"
                      type="text"
                      value={studentNameInput}
                      onChange={(e) => {
                        setStudentNameInput(e.target.value);
                        setSetupError('');
                      }}
                      placeholder="Pilih dari daftar di bawah atau ketik nama..."
                      className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-hidden font-semibold text-slate-800"
                      required
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase">
                    Nama Pemain Kelompok ({selectedStudentIds.length} Siswa)
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {students
                      .filter(s => selectedStudentIds.includes(s.id))
                      .map((s, idx) => (
                        <div key={s.id} className="relative flex items-center gap-2">
                          <span className="text-[10px] font-black w-5 h-5 rounded-md bg-sky-600 text-white flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <input
                            type="text"
                            value={groupCustomNames[s.id] ?? s.name}
                            onChange={(e) => {
                              setGroupCustomNames(prev => ({ ...prev, [s.id]: e.target.value }));
                              setSetupError('');
                            }}
                            placeholder={`Nama Siswa ${idx + 1}`}
                            className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-hidden font-semibold text-slate-800"
                          />
                        </div>
                      ))}
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="input-kelas-siswa" className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Kelas
                </label>
                <div className="relative">
                  <GraduationCap className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    id="input-kelas-siswa"
                    type="text"
                    value={studentClassInput}
                    onChange={(e) => {
                      setStudentClassInput(e.target.value);
                      setSetupError('');
                    }}
                    placeholder="Contoh: Kelas V (Lima) / 5A"
                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-hidden font-semibold text-slate-800"
                    required
                  />
                </div>
              </div>
            </div>

            {setupError && (
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{setupError}</span>
              </div>
            )}
          </div>

          {/* 25 Student Selection Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase text-slate-700">
                Pilih Cepat dari Daftar 25 Siswa ({selectedStudentIds.length} Siswa Terpilih):
              </label>
              <span className="text-xs text-slate-500">
                {gameMode === 'single' ? 'Klik 1 siswa untuk mengisi otomatis' : 'Maksimal 4 siswa per sesi'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 max-h-72 overflow-y-auto p-1">
              {students.map((student) => {
                const isSelected =
                  gameMode === 'single'
                    ? studentNameInput.trim().toLowerCase() === student.name.toLowerCase()
                    : selectedStudentIds.includes(student.id);
                const scoreInfo = studentScores.find(s => s.studentId === student.id);

                return (
                  <button
                    key={student.id}
                    type="button"
                    onClick={() => {
                      setSetupError('');
                      if (gameMode === 'single') {
                        setSelectedStudentIds([student.id]);
                        setStudentNameInput(student.name);
                      } else {
                        if (isSelected) {
                          if (selectedStudentIds.length > 1) {
                            setSelectedStudentIds(selectedStudentIds.filter(id => id !== student.id));
                          }
                        } else {
                          if (selectedStudentIds.length < 4) {
                            setSelectedStudentIds([...selectedStudentIds, student.id]);
                          }
                        }
                      }
                    }}
                    className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-sky-500 bg-sky-50/80 ring-2 ring-sky-300 shadow-sm'
                        : 'border-slate-200 bg-white hover:border-sky-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-[10px] font-black w-5 h-5 rounded-md flex items-center justify-center ${isSelected ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                        {student.no}
                      </span>
                      {scoreInfo?.hasPlayed && (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-full">
                          Nilai: {scoreInfo.score}
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-extrabold text-slate-800 truncate" title={student.name}>
                      {student.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action to Start Game */}
          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
            <button
              onClick={onNavigateToReading}
              className="text-xs sm:text-sm font-semibold text-slate-600 hover:text-sky-600"
            >
              ← Kembali Baca Materi Dahulu
            </button>

            <button
              onClick={handleStartGame}
              className="flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-sky-600 via-cyan-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white font-black text-sm shadow-xl shadow-cyan-900/15 transition-all hover:scale-102"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Mulai Petualangan Ular Tangga Air!</span>
            </button>
          </div>
        </div>
      ) : (
        /* Game is Active */
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left / Main: The 50 Tiles Board */}
          <div className="lg:col-span-3 space-y-4">
            {/* Top Game Bar */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-sky-100 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {players.map((p, i) => (
                    <div
                      key={i}
                      className={`w-9 h-9 rounded-full ${p.color} border-2 border-white flex items-center justify-center text-sm shadow-md ${
                        i === activePlayerIndex ? 'ring-2 ring-amber-400 scale-110 z-10' : 'opacity-80'
                      }`}
                      title={p.student.name}
                    >
                      {p.avatarIcon}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500">Giliran Saat Ini:</span>
                    <span className="text-xs sm:text-sm font-black text-slate-900 px-2 py-0.5 rounded-md bg-amber-100 text-amber-900">
                      {players[activePlayerIndex]?.student.name}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Petak: <strong>{players[activePlayerIndex]?.position}</strong> / 50 • Skor: <strong>{players[activePlayerIndex]?.score}</strong> • Benar: <strong>{players[activePlayerIndex]?.correctAnswers}</strong>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleResetGame}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                  title="Pilih siswa lain / ganti pemain"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Ganti Pemain</span>
                </button>

                <button
                  onClick={onNavigateToReport}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200 text-xs font-bold text-indigo-700 hover:bg-indigo-100"
                >
                  <Trophy className="w-3.5 h-3.5" />
                  <span>Lihat Buku Nilai</span>
                </button>
              </div>
            </div>

            {/* Board Container */}
            <div className="bg-gradient-to-b from-sky-100/60 to-cyan-50/60 p-3 sm:p-5 rounded-3xl border-2 border-sky-200 shadow-md">
              <div className="space-y-1 sm:space-y-1.5">
                {renderBoardGrid()}
              </div>

              {/* Board Legend */}
              <div className="mt-4 pt-3 border-t border-sky-200/80 flex flex-wrap items-center justify-between gap-3 text-[11px] font-bold text-slate-700">
                <div className="flex items-center gap-4 flex-wrap">
                  <span className="flex items-center gap-1">
                    <span className="text-sm">🪜</span> Tangga: Perilaku Bijak Air (Naik Petak)
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="text-sm">🐍</span> Ular: Pencemaran / Pemborosan (Turun Petak)
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="text-sm">❓</span> Petak Kuis IPAS
                  </span>
                </div>
                <div className="text-sky-700">
                  Target: Capai Petak 50 (Samudra Lestari)
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar: Dice & Live Player Stats & Logs */}
          <div className="space-y-4">
            {/* Interactive Dice Card */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-sky-100 text-center flex flex-col items-center justify-center space-y-4">
              <div className="text-xs font-black uppercase text-slate-500 tracking-wider">
                Kotak Pengocok Dadu
              </div>

              <Dice
                onRoll={handleDiceRoll}
                disabled={isMoving || !!winner}
                currentValue={lastDiceValue}
              />

              {winner && (
                <div className="w-full p-3 rounded-2xl bg-amber-100 text-amber-950 font-black text-xs animate-bounce">
                  🎉 {winner.student.name} TELAH FINISH!
                </div>
              )}
            </div>

            {/* Players Status List */}
            <div className="bg-white rounded-3xl p-5 shadow-sm border border-sky-100 space-y-3">
              <h3 className="text-xs font-black uppercase text-slate-600 tracking-wider">
                Peringkat & Posisi Siswa
              </h3>

              <div className="space-y-2">
                {players.map((p, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-2xl border transition-all flex items-center justify-between ${
                      idx === activePlayerIndex
                        ? 'border-amber-400 bg-amber-50/70 ring-1 ring-amber-300'
                        : 'border-slate-100 bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <div className={`w-7 h-7 rounded-full ${p.color} text-white flex items-center justify-center text-xs shrink-0`}>
                        {p.avatarIcon}
                      </div>
                      <div className="overflow-hidden">
                        <div className="text-xs font-extrabold text-slate-800 truncate">
                          {p.student.name}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          Petak {p.position} / 50
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-black text-sky-700">
                        {p.score} Poin
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Activity Logs */}
            <div className="bg-white rounded-3xl p-5 shadow-sm border border-sky-100 space-y-2.5">
              <h3 className="text-xs font-black uppercase text-slate-600 tracking-wider">
                Catatan Langkah & Peristiwa
              </h3>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {gameLogs.map((log, idx) => (
                  <div key={idx} className="text-[11px] text-slate-600 font-medium leading-tight p-1.5 rounded-lg bg-slate-50 border border-slate-100">
                    {log}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quiz Modal Popup */}
      {activeQuiz && (
        <QuizModal
          question={activeQuiz.question}
          studentName={players[activeQuiz.playerIdx]?.student.name || "Siswa"}
          onAnswer={handleQuizAnswer}
          questionNumber={activeQuiz.questionNumber}
        />
      )}

      {/* Victory Celebration Modal */}
      {winner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in zoom-in-95 duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 text-center shadow-2xl border-2 border-amber-300 space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-300 flex items-center justify-center text-3xl shadow-lg shadow-amber-300/50 animate-bounce">
              🏆
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-amber-100 text-amber-900">
                Juara Air Sumber Kehidupan
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                Selamat, {winner.student.name}!
              </h3>
              <p className="text-xs text-slate-600">
                Kamu telah menyelesaikan petualangan siklus air dan berhasil membawa tetes air bersih kembali ke samudra!
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-100 grid grid-cols-2 gap-2 text-center">
              <div>
                <div className="text-[11px] text-slate-500 font-bold">Nilai Akhir</div>
                <div className="text-xl font-black text-sky-700">{finalAwardedScore} / 100</div>
              </div>
              <div>
                <div className="text-[11px] text-slate-500 font-bold">Kuis Benar</div>
                <div className="text-xl font-black text-emerald-600">{winner.correctAnswers} Soal</div>
              </div>
            </div>

            {/* Google Sheets Auto-Submission Status Card */}
            <div className={`p-3.5 rounded-2xl border text-left space-y-2.5 ${
              sheetSyncStatus === 'sent'
                ? 'bg-emerald-50 border-emerald-200'
                : sheetSyncStatus === 'error'
                ? 'bg-rose-50 border-rose-200'
                : 'bg-indigo-50 border-indigo-200'
            }`}>
              <div className="flex items-center gap-2">
                {sheetSyncStatus === 'sending' && (
                  <>
                    <Loader2 className="w-4 h-4 text-indigo-600 animate-spin shrink-0" />
                    <span className="text-xs font-extrabold text-indigo-900">
                      Mengirim nilai otomatis ke Google Sheets...
                    </span>
                  </>
                )}
                {sheetSyncStatus === 'sent' && (
                  <>
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="text-xs font-extrabold text-emerald-900">
                      Nilai berhasil dikirim otomatis ke Google Sheets!
                    </span>
                  </>
                )}
                {sheetSyncStatus === 'error' && (
                  <>
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span className="text-xs font-extrabold text-rose-900">
                      Gagal mengirim otomatis ke Google Sheets.
                    </span>
                  </>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">
                    Nama Siswa
                  </label>
                  <input
                    type="text"
                    value={resendName}
                    onChange={(e) => setResendName(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-bold text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">
                    Kelas
                  </label>
                  <input
                    type="text"
                    value={resendClass}
                    onChange={(e) => setResendClass(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-bold text-slate-800"
                  />
                </div>
              </div>

              <button
                type="button"
                disabled={sheetSyncStatus === 'sending' || !resendName.trim() || !resendClass.trim()}
                onClick={() => submitScoreToSheet(resendName, resendClass, finalAwardedScore)}
                className="w-full py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5 text-sky-600" />
                <span>{sheetSyncStatus === 'sent' ? 'Kirim Ulang ke Google Sheets' : 'Kirim Sekarang ke Google Sheets'}</span>
              </button>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={handleResetGame}
                className="flex-1 py-3 rounded-2xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors"
              >
                Main Lagi
              </button>
              <button
                onClick={onNavigateToReport}
                className="flex-1 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-xs font-bold text-white shadow-md shadow-indigo-200 transition-colors"
              >
                Buka Laporan Nilai
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
