import React, { useState } from 'react';
import {
  LayoutDashboard,
  BookOpen,
  Video,
  Gamepad2,
  StickyNote,
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TeacherVideo } from '../../types';
import { StudentOverview } from './StudentOverview';
import { StudentHomework } from './StudentHomework';
import { StudentVideos } from './StudentVideos';
import { StudentGames } from './StudentGames';
import { StudentPersonalSpace } from './StudentPersonalSpace';
import { StudentMessages } from './StudentMessages';
import { VideoPlayerModal } from '../VideoPlayerModal';

export const StudentDashboard: React.FC = () => {
  const { currentUser, messages, assignments, submissions } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'homework' | 'videos' | 'games' | 'personal' | 'messages'>('overview');
  const [activeVideoModal, setActiveVideoModal] = useState<TeacherVideo | null>(null);

  if (!currentUser) return null;

  // Unread messages from teacher
  const unreadCount = messages.filter(
    m => m.studentUsername === currentUser.username && m.from === 'burak' && !m.isRead
  ).length;

  // Pending assignments count
  const mySubmissions = submissions.filter(s => s.studentUsername === currentUser.username);
  const pendingCount = assignments.filter(
    a => !mySubmissions.some(s => s.assignmentId === a.id)
  ).length;

  return (
    <div className="space-y-6 pb-12">
      
      {/* Student Navigation Bar */}
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
          onClick={() => setActiveTab('homework')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'homework'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Ödevlerim</span>
          {pendingCount > 0 && (
            <span className="px-1.5 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-full">
              {pendingCount}
            </span>
          )}
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
          <span>Ders Videoları</span>
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
          <span>Eğitici Oyunlar</span>
        </button>

        <button
          onClick={() => setActiveTab('personal')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'personal'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <StickyNote className="w-4 h-4" />
          <span>Kişisel Alanım (Not, Video & Link)</span>
        </button>

        <button
          onClick={() => setActiveTab('messages')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer whitespace-nowrap relative ${
            activeTab === 'messages'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Öğretmenime Mesaj</span>
          {unreadCount > 0 && (
            <span className="w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] flex items-center justify-center font-bold">
              {unreadCount}
            </span>
          )}
        </button>

      </div>

      {/* Tab Contents */}
      {activeTab === 'overview' && (
        <StudentOverview
          onNavigate={tab => setActiveTab(tab as any)}
          onPlayVideo={vid => setActiveVideoModal(vid)}
        />
      )}

      {activeTab === 'homework' && (
        <StudentHomework />
      )}

      {activeTab === 'videos' && (
        <StudentVideos />
      )}

      {activeTab === 'games' && (
        <StudentGames />
      )}

      {activeTab === 'personal' && (
        <StudentPersonalSpace />
      )}

      {activeTab === 'messages' && (
        <StudentMessages />
      )}

      {/* Video Player Modal */}
      {activeVideoModal && (
        <VideoPlayerModal
          video={activeVideoModal}
          onClose={() => setActiveVideoModal(null)}
          isStudentMode={true}
        />
      )}

    </div>
  );
};
