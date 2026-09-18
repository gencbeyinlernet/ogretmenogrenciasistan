import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Award, Zap, CheckCircle2, XCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface MathGameProps {
  onFinish?: (score: number) => void;
  gameTitle?: string;
}

export const MathChallengeGame: React.FC<MathGameProps> = ({ onFinish, gameTitle = 'Hızlı Zihinden Matematik' }) => {
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'ended'>('idle');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [question, setQuestion] = useState<{ num1: number; num2: number; op: string; answer: number }>({
    num1: 5,
    num2: 7,
    op: '+',
    answer: 12,
  });
  const [userAnswer, setUserAnswer] = useState('');
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const generateQuestion = () => {
    const ops = ['+', '-', 'x'];
    const op = ops[Math.floor(Math.random() * ops.length)];
    let n1 = Math.floor(Math.random() * 20) + 1;
    let n2 = Math.floor(Math.random() * 20) + 1;
    let ans = 0;

    if (op === '+') {
      ans = n1 + n2;
    } else if (op === '-') {
      if (n1 < n2) [n1, n2] = [n2, n1];
      ans = n1 - n2;
    } else {
      n1 = Math.floor(Math.random() * 12) + 2;
      n2 = Math.floor(Math.random() * 10) + 2;
      ans = n1 * n2;
    }

    setQuestion({ num1: n1, num2: n2, op, answer: ans });
    setUserAnswer('');
  };

  const startGame = () => {
    setScore(0);
    setTimeLeft(30);
    setStreak(0);
    setFeedback(null);
    setGameState('playing');
    generateQuestion();
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === 'playing' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setGameState('ended');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  useEffect(() => {
    if (gameState === 'ended') {
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // ignore
      }
      if (onFinish) {
        onFinish(score);
      }
    }
  }, [gameState]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userAnswer.trim()) return;

    const num = parseInt(userAnswer.trim(), 10);
    if (num === question.answer) {
      const bonus = streak >= 3 ? 15 : 10;
      setScore(prev => prev + bonus);
      setStreak(prev => prev + 1);
      setFeedback('correct');
      setTimeout(() => setFeedback(null), 600);
      generateQuestion();
    } else {
      setStreak(0);
      setFeedback('wrong');
      setTimeout(() => setFeedback(null), 600);
      generateQuestion();
    }
  };

  return (
    <div id="math-game-container" className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500" />
            {gameTitle}
          </h3>
          <p className="text-xs text-slate-500 mt-1">30 saniye içinde en çok doğru cevabı ver!</p>
        </div>
        {gameState === 'playing' && (
          <div className="flex items-center gap-4">
            <div className="px-3 py-1.5 bg-amber-50 rounded-lg text-amber-700 font-semibold text-sm border border-amber-200">
              Süre: {timeLeft}s
            </div>
            <div className="px-3 py-1.5 bg-indigo-50 rounded-lg text-indigo-700 font-semibold text-sm border border-indigo-200">
              Skor: {score}
            </div>
          </div>
        )}
      </div>

      {gameState === 'idle' && (
        <div className="text-center py-10">
          <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Play className="w-8 h-8 ml-1" />
          </div>
          <h4 className="text-lg font-bold text-slate-800">Hazır mısın?</h4>
          <p className="text-sm text-slate-600 max-w-md mx-auto mt-1 mb-6">
            Toplama, çıkarma ve çarpma işlemlerini zihninden çözerek serini koru ve öğretmenin puan tablosunda zirveye yerleş!
          </p>
          <button
            id="start-math-game-btn"
            onClick={startGame}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition shadow-sm inline-flex items-center gap-2 cursor-pointer"
          >
            <Play className="w-4 h-4" />
            Oyunu Başlat
          </button>
        </div>
      )}

      {gameState === 'playing' && (
        <div className="py-6 text-center max-w-md mx-auto">
          {streak >= 3 && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold mb-4 animate-pulse">
              <Zap className="w-3.5 h-3.5" />
              {streak}x Seri Bonusu!
            </div>
          )}

          <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 mb-6 relative">
            <div className="text-4xl font-extrabold text-slate-900 tracking-wider">
              {question.num1} {question.op} {question.num2} = ?
            </div>

            {feedback === 'correct' && (
              <div className="absolute inset-0 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-600 font-bold text-lg backdrop-blur-[1px]">
                <CheckCircle2 className="w-8 h-8 mr-1" /> Doğru! (+{streak >= 3 ? 15 : 10})
              </div>
            )}
            {feedback === 'wrong' && (
              <div className="absolute inset-0 bg-rose-500/10 rounded-2xl flex items-center justify-center text-rose-600 font-bold text-lg backdrop-blur-[1px]">
                <XCircle className="w-8 h-8 mr-1" /> Yanlış!
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              id="math-answer-input"
              type="number"
              autoFocus
              value={userAnswer}
              onChange={e => setUserAnswer(e.target.value)}
              placeholder="Sonucu yaz ve Enter'a bas"
              className="flex-1 px-4 py-3 bg-white border border-slate-300 rounded-xl text-center text-xl font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              id="math-submit-answer-btn"
              type="submit"
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition cursor-pointer"
            >
              Cevapla
            </button>
          </form>
        </div>
      )}

      {gameState === 'ended' && (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Award className="w-8 h-8" />
          </div>
          <h4 className="text-2xl font-bold text-slate-900">Süre Doldu!</h4>
          <p className="text-slate-600 text-sm mt-1 mb-4">Harika bir performans sergiledin.</p>
          <div className="inline-block bg-indigo-50 border border-indigo-100 rounded-2xl px-6 py-4 mb-6">
            <div className="text-xs text-indigo-600 font-semibold uppercase">Toplam Skorun</div>
            <div className="text-4xl font-black text-indigo-700 mt-1">{score} Puan</div>
          </div>
          <div>
            <button
              id="restart-math-game-btn"
              onClick={startGame}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition shadow-sm inline-flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              Tekrar Oyna
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
