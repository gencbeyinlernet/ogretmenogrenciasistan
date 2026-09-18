import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Calendar,
  CheckCircle2,
  Clock,
  Trash2,
  Send,
  Award,
  Users,
  AlertCircle,
  FileCheck,
  X,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Assignment, AssignmentSubmission } from '../../types';

export const HomeworkManager: React.FC = () => {
  const {
    assignments,
    submissions,
    students,
    addAssignment,
    deleteAssignment,
    gradeSubmission,
  } = useApp();

  const [showNewModal, setShowNewModal] = useState(false);
  const [selectedAsgForSubmissions, setSelectedAsgForSubmissions] = useState<Assignment | null>(null);

  // Form states for new assignment
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Matematik');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('2026-10-01');
  const [attachmentUrl, setAttachmentUrl] = useState('');
  const [maxScore, setMaxScore] = useState(100);

  // Form states for grading
  const [gradingSubId, setGradingSubId] = useState<string | null>(null);
  const [gradeScore, setGradeScore] = useState<number>(100);
  const [gradeFeedback, setGradeFeedback] = useState<string>('');

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    addAssignment({
      title: title.trim(),
      subject,
      description: description.trim(),
      dueDate,
      maxScore: Number(maxScore) || 100,
      attachmentUrl: attachmentUrl.trim() || undefined,
    });

    setTitle('');
    setDescription('');
    setAttachmentUrl('');
    setShowNewModal(false);
  };

  const handleSaveGrade = (subId: string) => {
    gradeSubmission(subId, gradeScore, gradeFeedback.trim() || 'Ödev kontrol edildi.');
    setGradingSubId(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Create Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            Ödev Yönetimi ve Teslim Takibi
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Öğrencilere yeni ödevler atayın, teslim edilen ödevleri inceleyin ve notlandırın.
          </p>
        </div>

        <button
          id="create-assignment-btn"
          onClick={() => setShowNewModal(true)}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition flex items-center gap-2 cursor-pointer shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          Yeni Ödev Oluştur
        </button>
      </div>

      {/* Assignments List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {assignments.map(asg => {
          const asgSubs = submissions.filter(s => s.assignmentId === asg.id);
          const gradedCount = asgSubs.filter(s => s.status === 'graded').length;
          const pendingCount = asgSubs.filter(s => s.status === 'submitted').length;

          return (
            <div
              key={asg.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-indigo-200 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-md border border-indigo-200">
                    {asg.subject}
                  </span>
                  <button
                    onClick={() => {
                      if (confirm(`"${asg.title}" ödevini silmek istediğinize emin misiniz?`)) {
                        deleteAssignment(asg.id);
                      }
                    }}
                    className="text-slate-400 hover:text-rose-600 p-1 rounded-lg transition cursor-pointer"
                    title="Ödevi Sil"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="text-sm font-bold text-slate-900 line-clamp-1 mb-1">
                  {asg.title}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                  {asg.description}
                </p>

                <div className="flex items-center gap-2 text-[11px] text-slate-500 mb-4">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Son Teslim: <strong>{asg.dueDate}</strong></span>
                </div>
              </div>

              {/* Progress Box & Action */}
              <div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 mb-3 text-xs">
                  <div className="flex justify-between text-[11px] mb-1.5">
                    <span className="text-slate-500 font-medium">Teslim Durumu:</span>
                    <span className="font-bold text-indigo-700">{asgSubs.length} / {students.length} Öğrenci</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mb-2">
                    <div
                      className="bg-indigo-600 h-full rounded-full transition-all"
                      style={{ width: `${(asgSubs.length / Math.max(students.length, 1)) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span className="text-emerald-600 font-semibold">{gradedCount} Puanlandı</span>
                    <span className="text-amber-600 font-semibold">{pendingCount} Bekliyor</span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedAsgForSubmissions(asg)}
                  className="w-full py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <FileCheck className="w-3.5 h-3.5" />
                  Teslimleri İncele ({asgSubs.length})
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Assignment Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-200">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                Yeni Ödev Tanımla
              </h3>
              <button
                onClick={() => setShowNewModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateAssignment} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Ödev Başlığı
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Örn: Güneş Sistemi ve Gezegenler Araştırması"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Ders / Alan
                  </label>
                  <select
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Matematik">Matematik</option>
                    <option value="Fen Bilgisi">Fen Bilgisi</option>
                    <option value="Türkçe">Türkçe</option>
                    <option value="Sosyal Bilgiler">Sosyal Bilgiler</option>
                    <option value="İngilizce">İngilizce</option>
                    <option value="Bilişim & Kodlama">Bilişim & Kodlama</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Son Teslim Tarihi
                  </label>
                  <input
                    type="date"
                    required
                    value={dueDate}
                    onChange={e => setDueDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Ödev Açıklaması & Talimatlar
                </label>
                <textarea
                  rows={4}
                  required
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Öğrencilerin ne yapması gerektiğini detaylıca anlatınız..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kaynak Bağlantısı (Opsiyonel)
                </label>
                <input
                  type="url"
                  value={attachmentUrl}
                  onChange={e => setAttachmentUrl(e.target.value)}
                  placeholder="https://tr.wikipedia.org/... veya doküman linki"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-medium cursor-pointer"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-sm"
                >
                  Ödevi Yayınla
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Submissions Review Modal */}
      {selectedAsgForSubmissions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl border border-slate-200 flex flex-col">
            
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded-md">
                  {selectedAsgForSubmissions.subject}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  {selectedAsgForSubmissions.title} - Teslim Edilen Ödevler
                </h3>
              </div>
              <button
                onClick={() => setSelectedAsgForSubmissions(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              {students.map(std => {
                const sub = submissions.find(
                  s => s.assignmentId === selectedAsgForSubmissions.id && s.studentUsername === std.username
                );

                const isGradingThis = gradingSubId === sub?.id;

                return (
                  <div
                    key={std.username}
                    className={`p-4 rounded-2xl border transition ${
                      sub
                        ? sub.status === 'graded'
                          ? 'border-emerald-200 bg-emerald-50/20'
                          : 'border-amber-200 bg-amber-50/20'
                        : 'border-slate-200 bg-slate-50/40 opacity-70'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-3">
                        <img
                          src={std.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                          alt={std.name}
                          className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                        />
                        <div>
                          <div className="text-xs font-bold text-slate-900">{std.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono">@{std.username}</div>
                        </div>
                      </div>

                      <div>
                        {sub ? (
                          sub.status === 'graded' ? (
                            <span className="text-xs font-bold px-3 py-1 bg-emerald-100 text-emerald-800 rounded-lg border border-emerald-300">
                              Not: {sub.score} / 100
                            </span>
                          ) : (
                            <span className="text-xs font-semibold px-2.5 py-1 bg-amber-100 text-amber-800 rounded-lg border border-amber-300">
                              İnceleme Bekliyor
                            </span>
                          )
                        ) : (
                          <span className="text-xs text-slate-400 px-2.5 py-1 bg-slate-100 rounded-lg">
                            Teslim Edilmedi
                          </span>
                        )}
                      </div>
                    </div>

                    {sub ? (
                      <div className="mt-3 pl-13 space-y-3">
                        <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs text-slate-700">
                          <div className="text-[10px] font-semibold text-slate-400 mb-1">
                            Teslim Edilen Yanıt ({new Date(sub.submittedAt).toLocaleString('tr-TR')}):
                          </div>
                          <p className="whitespace-pre-line leading-relaxed">{sub.content}</p>
                          {sub.attachmentUrl && (
                            <div className="mt-2">
                              <a
                                href={sub.attachmentUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-indigo-600 hover:underline inline-flex items-center gap-1 text-[11px]"
                              >
                                <ExternalLink className="w-3 h-3" />
                                Öğrencinin Eklediği Bağlantı
                              </a>
                            </div>
                          )}
                        </div>

                        {sub.status === 'graded' && !isGradingThis && (
                          <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
                            <div>
                              <strong>Öğretmen Notu:</strong> {sub.feedback || 'Ödev kabul edildi.'}
                            </div>
                            <button
                              onClick={() => {
                                setGradingSubId(sub.id);
                                setGradeScore(sub.score || 100);
                                setGradeFeedback(sub.feedback || '');
                              }}
                              className="text-[11px] text-indigo-700 hover:underline font-semibold cursor-pointer shrink-0 ml-2"
                            >
                              Puanı Güncelle
                            </button>
                          </div>
                        )}

                        {/* Grading Form */}
                        {(sub.status === 'submitted' || isGradingThis) && (
                          <div className="bg-indigo-50/70 p-3 rounded-xl border border-indigo-200 space-y-2.5">
                            <div className="text-xs font-bold text-indigo-900">
                              Ödevi Notlandır ve Geri Bildirim Ver
                            </div>
                            <div className="flex gap-3">
                              <div className="w-28">
                                <label className="block text-[10px] font-semibold text-slate-600 mb-1">Puan (0-100)</label>
                                <input
                                  type="number"
                                  min={0}
                                  max={100}
                                  value={gradeScore}
                                  onChange={e => setGradeScore(Number(e.target.value))}
                                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-center"
                                />
                              </div>
                              <div className="flex-1">
                                <label className="block text-[10px] font-semibold text-slate-600 mb-1">Öğretmen Yorumu</label>
                                <input
                                  type="text"
                                  value={gradeFeedback}
                                  onChange={e => setGradeFeedback(e.target.value)}
                                  placeholder="Örn: Harika araştırma, tebrikler!"
                                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                                />
                              </div>
                            </div>
                            <div className="flex justify-end gap-2">
                              {isGradingThis && (
                                <button
                                  type="button"
                                  onClick={() => setGradingSubId(null)}
                                  className="px-3 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-medium cursor-pointer"
                                >
                                  Vazgeç
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => handleSaveGrade(sub.id)}
                                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold cursor-pointer shadow-xs"
                              >
                                Notu Kaydet
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="mt-2 pl-13 text-[11px] text-slate-400 italic">
                        Öğrenci henüz bu ödevi sisteme teslim etmedi.
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
