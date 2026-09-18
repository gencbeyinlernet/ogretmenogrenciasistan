import React, { useState } from 'react';
import {
  GraduationCap,
  LogOut,
  Users,
  UserCheck,
  ChevronDown,
  Sparkles,
  Shield,
  MessageSquare,
  Database
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface NavbarProps {
  onOpenAuth: (tab?: 'login' | 'register') => void;
  activeSection?: string;
  onNavigate?: (section: string) => void;
  onOpenSupabaseModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAuth, onNavigate, onOpenSupabaseModal }) => {
  const { currentUser, isTeacher, isStudent, students, switchUserQuick, logout, messages, isSupabaseOnline } = useApp();
  const [showSwitchDropdown, setShowSwitchDropdown] = useState(false);

  // Unread messages for current user
  const unreadCount = messages.filter(m => {
    if (isTeacher) {
      return m.to === 'burak' && !m.isRead;
    } else if (currentUser) {
      return m.to === currentUser.username && !m.isRead;
    }
    return false;
  }).length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-800 text-white flex items-center justify-center shadow-sm">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-slate-900 tracking-tight">
                  Eğitim Portalı
                </h1>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {isTeacher ? 'Öğretmen Paneli' : isStudent ? 'Öğrenci Alanı' : 'Ziyaretçi'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                Öğretmen ve Öğrenci Entegre Çalışma Sistemi
              </p>
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Supabase Status & SQL Viewer Button */}
            {onOpenSupabaseModal && (
              <button
                id="navbar-supabase-btn"
                onClick={onOpenSupabaseModal}
                className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border border-emerald-200 bg-emerald-50/80 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold transition cursor-pointer shadow-2xs"
                title="Supabase Veritabanı Bağlantısı ve SQL Kodu"
              >
                <Database className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden md:inline">Supabase SQL</span>
                <span
                  className={`w-2 h-2 rounded-full ${
                    isSupabaseOnline ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                  }`}
                  title={isSupabaseOnline ? 'Supabase Canlı Bağlı' : 'SQL Çalıştırma Bekleniyor'}
                />
              </button>
            )}

            {currentUser ? (
              <div className="flex items-center gap-2 sm:gap-3">
                
                {/* Messages shortcut */}
                {onNavigate && (
                  <button
                    onClick={() => onNavigate('messages')}
                    className="relative p-2 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                    title="Mesajlar"
                  >
                    <MessageSquare className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                )}

                {/* Account Switcher Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowSwitchDropdown(prev => !prev)}
                    className="flex items-center gap-2 p-1.5 pl-2.5 pr-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-700 transition cursor-pointer text-xs font-semibold"
                  >
                    <div className="flex items-center gap-2">
                      {isTeacher ? (
                        <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                          <Shield className="w-3.5 h-3.5" />
                        </div>
                      ) : (
                        <img
                          src={currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                          alt={currentUser.name}
                          className="w-6 h-6 rounded-lg object-cover"
                        />
                      )}
                      <span className="max-w-[100px] truncate">{currentUser.name}</span>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {/* Dropdown Menu */}
                  {showSwitchDropdown && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95">
                      <div className="px-3 py-2 border-b border-slate-100">
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Aktif Oturum</p>
                        <p className="text-xs font-semibold text-slate-800">{currentUser.name}</p>
                        <p className="text-[11px] text-slate-500">
                          {isTeacher ? '👨‍🏫 Yetkili Öğretmen' : '🎒 Kayıtlı Öğrenci'}
                        </p>
                      </div>

                      <div className="max-h-60 overflow-y-auto py-1">
                        {/* If student is logged in and wants teacher access, prompt login modal */}
                        {!isTeacher && (
                          <button
                            onClick={() => {
                              setShowSwitchDropdown(false);
                              onOpenAuth('login');
                            }}
                            className="w-full px-3 py-2 text-left flex items-center justify-between text-xs hover:bg-indigo-50 text-indigo-700 transition cursor-pointer font-medium"
                          >
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-md bg-indigo-600 text-white flex items-center justify-center">
                                <Shield className="w-3 h-3" />
                              </div>
                              <div>
                                <div>Öğretmen Girişi Yap</div>
                                <div className="text-[10px] text-indigo-500">Şifre gereklidir</div>
                              </div>
                            </div>
                          </button>
                        )}

                        {/* Teacher profile status if teacher logged in */}
                        {isTeacher && (
                          <div className="px-3 py-2 bg-indigo-50/70 text-indigo-800 text-xs flex items-center justify-between font-semibold rounded-lg mx-1">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-md bg-indigo-600 text-white flex items-center justify-center">
                                <Shield className="w-3 h-3" />
                              </div>
                              <span>Burak Öğretmen (Yetkili)</span>
                            </div>
                            <UserCheck className="w-4 h-4 text-indigo-600" />
                          </div>
                        )}

                        <div className="my-1 border-t border-slate-100 px-3 py-1">
                          <span className="text-[10px] font-semibold text-slate-400 uppercase">Öğrenci Hesapları</span>
                        </div>

                        {/* Students */}
                        {students.map(std => (
                          <button
                            key={std.username}
                            onClick={() => {
                              switchUserQuick(std.username);
                              setShowSwitchDropdown(false);
                            }}
                            className={`w-full px-3 py-2 text-left flex items-center justify-between text-xs hover:bg-slate-50 transition cursor-pointer ${
                              currentUser.username === std.username ? 'bg-emerald-50 text-emerald-800 font-bold' : 'text-slate-700'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <img
                                src={std.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                                alt={std.name}
                                className="w-6 h-6 rounded-md object-cover"
                              />
                              <div>
                                <div>{std.name}</div>
                                <div className="text-[10px] text-slate-400">@{std.username}</div>
                              </div>
                            </div>
                            {currentUser.username === std.username && <UserCheck className="w-4 h-4 text-emerald-600" />}
                          </button>
                        ))}
                      </div>

                      <div className="border-t border-slate-100 pt-1 mt-1">
                        <button
                          onClick={() => {
                            setShowSwitchDropdown(false);
                            onOpenAuth('register');
                          }}
                          className="w-full px-3 py-2 text-left text-xs text-indigo-600 hover:bg-indigo-50 font-medium flex items-center gap-2 cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          Yeni Öğrenci Kaydet
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Logout Button */}
                <button
                  id="navbar-logout-btn"
                  onClick={logout}
                  className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer"
                  title="Çıkış Yap"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  id="navbar-login-btn"
                  onClick={() => onOpenAuth('login')}
                  className="px-4 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition cursor-pointer"
                >
                  Giriş Yap
                </button>
                <button
                  id="navbar-register-btn"
                  onClick={() => onOpenAuth('register')}
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition cursor-pointer shadow-xs"
                >
                  Öğrenci Kaydı
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
