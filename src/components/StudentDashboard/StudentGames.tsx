import React, { useState } from 'react';
import {
  Gamepad2,
  Play,
  Award,
  ExternalLink,
  Zap,
  HelpCircle,
  Sparkles,
  X,
  Maximize2,
  BookOpen,
  Cpu,
  Globe2,
  Filter
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TeacherGameOrLink } from '../../types';
import { MathChallengeGame } from '../games/MathChallengeGame';
import { KnowledgeQuizGame } from '../games/KnowledgeQuizGame';
import { MemoryMatchGame } from '../games/MemoryMatchGame';

export const StudentGames: React.FC = () => {
  const { games, gamePlays, currentUser, recordGamePlay } = useApp();
  const [activeGame, setActiveGame] = useState<TeacherGameOrLink | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'canva' | 'math' | 'quiz' | 'memory'>('all');

  if (!currentUser) return null;

  const handleGameFinish = (score: number) => {
    if (activeGame) {
      recordGamePlay(activeGame.id, score);
    }
  };

  const handleStartExternalGame = (game: TeacherGameOrLink) => {
    recordGamePlay(game.id);
    setActiveGame(game);
  };

  // Filter games
  const filteredGames = games.filter(game => {
    if (selectedFilter === 'canva') {
      return game.url && game.url.includes('canva.site');
    }
    if (selectedFilter === 'math') return game.type === 'built-in-math';
    if (selectedFilter === 'quiz') return game.type === 'built-in-words';
    if (selectedFilter === 'memory') return game.type === 'built-in-memory';
    return true;
  });

  // Specifically identify Canva games for special display
  const canvaGames = games.filter(g => g.url && g.url.includes('canva.site'));

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold mb-2 border border-purple-200/60">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            İnteraktif Oyun ve Öğrenme Dünyası
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <Gamepad2 className="w-6 h-6 text-purple-600" />
            Eğitici Oyunlar ve Görevler
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Burak Öğretmenin hazırladığı Canva oyunlarını ve zekâ bulmacalarını oynayarak hem öğren hem de puanlarını topla!
          </p>
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap items-center gap-1.5 self-start md:self-auto">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              selectedFilter === 'all'
                ? 'bg-purple-600 text-white shadow-2xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Filter className="w-3 h-3" />
            Tümü ({games.length})
          </button>
          <button
            onClick={() => setSelectedFilter('canva')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              selectedFilter === 'canva'
                ? 'bg-purple-600 text-white shadow-2xs'
                : 'bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200/50'
            }`}
          >
            <Sparkles className="w-3 h-3 text-amber-500" />
            Canva Oyunları ({canvaGames.length})
          </button>
          <button
            onClick={() => setSelectedFilter('math')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              selectedFilter === 'math'
                ? 'bg-purple-600 text-white shadow-2xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            Matematik
          </button>
          <button
            onClick={() => setSelectedFilter('quiz')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              selectedFilter === 'quiz'
                ? 'bg-purple-600 text-white shadow-2xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            Bilgi Yarışması
          </button>
          <button
            onClick={() => setSelectedFilter('memory')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              selectedFilter === 'memory'
                ? 'bg-purple-600 text-white shadow-2xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            Hafıza Kartları
          </button>
        </div>
      </div>

      {/* Featured Canva Games Banner (shown when 'all' or 'canva' is selected) */}
      {(selectedFilter === 'all' || selectedFilter === 'canva') && canvaGames.length > 0 && (
        <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-3xl p-5 sm:p-6 text-white shadow-lg border border-purple-500/20 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-[11px] font-bold border border-amber-400/30">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                  Öğretmenden Yeni Canva Oyunları
                </span>
                <h3 className="text-lg font-extrabold mt-1.5">
                  İnteraktif Eşleştirme ve Kelime Oyunları
                </h3>
                <p className="text-xs text-purple-200 mt-0.5">
                  Öğrenirken eğleneceğiniz 3 özel Canva oyunu yayında! Doğrudan buradan oynayabilir veya yeni sekmede açabilirsiniz.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              {canvaGames.map((cGame, idx) => {
                const myPlays = gamePlays.filter(
                  gp => gp.gameId === cGame.id && gp.studentUsername === currentUser.username
                );

                let badgeColor = 'from-emerald-500 to-teal-600';
                let Icon = Globe2;
                if (idx === 1) {
                  badgeColor = 'from-blue-500 to-indigo-600';
                  Icon = Cpu;
                } else if (idx === 2) {
                  badgeColor = 'from-rose-500 to-pink-600';
                  Icon = BookOpen;
                }

                return (
                  <div
                    key={cGame.id}
                    className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 hover:border-white/30 transition flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2.5">
                        <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${badgeColor} flex items-center justify-center shadow-xs`}>
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/15 text-white border border-white/10">
                          {cGame.subject}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-white group-hover:text-purple-200 transition line-clamp-1 mb-1">
                        {cGame.title}
                      </h4>
                      <p className="text-[11px] text-purple-100/80 line-clamp-2 mb-3 leading-relaxed">
                        {cGame.description}
                      </p>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-white/10">
                      <div className="text-[10px] text-purple-200/70 flex items-center justify-between">
                        <span>{myPlays.length} Kez Oynadın</span>
                        <span className="text-amber-300 font-medium">Canva Web</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handleStartExternalGame(cGame)}
                          className="py-2 px-2.5 bg-purple-500 hover:bg-purple-600 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <Play className="w-3 h-3 fill-current" />
                          <span>Oyna</span>
                        </button>

                        <a
                          href={cGame.url}
                          target="_blank"
                          rel="noreferrer"
                          onClick={() => recordGamePlay(cGame.id)}
                          className="py-2 px-2.5 bg-white/15 hover:bg-white/25 text-white text-xs font-medium rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer text-center"
                          title="Yeni Sekmede Aç"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>Yeni Sekme</span>
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* All / Filtered Games Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800">
            {selectedFilter === 'canva' ? 'Canva Oyunları' : 'Tüm Eğitici Oyunlar'}
          </h3>
          <span className="text-xs text-slate-400 font-medium">{filteredGames.length} Oyun Mevcut</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredGames.map(game => {
            const myPlays = gamePlays.filter(
              gp => gp.gameId === game.id && gp.studentUsername === currentUser.username
            );
            const bestScore = myPlays.length > 0
              ? Math.max(...myPlays.map(p => p.score || 0))
              : null;

            const isCanva = game.url && game.url.includes('canva.site');

            let typeIcon = <Gamepad2 className="w-4 h-4 text-purple-600" />;
            if (isCanva) typeIcon = <Sparkles className="w-4 h-4 text-amber-500" />;
            else if (game.type === 'built-in-math') typeIcon = <Zap className="w-4 h-4 text-amber-500" />;
            else if (game.type === 'built-in-words') typeIcon = <HelpCircle className="w-4 h-4 text-indigo-600" />;
            else if (game.type === 'built-in-memory') typeIcon = <Sparkles className="w-4 h-4 text-emerald-600" />;
            else if (game.type === 'external-link') typeIcon = <ExternalLink className="w-4 h-4 text-sky-600" />;

            return (
              <div
                key={game.id}
                className={`bg-white rounded-2xl border p-5 shadow-xs transition flex flex-col justify-between ${
                  isCanva
                    ? 'border-purple-200 hover:border-purple-400 bg-gradient-to-b from-purple-50/20 to-white'
                    : 'border-slate-200 hover:border-purple-200'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-1.5">
                      {typeIcon}
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md border ${
                        isCanva
                          ? 'bg-purple-100 text-purple-800 border-purple-200'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}>
                        {game.badge || (isCanva ? 'Canva Oyunu' : 'Oyun')}
                      </span>
                    </div>

                    {bestScore !== null && (
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-50 text-amber-800 rounded-md flex items-center gap-1 border border-amber-200">
                        <Award className="w-3 h-3 text-amber-600" />
                        En İyi: {bestScore}
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 mb-1 leading-snug">{game.title}</h3>
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
                    {game.description}
                  </p>

                  <div className="text-[11px] text-slate-400 mb-4 flex items-center justify-between">
                    <span>{game.subject || 'Eğitici Etkinlik'}</span>
                    <span>{myPlays.length} Kez Oynadın</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  {game.type === 'external-link' ? (
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleStartExternalGame(game)}
                        className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        Oyna
                      </button>

                      <a
                        href={game.url}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => recordGamePlay(game.id)}
                        className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer text-center"
                        title="Yeni Sekmede Aç"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-slate-600" />
                        Sekmede Aç
                      </a>
                    </div>
                  ) : (
                    <button
                      onClick={() => setActiveGame(game)}
                      className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Play className="w-3.5 h-3.5" />
                      Oyunu Oyna
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Play Game Modal (Built-in or External Canva Game) */}
      {activeGame && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/80 backdrop-blur-xs">
          <div className={`bg-white rounded-3xl w-full overflow-hidden shadow-2xl border border-slate-200 flex flex-col animate-in fade-in zoom-in-95 ${
            activeGame.type === 'external-link' ? 'max-w-5xl h-[88vh]' : 'max-w-2xl'
          }`}>
            
            {/* Modal Header */}
            <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                  <Gamepad2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 line-clamp-1">{activeGame.title}</h3>
                  <p className="text-[11px] text-slate-500">{activeGame.subject} • {activeGame.badge}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {activeGame.url && (
                  <a
                    href={activeGame.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-semibold rounded-xl transition border border-purple-200/60"
                    title="Yeni Sekmede Tam Ekran Aç"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>Yeni Sekmede Tam Ekran</span>
                    <ExternalLink className="w-3 h-3 text-purple-500" />
                  </a>
                )}
                <button
                  onClick={() => setActiveGame(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer transition hover:bg-slate-200/60"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className={`flex-1 overflow-y-auto ${activeGame.type === 'external-link' ? 'p-0 bg-slate-900 flex flex-col' : 'p-6'}`}>
              
              {/* External Canva / Web Game Iframe Player */}
              {activeGame.type === 'external-link' && activeGame.url && (
                <div className="flex-1 flex flex-col w-full h-full relative">
                  <iframe
                    src={activeGame.url}
                    title={activeGame.title}
                    className="w-full flex-1 border-0 min-h-[500px]"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                    allowFullScreen
                  />
                  <div className="px-4 py-2 bg-slate-950 border-t border-slate-800 text-slate-400 text-[11px] flex flex-col sm:flex-row items-center justify-between gap-2">
                    <span>
                      Oyun Canva üzerinde çalışmaktadır. Daha geniş bir ekranda oynamak isterseniz sağ üstteki "Yeni Sekmede Tam Ekran" butonunu kullanabilirsiniz.
                    </span>
                    <a
                      href={activeGame.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-purple-400 hover:text-purple-300 font-semibold underline shrink-0 inline-flex items-center gap-1"
                    >
                      Doğrudan Canva Sitesine Git <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              )}

              {/* Built-in Games */}
              {activeGame.type === 'built-in-math' && (
                <MathChallengeGame
                  gameTitle={activeGame.title}
                  onFinish={score => handleGameFinish(score)}
                />
              )}
              {activeGame.type === 'built-in-words' && (
                <KnowledgeQuizGame
                  gameTitle={activeGame.title}
                  onFinish={score => handleGameFinish(score)}
                />
              )}
              {activeGame.type === 'built-in-memory' && (
                <MemoryMatchGame
                  gameTitle={activeGame.title}
                  onFinish={score => handleGameFinish(score)}
                />
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
