import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { AuthModal } from './components/AuthModal';
import { SupabaseModal } from './components/SupabaseModal';
import { TeacherDashboard } from './components/TeacherDashboard/TeacherDashboard';
import { StudentDashboard } from './components/StudentDashboard/StudentDashboard';
import {
  GraduationCap,
  Shield,
  UserCheck,
  UserPlus,
  BookOpen,
  Gamepad2,
  Video,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Lock
} from 'lucide-react';

interface AuthModalState {
  isOpen: boolean;
  defaultTab: 'login' | 'register';
  initialUsername?: string;
  initialPassword?: string;
}

const AppContent: React.FC = () => {
  const { currentUser, isTeacher, isStudent } = useApp();
  const [authState, setAuthState] = useState<AuthModalState>({
    isOpen: false,
    defaultTab: 'login',
  });
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Top Navigation */}
      <Navbar
        onOpenAuth={tab => setAuthState({ isOpen: true, defaultTab: tab || 'login' })}
        onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16">
        {currentUser ? (
          // Logged in: show role-specific dashboard
          isTeacher ? (
            <TeacherDashboard />
          ) : isStudent ? (
            <StudentDashboard />
          ) : null
        ) : (
          // Not logged in: Show Portal Welcome Screen
          <div className="space-y-12 py-6">
            
            {/* Hero Section */}
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                Öğretmen & Öğrenci İnteraktif Eğitim Platformu
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Bireysel Öğrenci Alanları ve <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                  Öğretmen Takip Sistemi
                </span>
              </h1>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Öğretmen tüm sınıfın ödevlerini, video izlenmelerini ve oyun skorlarını tek panelden takip eder. Öğrenciler ise sadece kendi çalışma alanlarını özelleştirir, ders materyallerine erişir ve öğretmenine soru iletebilir.
              </p>
            </div>

            {/* Role Gate Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              
              {/* Teacher Portal Card */}
              <div className="bg-white rounded-3xl border-2 border-indigo-100 hover:border-indigo-400 p-8 shadow-sm hover:shadow-md transition flex flex-col justify-between group">
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mb-6 shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform">
                    <Shield className="w-7 h-7" />
                  </div>

                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-xs font-bold mb-2">
                    Yönetici & Eğitmen
                  </div>

                  <h2 className="text-xl font-bold text-slate-900 mb-2">
                    Öğretmen Girişi
                  </h2>

                  <p className="text-xs text-slate-500 leading-relaxed mb-6">
                    Yetkili öğretmen girişi yaparak öğrenci durumlarını, ödev teslimlerini, ders videolarını ve eğitici etkinlikleri güvenle yönetebilirsiniz.
                  </p>

                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs space-y-1 mb-6">
                    <div className="text-slate-800 font-semibold flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-indigo-600" />
                      Yetkili Öğretmen Girişi
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Öğretmen paneline yalnızca yetkili öğretmen kendi özel kullanıcı adı ve şifresi ile erişebilir.
                    </p>
                  </div>
                </div>

                <button
                  id="teacher-portal-login-btn"
                  onClick={() =>
                    setAuthState({
                      isOpen: true,
                      defaultTab: 'login',
                    })
                  }
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <Shield className="w-4 h-4" />
                  Öğretmen Paneline Giriş Yap
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Student Portal Card */}
              <div className="bg-white rounded-3xl border-2 border-purple-100 hover:border-purple-400 p-8 shadow-sm hover:shadow-md transition flex flex-col justify-between group">
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-purple-600 text-white flex items-center justify-center mb-6 shadow-md shadow-purple-200 group-hover:scale-105 transition-transform">
                    <GraduationCap className="w-7 h-7" />
                  </div>

                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-purple-50 text-purple-700 text-xs font-bold mb-2">
                    Öğrenci Portalı
                  </div>

                  <h2 className="text-xl font-bold text-slate-900 mb-2">
                    Öğrenci Giriş & Kayıt
                  </h2>

                  <p className="text-xs text-slate-500 leading-relaxed mb-6">
                    Öğrenciler sadece kullanıcı adı ve şifre belirleyerek sisteme hızlıca kayıt olur. Diğer öğrencileri görmez, kendi notlarını, videolarını ve ödevlerini yönetir.
                  </p>

                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs space-y-2 mb-6">
                    <div className="flex items-center gap-2 text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Sadece kullanıcı adı ve şifre yeterlidir</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Kişiselleştirilebilir kendi çalışma arayüzü</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Burak Öğretmene doğrudan soru sorma</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    id="student-portal-register-btn"
                    onClick={() =>
                      setAuthState({
                        isOpen: true,
                        defaultTab: 'register',
                        initialUsername: '',
                        initialPassword: '',
                      })
                    }
                    className="py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <UserPlus className="w-4 h-4" />
                    Öğrenci Kayıt Ol
                  </button>
                  <button
                    id="student-portal-login-btn"
                    onClick={() =>
                      setAuthState({
                        isOpen: true,
                        defaultTab: 'login',
                        initialUsername: '',
                        initialPassword: '',
                      })
                    }
                    className="py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <UserCheck className="w-4 h-4" />
                    Giriş Yap
                  </button>
                </div>
              </div>

            </div>

            {/* Feature Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto pt-6 border-t border-slate-200">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Anlık Ödev Dağıtımı</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Öğretmenin atadığı ödevler anında öğrenci ekranına düşer ve teslimler takip edilir.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Video İzleme Takibi</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Hangi öğrencinin hangi videoyu ne kadar süre izlediği öğretmen panelinde listelenir.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                  <Gamepad2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Eğitici Oyunlar</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Zihinden matematik, bilgi yarışması ve hafıza kartları ile eğlenceli öğrenme.
                  </p>
                </div>
              </div>
            </div>

          </div>
        )}
      </main>

      {/* Auth Modal (if open) */}
      <AuthModal
        key={`${authState.defaultTab}-${authState.initialUsername || 'blank'}`}
        isOpen={authState.isOpen}
        defaultTab={authState.defaultTab}
        initialUsername={authState.initialUsername}
        initialPassword={authState.initialPassword}
        onClose={() => setAuthState(prev => ({ ...prev, isOpen: false }))}
      />

      {/* Supabase SQL & Connection Modal */}
      <SupabaseModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
      />

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
