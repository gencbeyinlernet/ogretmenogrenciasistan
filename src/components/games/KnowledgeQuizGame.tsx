import React, { useState } from 'react';
import { HelpCircle, CheckCircle, XCircle, RotateCcw, Award, ChevronRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface QuizGameProps {
  onFinish?: (score: number) => void;
  gameTitle?: string;
}

interface Question {
  id: number;
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

const QUIZ_QUESTIONS: Question[] = [
  {
    id: 1,
    question: 'Güneş sistemindeki en büyük gezegen hangisidir?',
    options: ['Mars', 'Jüpiter', 'Satürn', 'Dünya'],
    answer: 1,
    explanation: 'Jüpiter, Güneş Sistemi’nin en büyük gezegenidir ve içine 1300 tane Dünya sığabilir.',
  },
  {
    id: 2,
    question: 'Maddenin katı halden doğrudan gaz hale geçmesine ne ad verilir?',
    options: ['Erime', 'Yoğuşma', 'Süblimleşme', 'Buharlaşma'],
    answer: 2,
    explanation: 'Katı maddelerin sıvılaşmadan direkt gaz haline geçmesi fiziksel olayına süblimleşme denir (Örn: Naftalin).',
  },
  {
    id: 3,
    question: 'Bitkilerin güneş ışığını kullanarak besin ve oksijen üretmesi olayına ne denir?',
    options: ['Solunum', 'Fotosentez', 'Terleme', 'Mayalanma'],
    answer: 1,
    explanation: 'Klorofil içeren canlılar Güneş ışığı, su ve karbondioksiti fotosentez ile glikoz ve oksijene dönüştürür.',
  },
  {
    id: 4,
    question: 'Aşağıdaki kesirlerden hangisi 1/2 kesrine denktir?',
    options: ['2/3', '3/6', '4/10', '5/8'],
    answer: 1,
    explanation: '3/6 kesri sadeleştirildiğinde 1/2 kesrine denk olur.',
  },
  {
    id: 5,
    question: 'Maddelerin kütlesini ölçmek için hangi araç kullanılır?',
    options: ['Termometre', 'Dinamometre', 'Eşit Kollu Terazi', 'Dereceli Silindir'],
    answer: 2,
    explanation: 'Kütle eşit kollu terazi ile ölçülürken, kuvvet ve ağırlık dinamometre ile ölçülür.',
  }
];

export const KnowledgeQuizGame: React.FC<QuizGameProps> = ({ onFinish, gameTitle = 'Genel Kültür & Bilim Bilgi Yarışması' }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const currentQ = QUIZ_QUESTIONS[currentIdx];

  const handleSelect = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    if (idx === currentQ.answer) {
      setScore(prev => prev + 20);
    }
  };

  const handleNext = () => {
    if (currentIdx < QUIZ_QUESTIONS.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
      const finalScore = score + (selectedOption === currentQ.answer ? 0 : 0);
      try {
        confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
      } catch {
        // ignore
      }
      if (onFinish) {
        onFinish(finalScore);
      }
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setIsFinished(false);
  };

  return (
    <div id="quiz-game-container" className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-indigo-600" />
            {gameTitle}
          </h3>
          <p className="text-xs text-slate-500 mt-1">Her doğru soru 20 puan kazandırır.</p>
        </div>
        {!isFinished && (
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md">
              Soru {currentIdx + 1} / {QUIZ_QUESTIONS.length}
            </span>
            <span className="text-xs font-bold px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-md border border-indigo-200">
              {score} Puan
            </span>
          </div>
        )}
      </div>

      {!isFinished ? (
        <div className="py-2">
          <div className="w-full bg-slate-100 h-2 rounded-full mb-6 overflow-hidden">
            <div
              className="bg-indigo-600 h-full transition-all duration-300"
              style={{ width: `${((currentIdx + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
            />
          </div>

          <h4 className="text-lg font-bold text-slate-900 mb-6 leading-relaxed">
            {currentQ.question}
          </h4>

          <div className="space-y-3 mb-6">
            {currentQ.options.map((option, idx) => {
              let btnClass = 'w-full text-left p-4 rounded-xl border transition font-medium flex items-center justify-between text-sm cursor-pointer ';
              
              if (!isAnswered) {
                btnClass += 'bg-slate-50/70 hover:bg-indigo-50 hover:border-indigo-300 text-slate-800 border-slate-200';
              } else {
                if (idx === currentQ.answer) {
                  btnClass += 'bg-emerald-50 border-emerald-400 text-emerald-900 font-bold';
                } else if (idx === selectedOption) {
                  btnClass += 'bg-rose-50 border-rose-400 text-rose-900 font-bold';
                } else {
                  btnClass += 'bg-slate-50 text-slate-400 border-slate-200 opacity-60';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  disabled={isAnswered}
                  className={btnClass}
                >
                  <span>{String.fromCharCode(65 + idx)}) {option}</span>
                  {isAnswered && idx === currentQ.answer && (
                    <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 ml-2" />
                  )}
                  {isAnswered && idx === selectedOption && idx !== currentQ.answer && (
                    <XCircle className="w-5 h-5 text-rose-600 shrink-0 ml-2" />
                  )}
                </button>
              );
            })}
          </div>

          {isAnswered && (
            <div className="p-4 bg-indigo-50/70 border border-indigo-100 rounded-xl mb-6 text-sm text-indigo-950">
              <span className="font-bold block mb-1">Açıklama:</span>
              {currentQ.explanation}
            </div>
          )}

          {isAnswered && (
            <div className="flex justify-end">
              <button
                onClick={handleNext}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition inline-flex items-center gap-2 cursor-pointer shadow-sm"
              >
                {currentIdx < QUIZ_QUESTIONS.length - 1 ? 'Sonraki Soru' : 'Yarışmayı Bitir'}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Award className="w-8 h-8" />
          </div>
          <h4 className="text-2xl font-bold text-slate-900">Yarışma Tamamlandı!</h4>
          <p className="text-slate-600 text-sm mt-1 mb-4">Öğretmenine başarı raporun iletildi.</p>
          <div className="inline-block bg-indigo-50 border border-indigo-100 rounded-2xl px-6 py-4 mb-6">
            <div className="text-xs text-indigo-600 font-semibold uppercase">Toplam Puan</div>
            <div className="text-4xl font-black text-indigo-700 mt-1">{score} / 100</div>
          </div>
          <div>
            <button
              onClick={handleRestart}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition shadow-sm inline-flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              Yeniden Başlat
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
