import React, { useState } from 'react';
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Send,
  Award,
  ExternalLink,
  Edit2,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { Assignment } from '../../types';

export const StudentHomework: React.FC = () => {
  const { currentUser, assignments, submissions, submitHomework } = useApp();

  const [activeAsg, setActiveAsg] = useState<Assignment | null>(null);
  const [submissionText, setSubmissionText] = useState('');
  const [attachmentUrl, setAttachmentUrl] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'submitted'>('all');

  if (!currentUser) return null;

  const mySubmissions = submissions.filter(s => s.studentUsername === currentUser.username);

  const handleOpenSubmitModal = (asg: Assignment) => {
    setActiveAsg(asg);
    const existing = mySubmissions.find(s => s.assignmentId === asg.id);
    if (existing) {
      setSubmissionText(existing.content);
      setAttachmentUrl(existing.attachmentUrl || '');
    } else {
      setSubmissionText('');
      setAttachmentUrl('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeAsg || !submissionText.trim()) return;

    submitHomework(activeAsg.id, submissionText.trim(), attachmentUrl.trim() || undefined);

    try {
      confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
    } catch {
      // ignore
    }

    setActiveAsg(null);
  };

  const filteredAssignments = assignments.filter(asg => {
    const isSubmitted = mySubmissions.some(s => s.assignmentId === asg.id);
    if (filter === 'pending') return !isSubmitted;
    if (filter === 'submitted') return isSubmitted;
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Header & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            Ders Ödevlerim ve Teslimler
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Öğretmeninizin atadığı ödevleri inceleyip cevaplarınızı sisteme gönderebilirsiniz.
          </p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              filter === 'all' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tümü ({assignments.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              filter === 'pending' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Bekleyenler
          </button>
          <button
            onClick={() => setFilter('submitted')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              filter === 'submitted' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Teslim Edilenler
          </button>
        </div>
      </div>

      {/* Assignment Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredAssignments.map(asg => {
          const sub = mySubmissions.find(s => s.assignmentId === asg.id);

          return (
            <div
              key={asg.id}
              className={`rounded-2xl border p-5 shadow-xs transition flex flex-col justify-between ${
                sub
                  ? sub.status === 'graded'
                    ? 'bg-white border-emerald-200'
                    : 'bg-white border-amber-200'
                  : 'bg-white border-slate-200 hover:border-indigo-200'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-indigo-50 text-indigo-800 rounded-md border border-indigo-200">
                    {asg.subject}
                  </span>
                  {sub && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 ${
                      sub.status === 'graded' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      <CheckCircle2 className="w-3 h-3" />
                      {sub.status === 'graded' ? 'Notlandırıldı' : 'Teslim Edildi'}
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-bold text-slate-900 mb-1">{asg.title}</h3>
                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
                  {asg.description}
                </p>

                {asg.attachmentUrl && (
                  <div className="mb-4">
                    <a
                      href={asg.attachmentUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-indigo-600 hover:underline inline-flex items-center gap-1"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Öğretmenin Kaynak Bağlantısı
                    </a>
                  </div>
                )}

                <div className="flex items-center gap-2 text-[11px] text-slate-500 mb-4">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Son Teslim Tarihi: <strong>{asg.dueDate}</strong></span>
                </div>
              </div>

              {/* Submission Status or Action */}
              <div className="pt-2 border-t border-slate-100">
                {sub ? (
                  <div className="space-y-2">
                    {sub.status === 'graded' ? (
                      <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 text-xs">
                        <div className="flex items-center justify-between font-bold text-emerald-900 mb-1">
                          <span className="flex items-center gap-1">
                            <Award className="w-4 h-4 text-emerald-600" />
                            Öğretmen Notu:
                          </span>
                          <span className="text-base">{sub.score} / 100</span>
                        </div>
                        <p className="text-emerald-800 text-[11px] italic">
                          "{sub.feedback || 'Tebrikler, ödevin başarıyla tamamlandı.'}"
                        </p>
                      </div>
                    ) : (
                      <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-200 text-xs text-amber-800">
                        Ödevin öğretmene iletildi, kontrol bekleniyor.
                      </div>
                    )}

                    <button
                      onClick={() => handleOpenSubmitModal(asg)}
                      className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      Teslim Edilen Yanıtı Gör / Güncelle
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleOpenSubmitModal(asg)}
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Ödevi Teslim Et
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Submit Homework Modal */}
      {activeAsg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-200">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded-md">
                  {activeAsg.subject}
                </span>
                <h3 className="text-sm font-bold text-slate-900 mt-1">{activeAsg.title}</h3>
              </div>
              <button
                onClick={() => setActiveAsg(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs text-slate-700">
                <span className="font-bold block mb-1">Ödev Talimatı:</span>
                <p className="whitespace-pre-line leading-relaxed">{activeAsg.description}</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Ödev Yanıtınız / Açıklamanız
                </label>
                <textarea
                  rows={5}
                  required
                  value={submissionText}
                  onChange={e => setSubmissionText(e.target.value)}
                  placeholder="Soruların çözümlerini, araştırmanızı veya ödev metninizi buraya yazınız..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Opsiyonel Çalışma Linki (Google Docs, Drive, Canva veya Sunum)
                </label>
                <input
                  type="url"
                  value={attachmentUrl}
                  onChange={e => setAttachmentUrl(e.target.value)}
                  placeholder="https://docs.google.com/... veya https://..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveAsg(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-medium cursor-pointer"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-sm flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  Ödevi Gönder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
