import React, { useState, useEffect } from 'react';
import { Volume2, CheckCircle, XCircle, ArrowRight, Sparkles, HelpCircle } from 'lucide-react';
import { Question } from '../types';
import { sound } from '../utils/audio';

interface QuizModalProps {
  question: Question;
  studentName: string;
  onAnswer: (isCorrect: boolean) => void;
  questionNumber: number;
}

export const QuizModal: React.FC<QuizModalProps> = ({
  question,
  studentName,
  onAnswer,
  questionNumber,
}) => {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isReadingVoice, setIsReadingVoice] = useState(false);

  // Read aloud automatically or on mount
  useEffect(() => {
    handleSpeakQuestion();
    return () => {
      sound.stopSpeech();
    };
  }, [question]);

  const handleSpeakQuestion = () => {
    sound.stopSpeech();
    setIsReadingVoice(true);

    const optionsSpeech = question.options
      .map((opt, i) => `Pilihan ${String.fromCharCode(65 + i)}: ${opt}`)
      .join('. ');
    const fullText = `Pertanyaan nomor ${questionNumber} untuk ${studentName}. ${question.question}. ${optionsSpeech}`;

    sound.speakText(
      fullText,
      () => setIsReadingVoice(true),
      () => setIsReadingVoice(false),
      0.95
    );
  };

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;

    setSelectedIdx(idx);
    setIsAnswered(true);
    sound.stopSpeech();

    const isCorrect = idx === question.correctIndex;
    if (isCorrect) {
      sound.playCorrectSound();
      // Optional voice praise
      setTimeout(() => {
        sound.speakText(`Luar biasa, jawabanmu benar!`);
      }, 500);
    } else {
      sound.playWrongSound();
      setTimeout(() => {
        sound.speakText(`Jawaban yang benar adalah ${question.options[question.correctIndex]}.`);
      }, 500);
    }
  };

  const handleContinue = () => {
    sound.stopSpeech();
    if (selectedIdx !== null) {
      onAnswer(selectedIdx === question.correctIndex);
    }
  };

  const optionLetters = ['A', 'B', 'C', 'D'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border-2 border-sky-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-sky-600 via-cyan-600 to-blue-600 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <HelpCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/20 text-white">
                  Tantangan Kuis #{questionNumber}
                </span>
                <span className="text-xs font-semibold text-sky-100">
                  {question.category === 'daur-air' ? 'Daur Air' : question.category === 'kelestarian' ? 'Kelestarian Air' : 'Fungsi & Sumber Air'}
                </span>
              </div>
              <p className="text-xs text-sky-100 mt-0.5 font-medium">
                Giliran Siswa: <strong className="text-white">{studentName}</strong>
              </p>
            </div>
          </div>

          {/* Voice Narration Button */}
          <button
            onClick={handleSpeakQuestion}
            title="Dengarkan Soal Bersuara"
            className={`p-2.5 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-bold ${
              isReadingVoice
                ? 'bg-amber-400 text-amber-950 border-amber-300 animate-pulse'
                : 'bg-white/20 hover:bg-white/30 text-white border-white/20'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            <span className="hidden sm:inline">Dengarkan</span>
          </button>
        </div>

        {/* Question Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Question Text */}
          <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-100">
            <h3 className="text-base sm:text-lg font-bold text-slate-800 leading-snug">
              {question.question}
            </h3>
          </div>

          {/* Options */}
          <div className="space-y-2.5">
            {question.options.map((opt, idx) => {
              let btnClass = "border-slate-200 bg-white hover:border-sky-400 hover:bg-sky-50/50 text-slate-800";
              let badgeClass = "bg-slate-100 text-slate-700";

              if (isAnswered) {
                if (idx === question.correctIndex) {
                  btnClass = "border-emerald-500 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-300 font-bold";
                  badgeClass = "bg-emerald-600 text-white";
                } else if (idx === selectedIdx) {
                  btnClass = "border-rose-500 bg-rose-50 text-rose-900 line-through";
                  badgeClass = "bg-rose-600 text-white";
                } else {
                  btnClass = "border-slate-200 bg-slate-50 text-slate-400 opacity-60";
                }
              }

              return (
                <button
                  key={idx}
                  disabled={isAnswered}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between gap-3 ${btnClass}`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${badgeClass}`}>
                      {optionLetters[idx]}
                    </span>
                    <span className="text-sm font-medium">{opt}</span>
                  </div>

                  {isAnswered && idx === question.correctIndex && (
                    <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                  )}
                  {isAnswered && idx === selectedIdx && idx !== question.correctIndex && (
                    <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Banner when answered */}
          {isAnswered && (
            <div className={`p-4 rounded-2xl border animate-in fade-in slide-in-from-top-2 duration-300 ${
              selectedIdx === question.correctIndex 
                ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950' 
                : 'bg-amber-50/80 border-amber-200 text-amber-950'
            }`}>
              <div className="flex items-center gap-2 font-black text-sm mb-1">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>
                  {selectedIdx === question.correctIndex ? 'Hebat Sekali! (+10 Nilai)' : 'Pembahasan Jawaban:'}
                </span>
              </div>
              <p className="text-xs sm:text-sm font-medium leading-relaxed">
                {question.explanation}
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        {isAnswered && (
          <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end">
            <button
              onClick={handleContinue}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-700 hover:to-cyan-700 text-white font-extrabold text-sm shadow-md shadow-sky-300 transition-all hover:scale-102"
            >
              <span>Lanjut ke Papan Ular Tangga</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
