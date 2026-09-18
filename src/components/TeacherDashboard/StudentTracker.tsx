import React, { useState } from 'react';
import {
  Users,
  Search,
  CheckCircle2,
  Eye,
  Gamepad2,
  FileText,
  Clock,
  MessageSquare,
  Award,
  X,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { User } from '../../types';

interface StudentTrackerProps {
  onOpenMessageWithStudent: (username: string) => void;
  selectedStudentUsername?: string | null;
}

export const StudentTracker: React.FC<StudentTrackerProps> = ({
  onOpenMessageWithStudent,
  selectedStudentUsername,
}) => {
  const {
    students,
    assignments,
    submissions,
    videos,
    watchRecords,
    gamePlays,
    activities,
    studentItems,
    getStudentStats,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeStudent, setActiveStudent] = useState<User | null>(() => {
    if (selectedStudentUsername) {
      return students.find(s => s.username === selectedStudentUsername) || null;
    }
    return null;
  });

  const filteredStudents = students.filter(
    s =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            Öğrenci Takip ve Gözlem Paneli
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Öğrenciler birbirini görmez; siz tüm öğrencilerin ödevlerini, izlediği videoları ve aktivitelerini buradan canlı izlersiniz.
          </p>
        </div>

        <div className="relative min-w-[260px]">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Öğrenci adı veya kullanıcı adı ara..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
          />
        </div>
      </div>

      {/* Student Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredStudents.map(student => {
          const stats = getStudentStats(student.username);
          const studentSubs = submissions.filter(s => s.studentUsername === student.username);
          const recentActivity = activities.find(a => a.studentUsername === student.username);

          return (
            <div
              key={student.username}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md hover:border-indigo-200 transition flex flex-col justify-between group"
            >
              <div>
                {/* Student Header */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={student.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                      alt={student.name}
                      className="w-12 h-12 rounded-2xl object-cover border border-slate-200 shadow-2xs"
                    />
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition">
                        {student.name}
                      </h3>
                      <div className="text-[11px] text-slate-400 font-mono">
                        @{student.username}
                      </div>
                      <span className="inline-block text-[10px] text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md mt-1 font-medium">
                        Kayıt: {new Date(student.registeredAt).toLocaleDateString('tr-TR')}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onOpenMessageWithStudent(student.username)}
                    className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition cursor-pointer"
                    title="Mesaj Gönder"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>
                </div>

                {/* Metrics Badges */}
                <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 mb-4 bg-slate-50/50 rounded-xl px-2">
                  <div className="text-center">
                    <div className="text-[10px] text-slate-500 font-medium">Ödev Teslimi</div>
                    <div className="text-sm font-bold text-slate-800 mt-0.5">
                      {stats.submittedCount} / {stats.assignmentsCount}
                    </div>
                  </div>

                  <div className="text-center border-x border-slate-200">
                    <div className="text-[10px] text-slate-500 font-medium">İzlenen Video</div>
                    <div className="text-sm font-bold text-emerald-600 mt-0.5">
                      {stats.watchedVideosCount} / {stats.totalVideosCount}
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="text-[10px] text-slate-500 font-medium">Not Ort.</div>
                    <div className="text-sm font-bold text-indigo-600 mt-0.5">
                      {stats.gradedAverage !== null ? stats.gradedAverage : '-'}
                    </div>
                  </div>
                </div>

                {/* Latest Activity Snippet */}
                <div className="text-xs text-slate-600 mb-4 flex items-start gap-2">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <div className="line-clamp-2 text-[11px]">
                    {recentActivity ? recentActivity.detail : 'Henüz son aktivite kaydedilmedi.'}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => setActiveStudent(student)}
                className="w-full py-2 px-3 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 hover:border-indigo-200 transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Detaylı Öğrenci Raporu</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Student Deep Detail Modal */}
      {activeStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl border border-slate-200 flex flex-col animate-in fade-in zoom-in-95">
            
            {/* Modal Header */}
            <div className="p-6 bg-gradient-to-r from-indigo-900 to-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={activeStudent.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                  alt={activeStudent.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-white/20"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold">{activeStudent.name}</h3>
                    <span className="text-xs bg-indigo-500/30 border border-indigo-400/30 px-2 py-0.5 rounded-full">
                      @{activeStudent.username}
                    </span>
                  </div>
                  <p className="text-xs text-indigo-200 mt-1">{activeStudent.bio || 'Öğrenci profili'}</p>
                  <p className="text-[11px] text-indigo-300 mt-0.5 italic">"{activeStudent.quote || 'Başarı çalışmakla gelir.'}"</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const u = activeStudent.username;
                    setActiveStudent(null);
                    onOpenMessageWithStudent(u);
                  }}
                  className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  Mesaj Yaz
                </button>
                <button
                  onClick={() => setActiveStudent(null)}
                  className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              
              {/* Overall Summary Row */}
              <div className="grid grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="text-center">
                  <div className="text-[11px] text-slate-500 font-semibold">Ödevler</div>
                  <div className="text-lg font-black text-slate-900 mt-0.5">
                    {submissions.filter(s => s.studentUsername === activeStudent.username).length} Teslim
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-[11px] text-slate-500 font-semibold">İzlenen Video</div>
                  <div className="text-lg font-black text-emerald-600 mt-0.5">
                    {watchRecords.filter(w => w.studentUsername === activeStudent.username && (w.isCompleted || w.watchedPercent >= 80)).length} Adet
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-[11px] text-slate-500 font-semibold">Oyun / Skor</div>
                  <div className="text-lg font-black text-purple-600 mt-0.5">
                    {gamePlays.filter(g => g.studentUsername === activeStudent.username).length} Oyun
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-[11px] text-slate-500 font-semibold">Kişisel Not / Link</div>
                  <div className="text-lg font-black text-indigo-600 mt-0.5">
                    {studentItems.filter(i => i.studentUsername === activeStudent.username).length} Öğe
                  </div>
                </div>
              </div>

              {/* Submissions by this student */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                  Ödev Teslimleri ve Notlar
                </h4>

                <div className="space-y-2.5">
                  {assignments.map(asg => {
                    const sub = submissions.find(
                      s => s.assignmentId === asg.id && s.studentUsername === activeStudent.username
                    );

                    return (
                      <div
                        key={asg.id}
                        className="p-3.5 rounded-xl border border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                      >
                        <div>
                          <div className="font-bold text-slate-800">{asg.title}</div>
                          <div className="text-[11px] text-slate-400 mt-0.5">Ders: {asg.subject} | Son Tarih: {asg.dueDate}</div>
                          {sub && (
                            <div className="mt-2 text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-[11px]">
                              <strong>Öğrenci Cevabı:</strong> {sub.content}
                            </div>
                          )}
                        </div>

                        <div className="shrink-0 text-right sm:w-36">
                          {sub ? (
                            sub.status === 'graded' ? (
                              <div className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-bold">
                                Not: {sub.score} / 100
                              </div>
                            ) : (
                              <div className="px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg text-xs font-semibold">
                                Teslim Edildi (İnceleniyor)
                              </div>
                            )
                          ) : (
                            <div className="px-3 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg text-xs font-semibold">
                              Teslim Edilmedi
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Video Watch Details */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-emerald-600" />
                  Video İzleme Durumu
                </h4>

                <div className="space-y-2">
                  {videos.map(vid => {
                    const rec = watchRecords.find(
                      w => w.videoId === vid.id && w.studentUsername === activeStudent.username
                    );

                    return (
                      <div
                        key={vid.id}
                        className="p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="font-bold text-slate-800">{vid.title}</div>
                          <div className="text-[11px] text-slate-400">{vid.subject} • {vid.durationMinutes} dakika</div>
                        </div>

                        <div>
                          {rec ? (
                            <div className="flex items-center gap-2">
                              <div className="w-24 bg-slate-100 rounded-full h-2 overflow-hidden">
                                <div
                                  className="bg-emerald-500 h-full rounded-full"
                                  style={{ width: `${rec.watchedPercent}%` }}
                                />
                              </div>
                              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                                rec.watchedPercent >= 95 ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                              }`}>
                                %{rec.watchedPercent} {rec.watchedPercent >= 95 ? '(Tamamlandı)' : ''}
                              </span>
                            </div>
                          ) : (
                            <span className="text-[11px] text-slate-400 px-2.5 py-1 bg-slate-50 rounded-lg border border-slate-200">
                              Henüz İzlemedi
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Student Activity History */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-slate-600" />
                  Öğrencinin Son Hareketleri
                </h4>

                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {activities
                    .filter(a => a.studentUsername === activeStudent.username)
                    .map(act => (
                      <div key={act.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs flex justify-between gap-3">
                        <span className="text-slate-700">{act.detail}</span>
                        <span className="text-[10px] text-slate-400 shrink-0">
                          {new Date(act.timestamp).toLocaleDateString('tr-TR')}
                        </span>
                      </div>
                    ))}
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
