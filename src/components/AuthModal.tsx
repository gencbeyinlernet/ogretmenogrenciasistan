import React, { useState } from 'react';
import { LogIn, UserPlus, GraduationCap, School, AlertCircle, CheckCircle2, KeyRound, User as UserIcon, Shield } from 'lucide-react';
import { useApp } from '../context/AppContext';

export type AuthTab = 'login' | 'register';

export interface AuthModalProps {
  isOpen: boolean;
  onClose?: () => void;
  defaultTab?: 'login' | 'register';
  initialUsername?: string;
  initialPassword?: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'login',
  initialUsername = '',
  initialPassword = ''
}) => {
  const { login, registerStudent } = useApp();
  const [tab, setTab] = useState<'login' | 'register'>(defaultTab);
  const [username, setUsername] = useState(initialUsername);
  const [password, setPassword] = useState(initialPassword);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (tab === 'login') {
      const res = await login(username, password);
      if (res.success) {
        setSuccess(res.message);
        if (onClose) setTimeout(onClose, 500);
      } else {
        setError(res.message);
      }
    } else {
      const res = await registerStudent(username, password);
      if (res.success) {
        setSuccess(res.message);
        if (onClose) setTimeout(onClose, 700);
      } else {
        setError(res.message);
      }
    }
  };

  const handleQuickLogin = async (u: string, p: string) => {
    setUsername(u);
    setPassword(p);
    setError(null);
    const res = await login(u, p);
    if (res.success) {
      setSuccess(res.message);
      if (onClose) setTimeout(onClose, 400);
    } else {
      setError(res.message);
    }
  };

  return (
    <div id="auth-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-200">
        
        {/* Header Visual */}
        <div className="bg-gradient-to-br from-indigo-700 via-indigo-800 to-slate-900 p-6 text-white text-center relative">
          <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-3 backdrop-blur-sm border border-white/20">
            <GraduationCap className="w-8 h-8 text-indigo-200" />
          </div>
          <h2 className="text-xl font-bold">Eğitim & Öğrenci Platformu</h2>
          <p className="text-xs text-indigo-200 mt-1">Öğretmen ve Öğrenci Ortak Çalışma Portalı</p>

          {/* Navigation Tabs */}
          <div className="flex bg-black/20 p-1 rounded-xl mt-5 border border-white/10">
            <button
              id="tab-login-btn"
              type="button"
              onClick={() => { setTab('login'); setError(null); setSuccess(null); }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 ${
                tab === 'login' ? 'bg-white text-indigo-900 shadow-sm' : 'text-white/80 hover:text-white'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              Giriş Yap
            </button>
            <button
              id="tab-register-btn"
              type="button"
              onClick={() => { setTab('register'); setError(null); setSuccess(null); }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 ${
                tab === 'register' ? 'bg-white text-indigo-900 shadow-sm' : 'text-white/80 hover:text-white'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              Öğrenci Kaydı
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {tab === 'login' ? (
            <div className="mb-4 bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs text-slate-600">
              <div className="font-semibold text-slate-800 mb-1 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-indigo-600" />
                Güvenli Giriş:
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Öğretmen ve öğrenciler kullanıcı adı ve şifreleriyle sisteme giriş yapabilir.
              </p>
            </div>
          ) : (
            <div className="mb-4 bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-xs text-emerald-800">
              <div className="font-semibold mb-0.5">Öğrenci Kayıt Formu</div>
              <p className="text-[11px] text-emerald-700">
                Sadece kullanıcı adı ve şifre belirleyerek anında öğrenci profilinizi oluşturabilirsiniz.
              </p>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Kullanıcı Adı
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <UserIcon className="w-4 h-4" />
                </div>
                <input
                  id="auth-username-input"
                  type="text"
                  required
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder={tab === 'login' ? 'Kullanıcı adınızı giriniz' : 'Öğrenci kullanıcı adınız'}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Şifre
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  id="auth-password-input"
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Şifrenizi girin"
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                />
              </div>
            </div>

            <button
              id="auth-submit-btn"
              type="submit"
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition cursor-pointer shadow-sm mt-2 text-sm flex items-center justify-center gap-2"
            >
              {tab === 'login' ? (
                <>
                  <LogIn className="w-4 h-4" />
                  Sisteme Giriş Yap
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  Kayıt Ol ve Giriş Yap
                </>
              )}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
