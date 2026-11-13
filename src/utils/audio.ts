// Web Audio API Sound Effects + Web Speech API for Indonesian Audio Narration

class SoundController {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMute(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.stopSpeech();
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  // 1. Dadu Bergulir (Dice Roll)
  public playDiceSound() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const count = 5;
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(140 + Math.random() * 260, this.ctx.currentTime);

        gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.08);
      }, i * 60);
    }
  }

  // 2. Langkah Tetes Air (Water Drop Step)
  public playStepSound() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    
    // Water droplet pitch sweep
    const now = this.ctx.currentTime;
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(950, now + 0.12);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(now + 0.15);
  }

  // 3. Naik Tangga Kebaikan Air (Ascending arpeggio)
  public playLadderSound() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const notes = [261.63, 329.63, 392.0, 523.25, 659.25]; // C4, E4, G4, C5, E5
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.18);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.18);
      }, idx * 75);
    });
  }

  // 4. Meluncur Ular Pencemaran (Descending slide whistle)
  public playSnakeSound() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';

    const now = this.ctx.currentTime;
    osc.frequency.setValueAtTime(450, now);
    osc.frequency.exponentialRampToValueAtTime(120, now + 0.45);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(now + 0.45);
  }

  // 5. Jawaban Benar (Chime Bell)
  public playCorrectSound() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.25);
      }, idx * 80);
    });
  }

  // 6. Jawaban Kurang Tepat (Gentle Boop)
  public playWrongSound() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';

    const now = this.ctx.currentTime;
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.setValueAtTime(130, now + 0.15);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(now + 0.35);
  }

  // 7. Kemenangan Garis Finish (Fanfare)
  public playVictoryFanfare() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const fanfare = [
      { f: 523.25, d: 150 }, // C5
      { f: 523.25, d: 150 }, // C5
      { f: 523.25, d: 150 }, // C5
      { f: 659.25, d: 350 }, // E5
      { f: 587.33, d: 180 }, // D5
      { f: 659.25, d: 180 }, // E5
      { f: 783.99, d: 600 }, // G5
    ];

    let delay = 0;
    fanfare.forEach((item) => {
      setTimeout(() => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(item.f, this.ctx.currentTime);

        gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + item.d / 1000);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + item.d / 1000);
      }, delay);
      delay += item.d + 30;
    });
  }

  // ============================================
  // WEB SPEECH API (SUARA INDONESIA / TTS)
  // ============================================
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  public isSpeechSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  public speakText(text: string, onStart?: () => void, onEnd?: () => void, rate: number = 0.95) {
    if (this.isMuted || !this.isSpeechSupported()) {
      return;
    }

    window.speechSynthesis.cancel();

    // Clean markdown characters or asterisks
    const cleanText = text.replace(/[*#_~`]/g, '');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'id-ID';
    utterance.rate = rate; // pleasant educational pacing
    utterance.pitch = 1.05; // slightly friendly

    // Try finding Indonesian voice
    const voices = window.speechSynthesis.getVoices();
    const idVoice = voices.find(v => v.lang.includes('id') || v.lang.includes('ID') || v.name.toLowerCase().includes('indonesia'));
    if (idVoice) {
      utterance.voice = idVoice;
    }

    utterance.onstart = () => {
      if (onStart) onStart();
    };

    utterance.onend = () => {
      this.currentUtterance = null;
      if (onEnd) onEnd();
    };

    utterance.onerror = (e) => {
      console.warn('Speech synthesis error', e);
      this.currentUtterance = null;
      if (onEnd) onEnd();
    };

    this.currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  }

  public stopSpeech() {
    if (this.isSpeechSupported()) {
      window.speechSynthesis.cancel();
      this.currentUtterance = null;
    }
  }

  public isSpeaking(): boolean {
    return this.isSpeechSupported() && window.speechSynthesis.speaking;
  }
}

export const sound = new SoundController();
