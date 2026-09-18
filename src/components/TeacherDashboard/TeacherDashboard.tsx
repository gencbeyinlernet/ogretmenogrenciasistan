import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Video,
  Gamepad2,
  MessageSquare
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TeacherOverview } from './TeacherOverview';
import { StudentTracker } from './StudentTracker';
import { HomeworkManager } from './HomeworkManager';
import { VideoManager } from './VideoManager';
import { GameManager } from './GameManager';
import { TeacherMessages } from './TeacherMessages';

export const TeacherDashboard: React.FC = () => {
  const { messages } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'homework' | 'videos' | 'games' | 'messages'>('overview');
  const [messageTargetStudent, setMessageTargetStudent] = useState<string | null>(null);

  const unreadMessagesCount = messages.filter(m => m.to === 'burak' && !m.isRead).length;

  const handleOpenStudentDetail = (_username: string) => {
    setActiveTab('students');
  };

  const handleContactStudent = (username: string) => {
    setMessageTargetStudent(username);
    setActiveTab('messages');
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Teacher Navigation Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-xs flex flex-wrap items-center gap-1.5 overflow-x-auto">
        
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'overview'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Genel Bakış</span>
        </button>

        <button
          onClick={() => setActiveTab('students')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'students'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Öğrenci Takip Paneli</span>
        </button>

        <button
          onClick={() => setActiveTab('homework')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'homework'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Ödev Takip & Notlandırma</span>
        </button>

        <button
          onClick={() => setActiveTab('videos')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'videos'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Video className="w-4 h-4" />
          <span>Video & İzlenme Takibi</span>
        </button>

        <button
          onClick={() => setActiveTab('games')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'games'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Gamepad2 className="w-4 h-4" />
          <span>Oyun & Bağlantı Yönetimi</span>
        </button>

        <button
          onClick={() => {
            setMessageTargetStudent(null);
            setActiveTab('messages');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer whitespace-nowrap relative ${
            activeTab === 'messages'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Öğrenci Mesajları</span>
          {unreadMessagesCount > 0 && (
            <span className="w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] flex items-center justify-center font-bold">
              {unreadMessagesCount}
            </span>
          )}
        </button>

      </div>

      {/* Tab Contents */}
      {activeTab === 'overview' && (
        <TeacherOverview
          onNavigate={tab => setActiveTab(tab as any)}
          onSelectStudent={handleOpenStudentDetail}
        />
      )}

      {activeTab === 'students' && (
        <StudentTracker onOpenMessageWithStudent={handleContactStudent} />
      )}

      {activeTab === 'homework' && (
        <HomeworkManager />
      )}

      {activeTab === 'videos' && (
        <VideoManager />
      )}

      {activeTab === 'games' && (
        <GameManager />
      )}

      {activeTab === 'messages' && (
        <TeacherMessages initialStudentUsername={messageTargetStudent} />
      )}

    </div>
  );
};
