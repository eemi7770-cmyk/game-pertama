import React, { useState, useEffect } from 'react';
import { 
  Volume2, 
  Square, 
  Play, 
  ArrowRight, 
  Droplets, 
  CloudRain, 
  Waves, 
  ShieldAlert, 
  CheckCircle2, 
  Sparkles,
  Sun,
  Cloud,
  Layers,
  Info
} from 'lucide-react';
import { READING_MATERIALS, AUDIO_READING_FULL_TEXT } from '../data/learningMaterial';
import { sound } from '../utils/audio';

interface ReadingSectionProps {
  onStartGame: () => void;
}

export const ReadingSection: React.FC<ReadingSectionProps> = ({ onStartGame }) => {
  const [isPlayingFull, setIsPlayingFull] = useState(false);
  const [activePlayingId, setActivePlayingId] = useState<string | null>(null);
  const [speechRate, setSpeechRate] = useState<number>(0.95);
  const [activeCycleStep, setActiveCycleStep] = useState<number>(0);

  // Stop speech when component unmounts
  useEffect(() => {
    return () => {
      sound.stopSpeech();
    };
  }, []);

  const handlePlayFull = () => {
    if (isPlayingFull) {
      sound.stopSpeech();
      setIsPlayingFull(false);
      setActivePlayingId(null);
      return;
    }

    sound.stopSpeech();
    setIsPlayingFull(true);
    setActivePlayingId('full');

    sound.speakText(
      AUDIO_READING_FULL_TEXT,
      () => {
        setIsPlayingFull(true);
      },
      () => {
        setIsPlayingFull(false);
        setActivePlayingId(null);
      },
      speechRate
    );
  };

  const handlePlaySection = (sectionId: string, title: string, content: string, bullets?: string[]) => {
    if (activePlayingId === sectionId) {
      sound.stopSpeech();
      setActivePlayingId(null);
      setIsPlayingFull(false);
      return;
    }

    sound.stopSpeech();
    setIsPlayingFull(false);
    setActivePlayingId(sectionId);

    const bulletsText = bullets ? bullets.join(". ") : "";
    const fullSectionText = `${title}. ${content}. ${bulletsText}`;

    sound.speakText(
      fullSectionText,
      () => {
        setActivePlayingId(sectionId);
      },
      () => {
        setActivePlayingId(null);
      },
      speechRate
    );
  };

  const getSectionIcon = (iconName: string) => {
    switch (iconName) {
      case 'Droplets': return <Droplets className="w-6 h-6 text-cyan-500" />;
      case 'CloudRain': return <CloudRain className="w-6 h-6 text-sky-500" />;
      case 'Waves': return <Waves className="w-6 h-6 text-blue-500" />;
      case 'ShieldAlert': return <ShieldAlert className="w-6 h-6 text-amber-500" />;
      default: return <Droplets className="w-6 h-6 text-cyan-500" />;
    }
  };

  const waterCycleSteps = [
    {
      name: "1. Evaporasi",
      desc: "Air laut dan sungai menguap menjadi uap air karena panas matahari.",
      icon: <Sun className="w-5 h-5 text-amber-500" />,
      color: "from-amber-400 to-orange-400"
    },
    {
      name: "2. Transpirasi",
      desc: "Tumbuhan mengeluarkan uap air melalui stomata daun.",
      icon: <Sparkles className="w-5 h-5 text-emerald-500" />,
      color: "from-emerald-400 to-green-500"
    },
    {
      name: "3. Kondensasi",
      desc: "Uap air mendingin dan berkumpul menjadi awan mendung.",
      icon: <Cloud className="w-5 h-5 text-sky-400" />,
      color: "from-sky-400 to-cyan-500"
    },
    {
      name: "4. Presipitasi",
      desc: "Awan jenuh menurunkan butiran air sebagai hujan ke bumi.",
      icon: <CloudRain className="w-5 h-5 text-blue-500" />,
      color: "from-blue-500 to-indigo-500"
    },
    {
      name: "5. Infiltrasi",
      desc: "Air hujan meresap ke dalam tanah menjadi cadangan air tanah.",
      icon: <Layers className="w-5 h-5 text-teal-600" />,
      color: "from-teal-500 to-emerald-600"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-sky-600 via-cyan-600 to-blue-700 p-6 sm:p-8 text-white shadow-xl shadow-cyan-900/10">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold text-sky-100">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Langkah 1: Baca & Dengarkan Materi Terlebih Dahulu
          </div>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            Air Sumber Kehidupan: <br />
            Mengenal Keajaiban Daur Air di Bumi
          </h2>
          <p className="text-sm sm:text-base text-sky-100 font-medium leading-relaxed">
            Sebelum memulai petualangan seru melempar dadu di papan Ular Tangga, mari kita pelajari mengapa air sangat berharga bagi manusia, hewan, dan tumbuhan, serta bagaimana siklus air menjaga bumi tetap hidup.
          </p>

          {/* Audio Player Bar */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={handlePlayFull}
              className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl font-bold text-sm shadow-lg transition-all ${
                isPlayingFull
                  ? 'bg-rose-500 text-white hover:bg-rose-600 shadow-rose-900/20 animate-pulse'
                  : 'bg-white text-sky-700 hover:bg-sky-50 shadow-cyan-950/20 hover:scale-102'
              }`}
            >
              {isPlayingFull ? (
                <>
                  <Square className="w-4 h-4 fill-current" />
                  <span>Hentikan Suara Narasi</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-5 h-5 text-sky-600" />
                  <span>Dengarkan Seluruh Materi (Suara Narator)</span>
                </>
              )}
            </button>

            {/* Speed Control */}
            <div className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-3 py-2 rounded-2xl text-xs font-semibold">
              <span className="text-sky-100 mr-1">Kecepatan:</span>
              <button
                onClick={() => setSpeechRate(0.8)}
                className={`px-2 py-1 rounded-lg transition-colors ${speechRate === 0.8 ? 'bg-white text-sky-800' : 'text-white hover:bg-white/10'}`}
              >
                0.8x
              </button>
              <button
                onClick={() => setSpeechRate(0.95)}
                className={`px-2 py-1 rounded-lg transition-colors ${speechRate === 0.95 ? 'bg-white text-sky-800' : 'text-white hover:bg-white/10'}`}
              >
                Normal
              </button>
              <button
                onClick={() => setSpeechRate(1.2)}
                className={`px-2 py-1 rounded-lg transition-colors ${speechRate === 1.2 ? 'bg-white text-sky-800' : 'text-white hover:bg-white/10'}`}
              >
                1.2x
              </button>
            </div>

            <button
              onClick={onStartGame}
              className="ml-auto flex items-center gap-2 px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-black text-sm shadow-lg shadow-amber-400/30 transition-all hover:scale-102"
            >
              <span>Lanjut Main Game Ular Tangga</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Decorative Water Drops */}
        <div className="absolute right-3 -bottom-8 opacity-20 pointer-events-none text-9xl">
          💧
        </div>
      </div>

      {/* Interactive Water Cycle Infographic Component */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-sky-100 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-sky-100 rounded-xl text-sky-700">
              <CloudRain className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-800 text-lg sm:text-xl">
                Bagan Interaktif: 5 Tahap Utama Daur Air
              </h3>
              <p className="text-xs text-slate-500">Klik tahapan di bawah untuk melihat penjelasannya</p>
            </div>
          </div>
          <span className="hidden sm:inline text-xs font-semibold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
            Kurikulum Merdeka IPAS Fase C
          </span>
        </div>

        {/* Cycle Step Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {waterCycleSteps.map((step, idx) => (
            <button
              key={idx}
              onClick={() => setActiveCycleStep(idx)}
              className={`p-3 rounded-2xl border text-left transition-all relative overflow-hidden ${
                activeCycleStep === idx
                  ? 'border-sky-500 bg-sky-50/80 ring-2 ring-sky-300 shadow-sm'
                  : 'border-slate-200 hover:border-sky-300 bg-slate-50/50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="p-1.5 rounded-xl bg-white shadow-xs">
                  {step.icon}
                </span>
                <span className="text-[10px] font-bold text-slate-400">Tahap {idx + 1}</span>
              </div>
              <div className="font-bold text-xs sm:text-sm text-slate-800">{step.name}</div>
            </button>
          ))}
        </div>

        {/* Active Step Highlight Box */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-50 to-cyan-50 border border-sky-200 flex items-start gap-3">
          <div className="p-2 bg-sky-600 rounded-xl text-white mt-0.5">
            <Info className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sky-950 text-sm">
              {waterCycleSteps[activeCycleStep].name}
            </h4>
            <p className="text-xs sm:text-sm text-slate-700 mt-1">
              {waterCycleSteps[activeCycleStep].desc}
            </p>
          </div>
        </div>
      </div>

      {/* Structured Reading Chapters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {READING_MATERIALS.map((section) => {
          const isThisPlaying = activePlayingId === section.id;
          return (
            <div 
              key={section.id}
              className={`bg-white rounded-3xl p-6 shadow-sm border transition-all flex flex-col justify-between ${
                isThisPlaying ? 'border-sky-500 ring-2 ring-sky-200' : 'border-sky-100 hover:border-sky-300'
              }`}
            >
              <div className="space-y-4">
                {/* Badge and TTS button */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-sky-50 rounded-xl">
                      {getSectionIcon(section.icon)}
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-sky-100 text-sky-800">
                      {section.badge}
                    </span>
                  </div>

                  <button
                    onClick={() => handlePlaySection(section.id, section.title, section.content, section.bullets)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      isThisPlaying
                        ? 'bg-rose-500 text-white animate-pulse'
                        : 'bg-sky-50 hover:bg-sky-100 text-sky-700'
                    }`}
                    title="Dengarkan bacaan bagian ini"
                  >
                    {isThisPlaying ? <Square className="w-3.5 h-3.5 fill-current" /> : <Volume2 className="w-3.5 h-3.5" />}
                    <span>{isThisPlaying ? 'Berhenti' : 'Dengarkan'}</span>
                  </button>
                </div>

                {/* Title and paragraph */}
                <div>
                  <h3 className="text-lg font-extrabold text-slate-800">
                    {section.title}
                  </h3>
                  <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                    {section.content}
                  </p>
                </div>

                {/* Bullets */}
                {section.bullets && (
                  <ul className="space-y-2 pt-2 border-t border-slate-100">
                    {section.bullets.map((bullet, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Tips footer */}
              {section.tips && (
                <div className="mt-4 p-3 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs font-semibold flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>{section.tips}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Action Card */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-700 p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl shadow-teal-900/10">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-xl sm:text-2xl font-black">Sudah Selesai Membaca dan Mendengarkan?</h3>
          <p className="text-sm text-emerald-100">
            Ayo buktikan pemahamanmu! Lempar dadu, jawab soal kuis di petak tantangan, dan bantu tetes air mencapai finish.
          </p>
        </div>
        <button
          onClick={onStartGame}
          className="px-6 py-3.5 rounded-2xl bg-white text-emerald-800 hover:bg-emerald-50 font-black text-sm shadow-lg shadow-emerald-950/20 flex items-center gap-2 hover:scale-105 transition-all shrink-0"
        >
          <span>Mulai Bermain Ular Tangga</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
