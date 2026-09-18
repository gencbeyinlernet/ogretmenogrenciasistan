import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, Shield, CheckCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const StudentMessages: React.FC = () => {
  const { currentUser, messages, sendMessageToTeacher, markMessagesAsRead } = useApp();
  const [inputText, setInputText] = useState('');

  // Mark teacher messages as read when opening student thread
  useEffect(() => {
    if (currentUser) {
      markMessagesAsRead(currentUser.username, currentUser.username);
    }
  }, [currentUser?.username, messages.length]);

  if (!currentUser) return null;

  // Thread between this student and Burak
  const threadMessages = messages.filter(m => m.studentUsername === currentUser.username);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    sendMessageToTeacher(inputText.trim());
    setInputText('');
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden flex flex-col min-h-[550px]">
      
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900">Burak Öğretmenim</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Öğretmen
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Dersler, ödevler ve aklına takılan tüm soruları buradan doğrudan sorabilirsin.
            </p>
          </div>
        </div>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 p-5 overflow-y-auto space-y-3.5 max-h-[420px] bg-slate-50/40">
        {threadMessages.length === 0 ? (
          <div className="text-center py-20 text-slate-400 text-xs">
            <MessageSquare className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="font-semibold text-slate-600">Henüz öğretmenine mesaj göndermedin.</p>
            <p className="text-[11px] text-slate-400 mt-1">
              Aşağıdaki kutudan sorununu veya merak ettiğin bir konuyu yazabilirsin.
            </p>
          </div>
        ) : (
          threadMessages.map(msg => {
            const isMe = msg.from === currentUser.username;

            return (
              <div
                key={msg.id}
                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3.5 rounded-2xl text-xs leading-relaxed shadow-2xs ${
                    isMe
                      ? 'bg-indigo-600 text-white rounded-tr-none'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
                  }`}
                >
                  <div className="text-[10px] font-semibold opacity-75 mb-1">
                    {isMe ? 'Sen' : 'Burak Öğretmen'}
                  </div>
                  <p className="whitespace-pre-line">{msg.content}</p>
                  <div
                    className={`text-[9px] mt-1 text-right flex items-center justify-end gap-1 ${
                      isMe ? 'text-indigo-200' : 'text-slate-400'
                    }`}
                  >
                    {new Date(msg.createdAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                    {isMe && <CheckCheck className="w-3 h-3" />}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSend} className="p-4 border-t border-slate-200 bg-white flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          placeholder="Burak Öğretmenime bir soru veya not yaz..."
          className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
        />
        <button
          type="submit"
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Gönder</span>
        </button>
      </form>

    </div>
  );
};
