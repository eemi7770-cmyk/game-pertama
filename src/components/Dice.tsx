import React, { useState } from 'react';
import { sound } from '../utils/audio';

interface DiceProps {
  onRoll: (value: number) => void;
  disabled?: boolean;
  currentValue: number;
}

export const Dice: React.FC<DiceProps> = ({ onRoll, disabled, currentValue }) => {
  const [isRolling, setIsRolling] = useState(false);

  const handleRollClick = () => {
    if (disabled || isRolling) return;

    setIsRolling(true);
    sound.playDiceSound();

    // Rapid shuffle effect
    let counter = 0;
    const interval = setInterval(() => {
      counter++;
      if (counter >= 8) {
        clearInterval(interval);
        const finalValue = Math.floor(Math.random() * 6) + 1;
        setIsRolling(false);
        onRoll(finalValue);
      }
    }, 80);
  };

  // Render dice dots based on number (1 to 6)
  const renderDots = (val: number) => {
    switch (val) {
      case 1:
        return (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-rose-600 shadow-inner"></div>
          </div>
        );
      case 2:
        return (
          <div className="w-full h-full flex justify-between p-2">
            <div className="w-3.5 h-3.5 rounded-full bg-slate-800 self-start"></div>
            <div className="w-3.5 h-3.5 rounded-full bg-slate-800 self-end"></div>
          </div>
        );
      case 3:
        return (
          <div className="w-full h-full flex justify-between p-2">
            <div className="w-3 h-3 rounded-full bg-slate-800 self-start"></div>
            <div className="w-3 h-3 rounded-full bg-slate-800 self-center"></div>
            <div className="w-3 h-3 rounded-full bg-slate-800 self-end"></div>
          </div>
        );
      case 4:
        return (
          <div className="w-full h-full grid grid-cols-2 p-2 gap-2 place-items-center">
            <div className="w-3.5 h-3.5 rounded-full bg-slate-800"></div>
            <div className="w-3.5 h-3.5 rounded-full bg-slate-800"></div>
            <div className="w-3.5 h-3.5 rounded-full bg-slate-800"></div>
            <div className="w-3.5 h-3.5 rounded-full bg-slate-800"></div>
          </div>
        );
      case 5:
        return (
          <div className="w-full h-full grid grid-cols-3 p-1.5 place-items-center">
            <div className="w-3 h-3 rounded-full bg-slate-800"></div>
            <div></div>
            <div className="w-3 h-3 rounded-full bg-slate-800"></div>
            <div></div>
            <div className="w-3.5 h-3.5 rounded-full bg-rose-600"></div>
            <div></div>
            <div className="w-3 h-3 rounded-full bg-slate-800"></div>
            <div></div>
            <div className="w-3 h-3 rounded-full bg-slate-800"></div>
          </div>
        );
      case 6:
        return (
          <div className="w-full h-full grid grid-cols-2 p-2 gap-x-3 gap-y-1 place-items-center">
            <div className="w-3 h-3 rounded-full bg-slate-800"></div>
            <div className="w-3 h-3 rounded-full bg-slate-800"></div>
            <div className="w-3 h-3 rounded-full bg-slate-800"></div>
            <div className="w-3 h-3 rounded-full bg-slate-800"></div>
            <div className="w-3 h-3 rounded-full bg-slate-800"></div>
            <div className="w-3 h-3 rounded-full bg-slate-800"></div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={handleRollClick}
        disabled={disabled || isRolling}
        className={`group relative select-none touch-manipulation cursor-pointer transition-all active:scale-95 ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
        }`}
      >
        {/* Glow */}
        <div className="absolute -inset-1 bg-gradient-to-r from-sky-400 to-cyan-400 rounded-3xl blur-sm opacity-40 group-hover:opacity-80 transition duration-300"></div>

        {/* Dice Cube Body */}
        <div
          className={`relative w-20 h-20 sm:w-22 sm:h-22 bg-gradient-to-br from-white via-slate-50 to-slate-200 border-2 border-slate-300 rounded-2xl shadow-xl flex items-center justify-center transform transition-transform duration-200 ${
            isRolling ? 'rotate-45 scale-90 animate-spin' : ''
          }`}
          style={{
            boxShadow: '0 8px 0 #cbd5e1, 0 12px 16px rgba(0,0,0,0.15)',
          }}
        >
          {renderDots(currentValue)}
        </div>
      </button>

      <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
        {isRolling ? 'Mengocok Dadu...' : disabled ? 'Sedang Bergerak...' : 'Klik Dadu / Lempar!'}
      </span>
    </div>
  );
};
