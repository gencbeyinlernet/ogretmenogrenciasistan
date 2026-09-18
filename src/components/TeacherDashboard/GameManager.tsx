import React, { useState } from 'react';
import {
  Gamepad2,
  Plus,
  Play,
  Trash2,
  Users,
  ExternalLink,
  Award,
  Zap,
  HelpCircle,
  Sparkles,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TeacherGameOrLink, GameType } from '../../types';
import { MathChallengeGame } from '../games/MathChallengeGame';
import { KnowledgeQuizGame } from '../games/KnowledgeQuizGame';
import { MemoryMatchGame } from '../games/MemoryMatchGame';

export const GameManager: React.FC = () => {
  const { games, gamePlays, students, addGame, deleteGame } = useApp();

  const [showAddModal, setShowAddModal] = useState(false);
  const [previewingGame, setPreviewingGame] = useState<TeacherGameOrLink | null>(null);
  const [selectedGameForStats, setSelectedGameForStats] = useState<TeacherGameOrLink | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<GameType>('built-in-math');
  const [subject, setSubject] = useState('Matematik');
  const [url, setUrl] = useState('');

  const handleAddGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    let badge = 'İnteraktif Oyun';
    if (type === 'external-link') badge = 'Dış Bağlantı';
    else if (type === 'built-in-words') badge = 'Bilgi Yarışması';
    else if (type === 'built-in-memory') badge = 'Hafıza Kartı';
    else if (type === 'built-in-math') badge = 'Zihinden İşlem';

    addGame({
      title: title.trim(),
      description: description.trim() || 'Öğrenciler için eğitici etkinlik.',
      type,
      subject,
      badge,
      url: type === 'external-link' ? url.trim() : undefined,
    });

    setTitle('');
    setDescription('');
    setUrl('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Gamepad2 className="w-5 h-5 text-indigo-600" />
            Eğitici Oyun ve Bağlantı Yönetimi
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Eklediğiniz oyun veya dış bağlantılar anında tüm öğrencilerin paneline eklenir. Öğrencilerin oyun skorlarını buradan görebilirsiniz.
          </p>
        </div>

        <button
          id="add-game-btn"
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition flex items-center gap-2 cursor-pointer shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          Yeni Oyun / Bağlantı Ekle
        </button>
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {games.map(game => {
          const plays = gamePlays.filter(gp => gp.gameId === game.id);

          let typeIcon = <Gamepad2 className="w-4 h-4 text-purple-600" />;
          if (game.type === 'built-in-math') typeIcon = <Zap className="w-4 h-4 text-amber-500" />;
          if (game.type === 'built-in-words') typeIcon = <HelpCircle className="w-4 h-4 text-indigo-600" />;
          if (game.type === 'built-in-memory') typeIcon = <Sparkles className="w-4 h-4 text-emerald-600" />;
          if (game.type === 'external-link') typeIcon = <ExternalLink className="w-4 h-4 text-sky-600" />;

          return (
            <div
              key={game.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-indigo-200 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5">
                    {typeIcon}
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-purple-50 text-purple-800 rounded-md border border-purple-200">
                      {game.badge || 'Oyun'}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      if (confirm(`"${game.title}" etkinliğini kaldırmak istediğinize emin misiniz?`)) {
                        deleteGame(game.id);
                      }
                    }}
                    className="text-slate-400 hover:text-rose-600 p-1 rounded-lg transition cursor-pointer"
                    title="Oyunu Sil"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="text-sm font-bold text-slate-900 line-clamp-1 mb-1">
                  {game.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
                  {game.description}
                </p>

                <div className="flex items-center gap-3 text-[11px] text-slate-500 mb-4">
                  <span className="font-medium text-slate-600">{game.subject || 'Eğlenceli Etkinlik'}</span>
                  <span>•</span>
                  <span className="font-semibold text-purple-700">{plays.length} Kez Oynandı</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                {game.type === 'external-link' ? (
                  <a
                    href={game.url}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition flex items-center justify-center gap-1.5"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-indigo-600" />
                    Bağlantıyı Aç
                  </a>
                ) : (
                  <button
                    onClick={() => setPreviewingGame(game)}
                    className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 text-indigo-600" />
                    Oyunu Önizle / Oyna
                  </button>
                )}

                <button
                  onClick={() => setSelectedGameForStats(game)}
                  className="w-full py-2 bg-purple-50 hover:bg-purple-100 text-purple-800 text-xs font-semibold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Award className="w-3.5 h-3.5" />
                  Öğrenci Skorları ({plays.length})
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Game Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-200">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Gamepad2 className="w-4 h-4 text-purple-600" />
                Öğrenciler İçin Yeni Oyun veya Bağlantı Ekle
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddGame} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Oyun / Etkinlik Türü
                </label>
                <select
                  value={type}
                  onChange={e => {
                    const val = e.target.value as GameType;
                    setType(val);
                    if (val === 'built-in-math') {
                      setTitle('Hızlı Zihinden Matematik');
                      setSubject('Matematik');
                    } else if (val === 'built-in-words') {
                      setTitle('Genel Kültür & Bilim Bilgi Yarışması');
                      setSubject('Fen & Genel Kültür');
                    } else if (val === 'built-in-memory') {
                      setTitle('Bilim Terimleri Hafıza Eşleştirme');
                      setSubject('Hafıza & Mantık');
                    } else {
                      setTitle('');
                      setSubject('Genel');
                    }
                  }}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="built-in-math">Dahili Oyun: Hızlı Zihinden Matematik</option>
                  <option value="built-in-words">Dahili Oyun: Bilgi & Soru Yarışması</option>
                  <option value="built-in-memory">Dahili Oyun: Hafıza Kartları Eşleştirme</option>
                  <option value="external-link">Harici Bağlantı (Wordwall, Scratch, Khan Academy, vs.)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Oyun / Bağlantı Başlığı
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Örn: 5. Sınıf Gezegenler Eşleme Oyunu"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>

              {type === 'external-link' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Oyun Web Bağlantısı (URL)
                  </label>
                  <input
                    type="url"
                    required
                    value={url}
                    onChange={e => setUrl(e.target.value)}
                    placeholder="https://wordwall.net/... veya https://scratch.mit.edu/..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Ders / Kategori
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  placeholder="Örn: Matematik, Fen, Zeka Oyunları"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Açıklama & Yönerge
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Öğrenciler için oyun talimatı veya açıklama..."
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
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-sm"
                >
                  Oyunu Yayınla
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Game Scores / Plays Modal */}
      {selectedGameForStats && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl w-full max-w-xl max-h-[85vh] overflow-hidden shadow-2xl border border-slate-200 flex flex-col">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-purple-100 text-purple-800 rounded-md">
                  {selectedGameForStats.badge || 'Oyun'}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  "{selectedGameForStats.title}" - Öğrenci Skorları
                </h3>
              </div>
              <button
                onClick={() => setSelectedGameForStats(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-3">
              {students.map(std => {
                const stdPlays = gamePlays.filter(
                  gp => gp.gameId === selectedGameForStats.id && gp.studentUsername === std.username
                );

                const bestScore = stdPlays.length > 0
                  ? Math.max(...stdPlays.map(p => p.score || 0))
                  : null;

                return (
                  <div
                    key={std.username}
                    className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={std.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                        alt={std.name}
                        className="w-9 h-9 rounded-xl object-cover border border-slate-200"
                      />
                      <div>
                        <div className="font-bold text-slate-800">{std.name}</div>
                        <div className="text-[10px] text-slate-400">
                          {stdPlays.length} Kez Oynadı
                        </div>
                      </div>
                    </div>

                    <div>
                      {bestScore !== null ? (
                        <div className="px-3 py-1 bg-amber-50 text-amber-900 border border-amber-200 font-bold rounded-lg text-xs flex items-center gap-1.5">
                          <Award className="w-3.5 h-3.5 text-amber-600" />
                          En Yüksek Skor: {bestScore}
                        </div>
                      ) : (
                        <span className="px-2.5 py-1 bg-slate-100 text-slate-400 rounded-lg text-xs font-medium">
                          Henüz Oynamadı
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

      {/* Preview Playable Game Modal */}
      {previewingGame && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl border border-slate-200 flex flex-col">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-2">
                <Play className="w-4 h-4 text-indigo-600" />
                Öğretmen Oyun Önizlemesi
              </span>
              <button
                onClick={() => setPreviewingGame(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {previewingGame.type === 'built-in-math' && (
                <MathChallengeGame gameTitle={previewingGame.title} />
              )}
              {previewingGame.type === 'built-in-words' && (
                <KnowledgeQuizGame gameTitle={previewingGame.title} />
              )}
              {previewingGame.type === 'built-in-memory' && (
                <MemoryMatchGame gameTitle={previewingGame.title} />
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
