import React from 'react';
import {
  BookOpen,
  Video,
  Gamepad2,
  StickyNote,
  MessageSquare,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  Play,
  Award
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TeacherVideo } from '../../types';

interface StudentOverviewProps {
  onNavigate: (tab: string) => void;
  onPlayVideo: (video: TeacherVideo) => void;
}

export const StudentOverview: React.FC<StudentOverviewProps> = ({ onNavigate, onPlayVideo }) => {
  const {
    currentUser,
    assignments,
    submissions,
    videos,
    watchRecords,
    games,
    studentItems,
    getStudentStats,
  } = useApp();

  if (!currentUser) return null;

  const stats = getStudentStats(currentUser.username);
  const mySubmissions = submissions.filter(s => s.studentUsername === currentUser.username);
  
  // Pending assignments to submit
  const pendingAssignments = assignments.filter(
    asg => !mySubmissions.some(s => s.assignmentId === asg.id)
  );

  // Latest teacher video
  const latestVideo = videos.length > 0 ? videos[0] : null;
  const isLatestVideoWatched = latestVideo
    ? watchRecords.some(r => r.videoId === latestVideo.id && r.studentUsername === currentUser.username && (r.isCompleted || r.watchedPercent >= 90))
    : false;

  // Latest teacher game
  const latestGame = games.length > 0 ? games[0] : null;

  // Student notes
  const myNotes = studentItems.filter(i => i.studentUsername === currentUser.username && i.type === 'note');

  return (
    <div className="space-y-6">
      
      {/* Student Welcome Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-semibold text-indigo-200 backdrop-blur-md mb-3 border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Öğrenci Çalışma Alanı
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Hoş Geldin, {currentUser.name}! 👋
          </h2>
          <p className="text-indigo-200 text-sm mt-2 leading-relaxed">
            Burak Öğretmenin paylaştığı ders ödevlerini, videoları ve eğlenceli oyunları buradan takip edebilirsin. Takıldığın bir soru olduğunda öğretmenine mesaj gönderebilirsin.
          </p>

          <div className="flex flex-wrap gap-3 mt-6">
            <button
              onClick={() => onNavigate('homework')}
              className="px-4 py-2.5 bg-white text-slate-900 rounded-xl text-xs font-bold hover:bg-slate-100 transition shadow-sm inline-flex items-center gap-2 cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-indigo-600" />
              Ödevlerime Git ({pendingAssignments.length} Bekleyen)
            </button>
            <button
              onClick={() => onNavigate('personal')}
              className="px-4 py-2.5 bg-indigo-800/80 hover:bg-indigo-800 text-white rounded-xl text-xs font-semibold transition border border-white/20 inline-flex items-center gap-2 cursor-pointer"
            >
              <StickyNote className="w-4 h-4" />
              Kişisel Notlarım & Alanım
            </button>
            <button
              onClick={() => onNavigate('messages')}
              className="px-4 py-2.5 bg-indigo-800/80 hover:bg-indigo-800 text-white rounded-xl text-xs font-semibold transition border border-white/20 inline-flex items-center gap-2 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              Öğretmenime Soru Sor
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div
          onClick={() => onNavigate('homework')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-indigo-300 transition cursor-pointer"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500">Ödev Durumu</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {stats.submittedCount} / {stats.assignmentsCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {pendingAssignments.length > 0 ? (
              <span className="text-amber-600 font-semibold">{pendingAssignments.length} ödev teslim bekliyor</span>
            ) : (
              <span className="text-emerald-600 font-semibold">Tüm ödevler tamam!</span>
            )}
          </div>
        </div>

        <div
          onClick={() => onNavigate('videos')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-300 transition cursor-pointer"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500">İzlenen Videolar</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Video className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600">
            {stats.watchedVideosCount} / {stats.totalVideosCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Ders videolarını tamamla
          </div>
        </div>

        <div
          onClick={() => onNavigate('games')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-purple-300 transition cursor-pointer"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500">Oyun Etkinlikleri</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Gamepad2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-purple-600">
            {stats.playedGamesCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Oynadığın eğitici oyunlar
          </div>
        </div>

        <div
          onClick={() => onNavigate('personal')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-amber-300 transition cursor-pointer"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500">Kişisel Not & Linkler</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <StickyNote className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-600">
            {stats.personalItemsCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Kendi eklediğin materyaller
          </div>
        </div>

      </div>

      {/* Main Grid: Pending Tasks & Latest Video & Games */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Pending Homework List */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                Öğretmenimin Atadığı Ödevler
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Teslim etmen gereken ve öğretmeninin notlandırdığı ödevler
              </p>
            </div>
            <button
              onClick={() => onNavigate('homework')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer"
            >
              Tüm Ödevler <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto max-h-[350px]">
            {assignments.map(asg => {
              const sub = mySubmissions.find(s => s.assignmentId === asg.id);

              return (
                <div
                  key={asg.id}
                  className="p-4 rounded-xl border border-slate-100 hover:border-indigo-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 text-[10px] font-bold rounded-md">
                        {asg.subject}
                      </span>
                      <span className="font-bold text-slate-900">{asg.title}</span>
                    </div>
                    <div className="text-slate-500 text-[11px] mt-1 line-clamp-1">
                      {asg.description}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Son Teslim: {asg.dueDate}
                    </div>
                  </div>

                  <div className="shrink-0">
                    {sub ? (
                      sub.status === 'graded' ? (
                        <div className="px-3 py-1.5 bg-emerald-100 text-emerald-800 rounded-xl font-bold text-center border border-emerald-200">
                          Not: {sub.score} / 100
                        </div>
                      ) : (
                        <div className="px-3 py-1.5 bg-amber-100 text-amber-800 rounded-xl font-semibold text-center border border-amber-200">
                          Teslim Edildi
                        </div>
                      )
                    ) : (
                      <button
                        onClick={() => onNavigate('homework')}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold cursor-pointer shadow-2xs"
                      >
                        Ödevi Teslim Et
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Latest Video & Quick Game */}
        <div className="space-y-6">
          
          {/* Latest Video Card */}
          {latestVideo && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded-md border border-emerald-200">
                  Yeni Ders Videosu
                </span>
                {isLatestVideoWatched ? (
                  <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    İzlendi
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-amber-600">İzlenmedi</span>
                )}
              </div>

              <h4 className="text-xs font-bold text-slate-900 line-clamp-1 mb-1">
                {latestVideo.title}
              </h4>
              <p className="text-[11px] text-slate-500 line-clamp-2 mb-3">
                {latestVideo.description}
              </p>

              <button
                onClick={() => onPlayVideo(latestVideo)}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Play className="w-3.5 h-3.5" />
                Videoyu İzle ({latestVideo.durationMinutes} dk)
              </button>
            </div>
          )}

          {/* Quick Educational Game */}
          {latestGame && (
            <div className="bg-white rounded-2xl border border-purple-200/80 p-5 shadow-xs bg-gradient-to-b from-purple-50/30 to-white">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-purple-100 text-purple-800 rounded-md border border-purple-200">
                  {latestGame.badge || 'Günün Eğitici Oyunu'}
                </span>
                <span className="text-[10px] font-semibold text-purple-700">
                  {latestGame.subject}
                </span>
              </div>

              <h4 className="text-xs font-bold text-slate-900 line-clamp-1 mb-1">
                {latestGame.title}
              </h4>
              <p className="text-[11px] text-slate-500 line-clamp-2 mb-3">
                {latestGame.description}
              </p>

              <button
                onClick={() => onNavigate('games')}
                className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Gamepad2 className="w-3.5 h-3.5" />
                Oyunlara Git ({games.length} Oyun)
              </button>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
