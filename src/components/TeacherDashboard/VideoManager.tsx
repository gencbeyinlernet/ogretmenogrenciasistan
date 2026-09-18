import React, { useState } from 'react';
import {
  Video,
  Plus,
  Eye,
  Trash2,
  CheckCircle2,
  Clock,
  Play,
  Users,
  X,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TeacherVideo } from '../../types';
import { VideoPlayerModal } from '../VideoPlayerModal';

export const VideoManager: React.FC = () => {
  const { videos, students, watchRecords, addVideo, deleteVideo } = useApp();

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedVideoForReport, setSelectedVideoForReport] = useState<TeacherVideo | null>(null);
  const [previewingVideo, setPreviewingVideo] = useState<TeacherVideo | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Fen Bilimleri');
  const [url, setUrl] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(10);
  const [description, setDescription] = useState('');

  const handleAddVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) return;

    addVideo({
      title: title.trim(),
      subject,
      url: url.trim(),
      durationMinutes: Number(durationMinutes) || 10,
      description: description.trim(),
    });

    setTitle('');
    setUrl('');
    setDescription('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Video className="w-5 h-5 text-indigo-600" />
            Video Paylaşımı ve Öğrenci İzleme Takibi
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Paylaştığınız her video otomatik olarak öğrencilerin ekranına gider. Hangi öğrencinin videoyu izlediğini buradan takip edebilirsiniz.
          </p>
        </div>

        <button
          id="add-teacher-video-btn"
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition flex items-center gap-2 cursor-pointer shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          Yeni Ders Videosu Ekle
        </button>
      </div>

      {/* Videos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {videos.map(vid => {
          const videoRecs = watchRecords.filter(r => r.videoId === vid.id);
          const completedWatchers = videoRecs.filter(r => r.isCompleted || r.watchedPercent >= 90);

          return (
            <div
              key={vid.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-indigo-200 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded-md border border-emerald-200">
                    {vid.subject}
                  </span>
                  <button
                    onClick={() => {
                      if (confirm(`"${vid.title}" videosunu kaldırmak istediğinize emin misiniz?`)) {
                        deleteVideo(vid.id);
                      }
                    }}
                    className="text-slate-400 hover:text-rose-600 p-1 rounded-lg transition cursor-pointer"
                    title="Videoyu Sil"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="text-sm font-bold text-slate-900 line-clamp-1 mb-1">
                  {vid.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
                  {vid.description || 'Öğretmen ders içeriği videosu.'}
                </p>

                <div className="flex items-center gap-3 text-[11px] text-slate-500 mb-4">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {vid.durationMinutes} dakika
                  </span>
                  <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                    <Eye className="w-3.5 h-3.5" />
                    {completedWatchers.length} / {students.length} İzledi
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                <button
                  onClick={() => setPreviewingVideo(vid)}
                  className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 text-indigo-600" />
                  Videoyu Önizle
                </button>

                <button
                  onClick={() => setSelectedVideoForReport(vid)}
                  className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Users className="w-3.5 h-3.5" />
                  Hangi Öğrenciler İzledi? ({completedWatchers.length})
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Video Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-200">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Video className="w-4 h-4 text-indigo-600" />
                Yeni Ders Videosu Paylaş
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddVideo} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Video Başlığı
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Örn: Hücre Bölünmesi ve Organeller Konu Anlatımı"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Ders / Konu
                  </label>
                  <select
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Fen Bilimleri">Fen Bilimleri</option>
                    <option value="Matematik">Matematik</option>
                    <option value="Türkçe">Türkçe</option>
                    <option value="Sosyal Bilgiler">Sosyal Bilgiler</option>
                    <option value="İngilizce">İngilizce</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tahmini Süre (dk)
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={durationMinutes}
                    onChange={e => setDurationMinutes(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Video Bağlantısı (YouTube veya MP4)
                </label>
                <input
                  type="url"
                  required
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=... veya MP4 linki"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  YouTube linkleri gömülü oynatıcı olarak doğrudan uygulamada çalışır.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Açıklama & Öğrencilere Notlar
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Videoyu izlerken defterinize not almayı unutmayınız..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-medium cursor-pointer"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-sm"
                >
                  Videoyu Paylaş
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Video Watchers Report Modal */}
      {selectedVideoForReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[85vh] overflow-hidden shadow-2xl border border-slate-200 flex flex-col">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md">
                  {selectedVideoForReport.subject}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  "{selectedVideoForReport.title}" - İzleme Raporu
                </h3>
              </div>
              <button
                onClick={() => setSelectedVideoForReport(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-3">
              <div className="text-xs text-slate-500 mb-2">
                Sınıftaki tüm öğrencilerin bu videoyu izleme durumları:
              </div>

              {students.map(std => {
                const rec = watchRecords.find(
                  r => r.videoId === selectedVideoForReport.id && r.studentUsername === std.username
                );

                const isCompleted = rec?.isCompleted || (rec && rec.watchedPercent >= 90);

                return (
                  <div
                    key={std.username}
                    className={`p-3.5 rounded-xl border flex items-center justify-between text-xs transition ${
                      rec
                        ? isCompleted
                          ? 'bg-emerald-50/40 border-emerald-200'
                          : 'bg-amber-50/40 border-amber-200'
                        : 'bg-slate-50/40 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={std.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                        alt={std.name}
                        className="w-9 h-9 rounded-xl object-cover border border-slate-200"
                      />
                      <div>
                        <div className="font-bold text-slate-800">{std.name}</div>
                        <div className="text-[10px] text-slate-400">@{std.username}</div>
                      </div>
                    </div>

                    <div>
                      {rec ? (
                        <div className="text-right">
                          <div className="flex items-center gap-1.5 justify-end">
                            {isCompleted ? (
                              <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold rounded-lg text-xs flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                %{rec.watchedPercent} İzledi (Tamamlandı)
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 bg-amber-100 text-amber-800 font-semibold rounded-lg text-xs">
                                %{rec.watchedPercent} İzledi (Devam Ediyor)
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-400 mt-1">
                            Son izleme: {new Date(rec.lastWatchedAt).toLocaleDateString('tr-TR')} {new Date(rec.lastWatchedAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      ) : (
                        <span className="px-2.5 py-1 bg-slate-100 text-slate-400 rounded-lg text-xs font-medium">
                          Henüz İzlemedi
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Video Player Preview Modal */}
      {previewingVideo && (
        <VideoPlayerModal
          video={previewingVideo}
          onClose={() => setPreviewingVideo(null)}
          isStudentMode={false}
        />
      )}

    </div>
  );
};
