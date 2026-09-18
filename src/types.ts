export type Role = 'teacher' | 'student';

export interface User {
  username: string;
  role: Role;
  name: string;
  registeredAt: string;
  avatar?: string;
  themeColor?: string; // for student customization
  bio?: string;
  quote?: string;
}

export interface StudentCustomization {
  themeColor: string; // 'indigo' | 'emerald' | 'rose' | 'amber' | 'sky' | 'violet'
  bio: string;
  quote: string;
  avatar: string;
}

export interface StudentPersonalItem {
  id: string;
  studentUsername: string;
  type: 'note' | 'video' | 'link';
  title: string;
  content: string; // note text or notes about video/link
  url?: string;
  category?: string;
  color?: string;
  createdAt: string;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  subject: string;
  dueDate: string;
  maxScore: number;
  attachmentUrl?: string;
  createdAt: string;
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  studentUsername: string;
  submittedAt: string;
  content: string;
  attachmentUrl?: string;
  score?: number;
  feedback?: string;
  status: 'submitted' | 'graded';
}

export interface TeacherVideo {
  id: string;
  title: string;
  description: string;
  url: string; // YouTube or direct MP4 URL
  subject: string;
  durationMinutes: number;
  createdAt: string;
}

export interface VideoWatchRecord {
  id: string;
  videoId: string;
  studentUsername: string;
  watchedPercent: number;
  isCompleted: boolean;
  lastWatchedAt: string;
}

export type GameType = 'built-in-math' | 'built-in-words' | 'built-in-memory' | 'external-link';

export interface TeacherGameOrLink {
  id: string;
  title: string;
  description: string;
  type: GameType;
  url?: string;
  subject?: string;
  badge?: string;
  createdAt: string;
}

export interface GamePlayRecord {
  id: string;
  gameId: string;
  studentUsername: string;
  score?: number;
  playedAt: string;
}

export interface Message {
  id: string;
  from: string; // studentUsername or 'burak'
  to: string; // studentUsername or 'burak'
  studentUsername: string; // Thread key
  content: string;
  createdAt: string;
  isRead: boolean;
}

export interface StudentActivity {
  id: string;
  studentUsername: string;
  action: 'register' | 'login' | 'watch_video' | 'submit_assignment' | 'play_game' | 'add_personal_item' | 'send_message';
  detail: string;
  timestamp: string;
}
