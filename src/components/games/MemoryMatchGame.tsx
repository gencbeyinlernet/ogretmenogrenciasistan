import React, { useState, useEffect } from 'react';
import { Sparkles, RotateCcw, Award, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface MemoryCard {
  id: number;
  pairId: number;
  symbol: string;
  name: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const INITIAL_PAIRS = [
  { pairId: 1, symbol: '🪐', name: 'Satürn' },
  { pairId: 2, symbol: '🔬', name: 'Mikroskop' },
  { pairId: 3, symbol: '🧬', name: 'DNA Sarmalı' },
  { pairId: 4, symbol: '⚡', name: 'Enerji' },
  { pairId: 5, symbol: '📐', name: 'Geometri' },
  { pairId: 6, symbol: '🌱', name: 'Fotosentez' },
];

interface MemoryGameProps {
  onFinish?: (score: number) => void;
  gameTitle?: string;
}

export const MemoryMatchGame: React.FC<MemoryGameProps> = ({ onFinish, gameTitle = 'Bilim Terimleri Hafıza Eşleştirme' }) => {
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matchedCount, setMatchedCount] = useState(0);
  const [isWon, setIsWon] = useState(false);

  const setupGame = () => {
    const deck: MemoryCard[] = [];
    let id = 1;
    INITIAL_PAIRS.forEach(pair => {
      deck.push({ id: id++, pairId: pair.pairId, symbol: pair.symbol, name: pair.name, isFlipped: false, isMatched: false });
      deck.push({ id: id++, pairId: pair.pairId, symbol: pair.symbol, name: pair.name, isFlipped: false, isMatched: false });
    });
    // Shuffle
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    setCards(deck);
    setFlippedCards([]);
    setMoves(0);
    setMatchedCount(0);
    setIsWon(false);
  };

  useEffect(() => {
    setupGame();
  }, []);

  const handleCardClick = (id: number) => {
    if (flippedCards.length === 2) return;
    const card = cards.find(c => c.id === id);
    if (!card || card.isFlipped || card.isMatched) return;

    const newFlipped = [...flippedCards, id];
    setFlippedCards(newFlipped);

    setCards(prev => prev.map(c => c.id === id ? { ...c, isFlipped: true } : c));

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const first = cards.find(c => c.id === newFlipped[0]);
      const second = card;

      if (first && second && first.pairId === second.pairId) {
        // Matched!
        setTimeout(() => {
          setCards(prev => prev.map(c => (c.id === first.id || c.id === second.id) ? { ...c, isMatched: true } : c));
          setFlippedCards([]);
          setMatchedCount(mc => {
            const next = mc + 1;
            if (next === INITIAL_PAIRS.length) {
              setIsWon(true);
              const score = Math.max(100 - moves * 3, 50);
              try {
                confetti({ particleCount: 75, spread: 80, origin: { y: 0.6 } });
              } catch {
                // ignore
              }
              if (onFinish) onFinish(score);
            }
            return next;
          });
        }, 500);
      } else {
        // Not matched, flip back
        setTimeout(() => {
          setCards(prev => prev.map(c => (c.id === newFlipped[0] || c.id === newFlipped[1]) ? { ...c, isFlipped: false } : c));
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  return (
    <div id="memory-game-container" className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            {gameTitle}
          </h3>
          <p className="text-xs text-slate-500 mt-1">Eşleşen terimleri bul, hafızanı güçlendir.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md">
            Hamle: {moves}
          </span>
          <span className="text-xs font-bold px-2.5 py-1 bg-purple-50 text-purple-700 rounded-md border border-purple-200">
            Eşleşme: {matchedCount} / {INITIAL_PAIRS.length}
          </span>
        </div>
      </div>

      {!isWon ? (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-w-lg mx-auto py-2">
          {cards.map(card => {
            const showFace = card.isFlipped || card.isMatched;
            return (
              <button
                key={card.id}
                onClick={() => handleCardClick(card.id)}
                disabled={card.isMatched || card.isFlipped}
                className={`h-24 sm:h-28 rounded-xl border flex flex-col items-center justify-center transition-all duration-300 transform cursor-pointer select-none ${
                  card.isMatched
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800 scale-95 opacity-80'
                    : showFace
                    ? 'bg-purple-50 border-purple-300 text-purple-900 shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200/80 border-slate-200 hover:border-slate-300'
                }`}
              >
                {showFace ? (
                  <>
                    <span className="text-2xl sm:text-3xl mb-1">{card.symbol}</span>
                    <span className="text-[11px] font-bold text-slate-700">{card.name}</span>
                  </>
                ) : (
                  <span className="text-slate-400 text-lg font-bold">?</span>
                )}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Award className="w-8 h-8" />
          </div>
          <h4 className="text-2xl font-bold text-slate-900">Tebrikler, Tüm Kartları Eşleştirdin!</h4>
          <p className="text-slate-600 text-sm mt-1 mb-4">
            {moves} hamlede oyunu başarıyla bitirdin.
          </p>
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 px-4 py-2 rounded-xl text-sm font-semibold mb-6 border border-emerald-200">
            <CheckCircle2 className="w-4 h-4" />
            Öğretmenine başarı bildirildi!
          </div>
          <div>
            <button
              onClick={setupGame}
              className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-xl transition shadow-sm inline-flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              Yeniden Oyna
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
