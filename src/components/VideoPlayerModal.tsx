import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Video, Eye, ExternalLink } from 'lucide-react';
import { TeacherVideo } from '../types';
import { useApp } from '../context/AppContext';

interface VideoPlayerModalProps {
  video: TeacherVideo | null;
  onClose: () => void;
  isStudentMode?: boolean;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({ video, onClose, isStudentMode }) => {
  const { recordVideoWatch, watchRecords, currentUser } = useApp();
  const [currentProgress, setCurrentProgress] = useState(0);

  useEffect(() => {
    if (video && currentUser && isStudentMode) {
      const existing = watchRecords.find(
        r => r.videoId === video.id && r.studentUsername === currentUser.username
      );
      if (existing) {
        setCurrentProgress(existing.watchedPercent);
      } else {
        // Start watching: record 25% initial watch
        setCurrentProgress(25);
        recordVideoWatch(video.id, 25);
      }
    }
  }, [video, currentUser, isStudentMode]);

  if (!video) return null;

  // Extract YouTube ID
  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const youtubeId = getYouTubeId(video.url);
  const isDirectVideo = video.url.endsWith('.mp4') || video.url.endsWith('.webm');

  const handleMarkComplete = () => {
    setCurrentProgress(100);
    recordVideoWatch(video.id, 100);
  };

  const handleUpdateProgress = (val: number) => {
    setCurrentProgress(val);
    recordVideoWatch(video.id, val);
  };

  return (
    <div id="video-player-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 px-6 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 text-indigo-700 rounded-xl">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-md border border-indigo-200">
                  {video.subject}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {video.durationMinutes} dakika
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 line-clamp-1 mt-0.5">
                {video.title}
              </h3>
            </div>
          </div>
          <button
            id="close-video-modal-btn"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Area */}
        <div className="relative bg-black w-full aspect-video flex items-center justify-center overflow-hidden">
          {youtubeId ? (
            <iframe
              src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`}
              title={video.title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : isDirectVideo ? (
            <video
              src={video.url}
              controls
              autoPlay
              className="w-full h-full object-contain"
              onEnded={() => isStudentMode && handleMarkComplete()}
            />
          ) : (
            <div className="text-center p-8 text-white">
              <p className="text-slate-300 mb-4">Bu video harici bir bağlantıda yer alıyor.</p>
              <a
                href={video.url}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl inline-flex items-center gap-2"
              >
                Videoyu Yeni Sekmede Aç
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          )}
        </div>

        {/* Footer / Controls */}
        <div className="p-4 sm:p-6 bg-white border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex-1">
            <p className="text-xs text-slate-500 font-medium line-clamp-2">
              {video.description || 'Öğretmeniniz tarafından paylaşılan ders içeriği.'}
            </p>
          </div>

          {isStudentMode && (
            <div className="flex items-center gap-4 bg-slate-50 p-2.5 px-4 rounded-xl border border-slate-200 shrink-0">
              <div className="text-right">
                <div className="text-xs text-slate-500 font-medium">İzleme İlerlemesi</div>
                <div className="text-sm font-bold text-indigo-700">%{currentProgress}</div>
              </div>

              {currentProgress >= 95 ? (
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  İzlendi
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleUpdateProgress(Math.min(currentProgress + 25, 100))}
                    className="text-xs px-2.5 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg font-medium text-slate-700 cursor-pointer"
                  >
                    +25% İlerle
                  </button>
                  <button
                    id="mark-video-complete-btn"
                    onClick={handleMarkComplete}
                    className="text-xs px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition cursor-pointer flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Bitirdim
                  </button>
                </div>
              )}
            </div>
          )}

          {!isStudentMode && (
            <div className="inline-flex items-center gap-1 text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
              <Eye className="w-3.5 h-3.5 text-indigo-600" />
              Öğretmen Önizleme Modu
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
