import React from 'react';
import {
  Users,
  BookOpen,
  Video,
  Gamepad2,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Eye,
  FileCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface TeacherOverviewProps {
  onNavigate: (tab: string) => void;
  onSelectStudent?: (username: string) => void;
}

export const TeacherOverview: React.FC<TeacherOverviewProps> = ({ onNavigate, onSelectStudent }) => {
  const { students, assignments, submissions, videos, watchRecords, games, activities } = useApp();

  const pendingGrading = submissions.filter(s => s.status === 'submitted').length;
  const completedWatches = watchRecords.filter(w => w.isCompleted || w.watchedPercent >= 90).length;

  return (
    <div className="space-y-6">
      
      {/* Welcome & Quick Metrics */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-semibold text-indigo-200 backdrop-blur-md mb-3 border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Öğretmen Yönetim Merkezi
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Hoş Geldiniz, Burak Öğretmenim
          </h2>
          <p className="text-indigo-200 text-sm mt-2 leading-relaxed">
            Tüm öğrencilerinizi buradan takip edebilir, yeni ödevler, ders videoları ve eğitici oyunlar atayabilirsiniz. Öğrencilerin yaptığı her etkinlik anında panelinize yansır.
          </p>

          <div className="flex flex-wrap gap-3 mt-6">
            <button
              onClick={() => onNavigate('students')}
              className="px-4 py-2.5 bg-white text-indigo-900 rounded-xl text-xs font-bold hover:bg-indigo-50 transition shadow-sm inline-flex items-center gap-2 cursor-pointer"
            >
              <Users className="w-4 h-4" />
              Öğrenci Takip Paneli
            </button>
            <button
              onClick={() => onNavigate('homework')}
              className="px-4 py-2.5 bg-indigo-700/80 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition border border-white/20 inline-flex items-center gap-2 cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              Yeni Ödev Ata
            </button>
            <button
              onClick={() => onNavigate('videos')}
              className="px-4 py-2.5 bg-indigo-700/80 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition border border-white/20 inline-flex items-center gap-2 cursor-pointer"
            >
              <Video className="w-4 h-4" />
              Video Paylaş & Takip Et
            </button>
          </div>
        </div>

        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-12 translate-y-12">
          <BookOpen className="w-96 h-96 text-white" />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div
          onClick={() => onNavigate('students')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-indigo-300 transition cursor-pointer"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500">Kayıtlı Öğrenciler</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">{students.length}</div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-emerald-500" />
            Tüm sınıf aktif takipte
          </div>
        </div>

        <div
          onClick={() => onNavigate('homework')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-amber-300 transition cursor-pointer"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500">Bekleyen Teslimler</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <FileCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">{pendingGrading}</div>
          <div className="text-[11px] text-amber-600 font-medium mt-1">
            {pendingGrading > 0 ? 'Notlandırılmayı bekliyor' : 'Tüm ödevler incelendi'}
          </div>
        </div>

        <div
          onClick={() => onNavigate('videos')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-300 transition cursor-pointer"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500">Video İzlenmeleri</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Eye className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">{completedWatches}</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">
            Tamamlanan izleme oturumu
          </div>
        </div>

        <div
          onClick={() => onNavigate('games')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-purple-300 transition cursor-pointer"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500">Eğitici Oyunlar</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Gamepad2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">{games.length}</div>
          <div className="text-[11px] text-purple-600 font-medium mt-1">
            Öğrencilere açık oyun & link
          </div>
        </div>

      </div>

      {/* Main Grid: Student Quick List & Live Activity Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Student Quick List */}
        <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-600" />
              Kayıtlı Öğrenciler ({students.length})
            </h3>
            <button
              onClick={() => onNavigate('students')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer"
            >
              Tümü <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[380px]">
            {students.map(std => {
              const stdSubs = submissions.filter(s => s.studentUsername === std.username);
              const stdWatched = watchRecords.filter(w => w.studentUsername === std.username && w.isCompleted);
              
              return (
                <div
                  key={std.username}
                  onClick={() => onSelectStudent && onSelectStudent(std.username)}
                  className="p-3 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-slate-50 transition cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={std.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                      alt={std.name}
                      className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-900">{std.name}</div>
                      <div className="text-[10px] text-slate-400">@{std.username}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-[11px] font-semibold text-indigo-700">
                      {stdSubs.length} Ödev
                    </div>
                    <div className="text-[10px] text-emerald-600">
                      {stdWatched.length} Video İzledi
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Real-time Student Activity Stream */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-600" />
                Canlı Öğrenci Etkinlik Akışı
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Öğrencilerin sisteme kayıt, video izleme ve ödev teslim bildirimleri
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-[11px] font-semibold border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Canlı
            </span>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto max-h-[380px]">
            {activities.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-xs">
                Henüz kayıtlı öğrenci etkinliği bulunmuyor.
              </div>
            ) : (
              activities.slice(0, 8).map(act => {
                const std = students.find(s => s.username === act.studentUsername);
                const studentName = std ? std.name : act.studentUsername;

                let icon = <Clock className="w-3.5 h-3.5 text-slate-400" />;
                let badgeColor = 'bg-slate-100 text-slate-600';

                if (act.action === 'watch_video') {
                  icon = <Eye className="w-3.5 h-3.5 text-emerald-600" />;
                  badgeColor = 'bg-emerald-50 text-emerald-700 border border-emerald-200';
                } else if (act.action === 'submit_assignment') {
                  icon = <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />;
                  badgeColor = 'bg-indigo-50 text-indigo-700 border border-indigo-200';
                } else if (act.action === 'play_game') {
                  icon = <Gamepad2 className="w-3.5 h-3.5 text-purple-600" />;
                  badgeColor = 'bg-purple-50 text-purple-700 border border-purple-200';
                } else if (act.action === 'register') {
                  icon = <Users className="w-3.5 h-3.5 text-sky-600" />;
                  badgeColor = 'bg-sky-50 text-sky-700 border border-sky-200';
                }

                return (
                  <div
                    key={act.id}
                    className="p-3 rounded-xl bg-slate-50/70 border border-slate-100 flex items-start gap-3 text-xs"
                  >
                    <div className={`p-2 rounded-lg shrink-0 ${badgeColor}`}>
                      {icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-slate-900">{studentName}</span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(act.timestamp).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-slate-600 text-xs mt-0.5">{act.detail}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
