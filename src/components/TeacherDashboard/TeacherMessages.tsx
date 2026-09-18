import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, User as UserIcon, CheckCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface TeacherMessagesProps {
  initialStudentUsername?: string | null;
}

export const TeacherMessages: React.FC<TeacherMessagesProps> = ({ initialStudentUsername }) => {
  const { students, messages, replyMessage, markMessagesAsRead } = useApp();
  const [selectedStudent, setSelectedStudent] = useState<string>(() => {
    if (initialStudentUsername) return initialStudentUsername;
    return students.length > 0 ? students[0].username : '';
  });
  const [replyText, setReplyText] = useState('');

  // Mark incoming student messages as read when opening thread
  useEffect(() => {
    if (selectedStudent) {
      markMessagesAsRead(selectedStudent, 'burak');
    }
  }, [selectedStudent, messages.length]);

  const currentStudentObj = students.find(s => s.username === selectedStudent);
  const threadMessages = messages.filter(m => m.studentUsername === selectedStudent);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedStudent) return;

    replyMessage(selectedStudent, replyText.trim());
    setReplyText('');
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden flex flex-col md:flex-row min-h-[550px]">
      
      {/* Left Sidebar: Student Threads */}
      <div className="w-full md:w-72 border-r border-slate-200 bg-slate-50/70 p-4 flex flex-col shrink-0">
        <div className="mb-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-indigo-600" />
            Öğrenci Mesajları
          </h3>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Öğrencilerinizden gelen sorular ve talepler
          </p>
        </div>

        <div className="space-y-1.5 overflow-y-auto flex-1 max-h-[460px]">
          {students.map(std => {
            const stdMsgs = messages.filter(m => m.studentUsername === std.username);
            const lastMsg = stdMsgs[stdMsgs.length - 1];
            const unreadCount = stdMsgs.filter(m => m.to === 'burak' && !m.isRead).length;

            return (
              <button
                key={std.username}
                onClick={() => setSelectedStudent(std.username)}
                className={`w-full p-3 rounded-2xl text-left transition flex items-center gap-3 cursor-pointer ${
                  selectedStudent === std.username
                    ? 'bg-white shadow-sm border border-slate-200 text-indigo-900 font-bold'
                    : 'hover:bg-slate-100 text-slate-700'
                }`}
              >
                <div className="relative">
                  <img
                    src={std.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                    alt={std.name}
                    className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                  />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] flex items-center justify-center font-bold">
                      {unreadCount}
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs truncate">{std.name}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 truncate mt-0.5 font-normal">
                    {lastMsg ? lastMsg.content : 'Henüz mesaj yok.'}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right Area: Conversation Box */}
      <div className="flex-1 flex flex-col bg-white">
        
        {/* Chat Header */}
        {currentStudentObj ? (
          <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={currentStudentObj.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                alt={currentStudentObj.name}
                className="w-9 h-9 rounded-xl object-cover border border-slate-200"
              />
              <div>
                <h4 className="text-xs font-bold text-slate-900">{currentStudentObj.name}</h4>
                <p className="text-[10px] text-slate-400">@{currentStudentObj.username} • Öğrenci ile Birebir Sohbet</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 border-b border-slate-200 text-xs text-slate-400">
            Bir öğrenci seçiniz
          </div>
        )}

        {/* Message Log */}
        <div className="flex-1 p-5 overflow-y-auto space-y-3 max-h-[420px] bg-slate-50/30">
          {threadMessages.length === 0 ? (
            <div className="text-center py-16 text-slate-400 text-xs">
              Bu öğrenci ile henüz bir mesajlaşma bulunmuyor. Aşağıdaki alandan ilk mesajı siz yazabilirsiniz.
            </div>
          ) : (
            threadMessages.map(msg => {
              const isTeacherMsg = msg.from === 'burak';

              return (
                <div
                  key={msg.id}
                  className={`flex ${isTeacherMsg ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3.5 rounded-2xl text-xs leading-relaxed shadow-2xs ${
                      isTeacherMsg
                        ? 'bg-indigo-600 text-white rounded-tr-none'
                        : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
                    }`}
                  >
                    <div className="text-[10px] font-semibold opacity-75 mb-1">
                      {isTeacherMsg ? 'Siz (Burak Öğretmen)' : currentStudentObj?.name}
                    </div>
                    <p className="whitespace-pre-line">{msg.content}</p>
                    <div className={`text-[9px] mt-1 text-right flex items-center justify-end gap-1 ${
                      isTeacherMsg ? 'text-indigo-200' : 'text-slate-400'
                    }`}>
                      {new Date(msg.createdAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                      {isTeacherMsg && <CheckCheck className="w-3 h-3" />}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-4 border-t border-slate-200 bg-white flex items-center gap-2">
          <input
            type="text"
            value={replyText}
            onChange={e => setReplyText(e.target.value)}
            placeholder={`${currentStudentObj?.name || 'Öğrenciye'} cevap veya yönlendirme yazın...`}
            className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
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

    </div>
  );
};
