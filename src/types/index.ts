export interface Student {
  id: number;
  no: number;
  name: string;
}

export interface StudentScore {
  studentId: number;
  studentName: string;
  hasPlayed: boolean;
  score: number; // 0 - 100
  correctCount: number;
  wrongCount: number;
  tilesReached: number;
  finished: boolean;
  durationSeconds: number;
  completedAt?: string;
  notes?: string;
}

export interface Question {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  category: 'daur-air' | 'fungsi-air' | 'kelestarian' | 'sumber-air';
  difficulty: 'mudah' | 'sedang' | 'menantang';
}

export interface LadderSnake {
  start: number;
  end: number;
  type: 'ladder' | 'snake';
  label: string;
  description: string;
  iconName: string;
}

export interface ReadingSubSection {
  id: string;
  title: string;
  badge: string;
  content: string;
  bullets?: string[];
  tips?: string;
  icon: string;
}

export interface SchoolInfo {
  schoolName: string;
  className: string;
  teacherName: string;
  teacherNip: string;
  principalName: string;
  principalNip: string;
  academicYear: string;
  semester: string;
  kkm: number;
}
