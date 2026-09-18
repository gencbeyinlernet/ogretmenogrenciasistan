import React, { useState } from 'react';
import { Video, Play, CheckCircle2, Clock, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TeacherVideo } from '../../types';
import { VideoPlayerModal } from '../VideoPlayerModal';

export const StudentVideos: React.FC = () => {
  const { videos, watchRecords, currentUser, recordVideoWatch } = useApp();
  const [selectedVideo, setSelectedVideo] = useState<TeacherVideo | null>(null);

  if (!currentUser) return null;

  const handleMarkDirectComplete = (videoId: string) => {
    recordVideoWatch(videoId, 100);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Video className="w-5 h-5 text-indigo-600" />
            Öğretmenimin Paylaştığı Ders Videoları
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Videoları izlediğinizde izleme süreniz ve tamamlanma durumunuz otomatik olarak Burak Öğretmene iletilir.
          </p>
        </div>
      </div>

      {/* Videos List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {videos.map(vid => {
          const rec = watchRecords.find(
            r => r.videoId === vid.id && r.studentUsername === currentUser.username
          );

          const isCompleted = rec?.isCompleted || (rec && rec.watchedPercent >= 90);

          return (
            <div
              key={vid.id}
              className={`rounded-2xl border p-5 shadow-xs transition flex flex-col justify-between ${
                isCompleted ? 'bg-white border-emerald-200' : 'bg-white border-slate-200 hover:border-indigo-200'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded-md border border-emerald-200">
                    {vid.subject}
                  </span>
                  {isCompleted ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      İzlendi (%100)
                    </span>
                  ) : rec ? (
                    <span className="text-[10px] font-semibold px-2 py-0.5 bg-amber-100 text-amber-800 rounded-md">
                      %{rec.watchedPercent} İzlendi
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-400">Henüz İzlenmedi</span>
                  )}
                </div>

                <h3 className="text-sm font-bold text-slate-900 mb-1">{vid.title}</h3>
                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
                  {vid.description}
                </p>

                <div className="flex items-center gap-2 text-[11px] text-slate-500 mb-4">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Süre: <strong>{vid.durationMinutes} dakika</strong></span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <button
                  onClick={() => setSelectedVideo(vid)}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Play className="w-3.5 h-3.5" />
                  {isCompleted ? 'Tekrar İzle' : 'Videoyu Başlat'}
                </button>

                {!isCompleted && (
                  <button
                    onClick={() => handleMarkDirectComplete(vid.id)}
                    className="w-full py-1.5 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 text-[11px] font-medium rounded-xl border border-slate-200 transition flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Check className="w-3 h-3" />
                    İzledim Olarak İşaretle
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Video Player Modal */}
      {selectedVideo && (
        <VideoPlayerModal
          video={selectedVideo}
          onClose={() => setSelectedVideo(null)}
          isStudentMode={true}
        />
      )}

    </div>
  );
};
