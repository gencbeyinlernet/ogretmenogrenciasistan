import React, { useState } from 'react';
import {
  Database,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  X,
  Sparkles,
  Terminal,
  RefreshCw
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SUPABASE_PROJECT_ID, SUPABASE_DATA_API_URL } from '../lib/supabase';

interface SupabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SUPABASE_SQL_CODE = `-- ==============================================================================
-- ÖĞRETMEN & ÖĞRENCİ PLATFORMU - SUPABASE VERİTABANI KURULUM KODU (SQL)
-- ==============================================================================
-- 1. TABLOLARI OLUŞTUR
-- ------------------------------------------------------------------------------

-- Kullanıcılar Tablosu (Öğretmen ve Öğrenciler)
CREATE TABLE IF NOT EXISTS public.users (
    username TEXT PRIMARY KEY,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('teacher', 'student')),
    avatar TEXT,
    theme_color TEXT DEFAULT 'indigo',
    bio TEXT,
    quote TEXT,
    registered_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ödevler Tablosu (Öğretmenin atadığı ödevler)
CREATE TABLE IF NOT EXISTS public.assignments (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    subject TEXT NOT NULL,
    due_date TEXT NOT NULL,
    max_score INT DEFAULT 100,
    attachment_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ödev Teslimleri Tablosu (Öğrenci yanıtları ve notlar)
CREATE TABLE IF NOT EXISTS public.submissions (
    id TEXT PRIMARY KEY,
    assignment_id TEXT NOT NULL REFERENCES public.assignments(id) ON DELETE CASCADE,
    student_username TEXT NOT NULL REFERENCES public.users(username) ON DELETE CASCADE,
    content TEXT NOT NULL,
    attachment_url TEXT,
    score INT,
    feedback TEXT,
    status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'graded')),
    submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- Öğretmen Ders Videoları Tablosu
CREATE TABLE IF NOT EXISTS public.teacher_videos (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    url TEXT NOT NULL,
    subject TEXT NOT NULL,
    duration_minutes INT DEFAULT 10,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Video İzleme Kayıtları Tablosu (Hangi öğrenci ne kadar izledi?)
CREATE TABLE IF NOT EXISTS public.watch_records (
    id TEXT PRIMARY KEY,
    video_id TEXT NOT NULL REFERENCES public.teacher_videos(id) ON DELETE CASCADE,
    student_username TEXT NOT NULL REFERENCES public.users(username) ON DELETE CASCADE,
    watched_percent INT DEFAULT 0,
    is_completed BOOLEAN DEFAULT FALSE,
    last_watched_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_video_student UNIQUE (video_id, student_username)
);

-- Eğitici Oyunlar ve Bağlantılar Tablosu
CREATE TABLE IF NOT EXISTS public.games (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    type TEXT NOT NULL,
    url TEXT,
    subject TEXT,
    badge TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Oyun Oynama ve Skor Kayıtları Tablosu
CREATE TABLE IF NOT EXISTS public.game_plays (
    id TEXT PRIMARY KEY,
    game_id TEXT NOT NULL REFERENCES public.games(id) ON DELETE CASCADE,
    student_username TEXT NOT NULL REFERENCES public.users(username) ON DELETE CASCADE,
    score INT DEFAULT 0,
    played_at TIMESTAMPTZ DEFAULT NOW()
);

-- Öğrenci Kişisel Alanı (Notlar, Kendi Eklediği Videolar ve Bağlantılar)
CREATE TABLE IF NOT EXISTS public.student_personal_items (
    id TEXT PRIMARY KEY,
    student_username TEXT NOT NULL REFERENCES public.users(username) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('note', 'video', 'link')),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    url TEXT,
    category TEXT,
    color TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Birebir Mesajlaşma Tablosu (Öğretmen ile Öğrenci Arası)
CREATE TABLE IF NOT EXISTS public.messages (
    id TEXT PRIMARY KEY,
    from_username TEXT NOT NULL,
    to_username TEXT NOT NULL,
    student_username TEXT NOT NULL,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Öğrenci Aktivite Geçmişi
CREATE TABLE IF NOT EXISTS public.student_activities (
    id TEXT PRIMARY KEY,
    student_username TEXT NOT NULL,
    action TEXT NOT NULL,
    detail TEXT NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- 2. GÜVENLİK (ROW LEVEL SECURITY - RLS) VE İZİNLER
-- ------------------------------------------------------------------------------
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watch_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_plays ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_personal_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_activities ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    DROP POLICY IF EXISTS "Anon public access users" ON public.users;
    CREATE POLICY "Anon public access users" ON public.users FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Anon public access assignments" ON public.assignments;
    CREATE POLICY "Anon public access assignments" ON public.assignments FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Anon public access submissions" ON public.submissions;
    CREATE POLICY "Anon public access submissions" ON public.submissions FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Anon public access teacher_videos" ON public.teacher_videos;
    CREATE POLICY "Anon public access teacher_videos" ON public.teacher_videos FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Anon public access watch_records" ON public.watch_records;
    CREATE POLICY "Anon public access watch_records" ON public.watch_records FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Anon public access games" ON public.games;
    CREATE POLICY "Anon public access games" ON public.games FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Anon public access game_plays" ON public.game_plays;
    CREATE POLICY "Anon public access game_plays" ON public.game_plays FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Anon public access student_personal_items" ON public.student_personal_items;
    CREATE POLICY "Anon public access student_personal_items" ON public.student_personal_items FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Anon public access messages" ON public.messages;
    CREATE POLICY "Anon public access messages" ON public.messages FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Anon public access student_activities" ON public.student_activities;
    CREATE POLICY "Anon public access student_activities" ON public.student_activities FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
END $$;

GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;

-- 3. BAŞLANGIÇ VERİLERİNİ YÜKLE (SEED DATA)
-- ------------------------------------------------------------------------------
INSERT INTO public.users (username, password, name, role, avatar, theme_color, bio, quote)
VALUES 
    ('burak', '123456', 'Burak Öğretmen', 'teacher', 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=150&auto=format&fit=crop&q=80', 'indigo', 'Fen Bilimleri ve Matematik Eğitmeni', 'Öğrenmek bir maceradır.'),
    ('ahmet', '123456', 'Ahmet Yılmaz', 'student', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80', 'indigo', 'Matematik ve uzay meraklısı bir öğrenci.', 'Bilgi güçtür, çalışmak başarının anahtarıdır.'),
    ('ayse', '123456', 'Ayşe Kaya', 'student', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', 'emerald', 'Biyoloji ve fen bilimleri aşığı.', 'Her gün yeni bir şey öğren!'),
    ('zeynep', '123456', 'Zeynep Demir', 'student', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80', 'rose', 'Resim yapmayı ve kodlamayı çok seviyorum.', 'Gelecek onu bugünden inşa edenlerindir.')
ON CONFLICT (username) DO NOTHING;

INSERT INTO public.assignments (id, title, description, subject, due_date, max_score, attachment_url)
VALUES
    ('asg-1', 'Güneş Sistemi ve Gezegenler Araştırması', 'Güneş sistemindeki karasal ve gaz devi gezegenlerin özelliklerini karşılaştırıp en az 3 gezegenin ilginç özelliklerini yazınız.', 'Fen Bilgisi', '2026-09-25', 100, 'https://tr.wikipedia.org/wiki/G%C3%BCne%C5%9F_Sistemi'),
    ('asg-2', 'Kesirlerle Dört İşlem Alıştırmaları', 'Paydaları eşitleme yöntemini kullanarak verilen 5 adet kesirli toplama ve çıkarma işlemini defterinize çözüp sonucunu buraya yazınız.', 'Matematik', '2026-09-28', 100, NULL),
    ('asg-3', 'Maddenin Halleri ve Isı Değişimi Deney Gözlemi', 'Eriyen bir buz küpünün sıcaklık-zaman grafiğini gözlemleyin ve hal değişimi sırasında sıcaklığın neden sabit kaldığını açıklayınız.', 'Fen Bilgisi', '2026-10-02', 100, NULL)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.submissions (id, assignment_id, student_username, content, score, feedback, status)
VALUES
    ('sub-1', 'asg-1', 'ahmet', 'Merkür güneşe en yakın gezegendir fakat en sıcağı Venüstür. Jüpiter ise en büyük gaz devidir ve içinde Dünya onlarca kez sığabilir. Satürn halkaları ise buz ve kayalardan oluşur.', 95, 'Çok başarılı ve özetleyici bir araştırma olmuş Ahmet, tebrikler!', 'graded'),
    ('sub-2', 'asg-1', 'ayse', 'Mars yüzeyindeki demir oksit nedeniyle kızıl görünür. Venüs sera etkisiyle 465 dereceye kadar çıkar. Neptün ise en soğuk rüzgarlı gezegendir.', 90, 'Harika detaylar vermişsin Ayşe, emeğine sağlık.', 'graded'),
    ('sub-3', 'asg-2', 'ahmet', '1) 1/2 + 2/4 = 1\\n2) 3/5 - 1/10 = 5/10 = 1/2\\n3) 2/3 * 3/4 = 1/2\\n4) 4/7 + 3/14 = 11/14\\n5) 5/6 - 1/3 = 3/6 = 1/2', NULL, NULL, 'submitted')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.teacher_videos (id, title, description, url, subject, duration_minutes)
VALUES
    ('vid-1', 'Hücre Bölünmesi: Mitoz ve Mayoz Evreleri', 'Mitoz ve Mayoz bölünmenin aşamaları, kromozom sayısı değişimi ve temel farkların animasyonlu anlatımı.', 'https://www.youtube.com/watch?v=f-ldPgEfAHI', 'Fen Bilimleri', 12),
    ('vid-2', 'Kesirler Konu Anlatımı ve Pratik Çözümler', 'Kesirlerde sadeleştirme, genişletme ve problem çözme taktikleri.', 'https://www.youtube.com/watch?v=k3L1iUeqf4g', 'Matematik', 15),
    ('vid-3', 'Işığın Kırılması ve Mercekler Deneyi', 'Farklı ortamlardan geçen ışık ışınlarının kırılma kanunları ve odak noktası deneyi.', 'https://www.youtube.com/watch?v=95V8p3Q82x0', 'Fen Bilimleri', 8)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.watch_records (id, video_id, student_username, watched_percent, is_completed)
VALUES
    ('w-1', 'vid-1', 'ahmet', 100, TRUE),
    ('w-2', 'vid-1', 'ayse', 100, TRUE),
    ('w-3', 'vid-1', 'zeynep', 60, FALSE),
    ('w-4', 'vid-2', 'ahmet', 100, TRUE),
    ('w-5', 'vid-2', 'ayse', 80, FALSE)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.games (id, title, description, type, subject, badge, url)
VALUES
    ('game-canva-1', 'Ülke - Başkent Eşleştirme Oyunu', 'Dünya ülkelerini ve başkentlerini eşleştirerek coğrafya ve genel kültür bilgini test et!', 'external-link', 'Coğrafya & Genel Kültür', 'Canva Oyunu', 'https://canvawebsitesi.my.canva.site/lke-ba-kent-e-le-tirme-oyunu'),
    ('game-canva-2', 'Oyun Temalı Yapay Zekâ Kelimeleri', 'Yapay zekâ ve bilişim dünyasının temel kavramlarını eğlenceli oyun formatında keşfet!', 'external-link', 'Bilişim & Yapay Zekâ', 'Canva Oyunu', 'https://canvawebsitesi.my.canva.site/oyun-temal-yapay-zek-kelimeleri'),
    ('game-canva-3', 'Deyim ve Atasözleri Oyunu', 'Türkçemizin zengin deyim ve atasözlerini eğlenceli görsel bulmaca ve eşleştirmelerle öğren!', 'external-link', 'Türkçe & Edebiyat', 'Canva Oyunu', 'https://canvawebsitesi.my.canva.site/deyim-ve-atas-zleri-oyun-logosu'),
    ('game-1', 'Hızlı Zihinden Matematik Meydan Okuması', '60 saniyede ekrana gelen zihinden toplama, çıkarma ve çarpma işlemlerini en hızlı şekilde çöz!', 'built-in-math', 'Matematik', 'Hız & Pratik', NULL),
    ('game-2', 'Bilim ve Doğa Genel Kültür Yarışması', 'Gezegenler, atomlar, elementler ve canlılar dünyası hakkında 4 şıklı soruları doğru bil!', 'built-in-words', 'Fen & Doğa', 'Bilgi Yarışması', NULL),
    ('game-3', 'Bilim Terimleri Hafıza Eşleştirme', 'Kartların arkasında gizlenmiş fen ve matematik kavramlarını eşleştirerek hafızanı geliştir.', 'built-in-memory', 'Hafıza & Mantık', 'Hafıza Kartları', NULL),
    ('game-4', 'Wordwall Eğitici Gezegenler Eşleme', 'Wordwall üzerinde hazırlanmış interaktif gezegen ve uzay oyunu.', 'external-link', 'Uzay & Bilim', 'Wordwall Bağlantısı', 'https://wordwall.net/tr/resource/1826131')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.game_plays (id, game_id, student_username, score)
VALUES
    ('gp-1', 'game-1', 'ahmet', 140),
    ('gp-2', 'game-1', 'ayse', 110),
    ('gp-3', 'game-2', 'ahmet', 85),
    ('gp-4', 'game-2', 'zeynep', 95)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.messages (id, from_username, to_username, student_username, content, is_read)
VALUES
    ('msg-1', 'ahmet', 'burak', 'ahmet', 'Hocam iyi günler, fen ödevindeki 3. soruda Venüsün sıcaklığı ile ilgili takıldım. Yardımcı olabilir misiniz?', TRUE),
    ('msg-2', 'burak', 'ahmet', 'ahmet', 'Merhaba Ahmet! Venüsün atmosferindeki yoğun karbondioksit sera etkisine yol açıyor, araştırmana bu konuyu ekleyebilirsin.', TRUE),
    ('msg-3', 'ayse', 'burak', 'ayse', 'Burak öğretmenim, hücre bölünmesi videosunu izledim ve defterime özet çıkardım. Yarın derste göstereceğim.', FALSE)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.student_personal_items (id, student_username, type, title, content, category, url)
VALUES
    ('item-1', 'ahmet', 'note', 'Fotosentez Formülü', '6CO2 + 6H2O + Işık -> C6H12O6 + 6O2\\nKloroplastta gerçekleşir, gündüz ışık varlığında olur.', 'Fen Bilimleri', NULL),
    ('item-2', 'ahmet', 'link', 'NASA Eyes on the Solar System', 'Güneş sistemini 3 boyutlu simüle eden harika NASA sitesi.', 'Uzay Araştırmaları', 'https://eyes.nasa.gov/apps/solar-system/'),
    ('item-3', 'ayse', 'note', 'Mitoz Bölünme Evreleri Sıralaması', 'Profaz -> Metafaz -> Anafaz -> Telofaz (Kısaltma: PMAT)', 'Ders Notu', NULL)
ON CONFLICT (id) DO NOTHING;
`;

export const SupabaseModal: React.FC<SupabaseModalProps> = ({ isOpen, onClose }) => {
  const { isSupabaseOnline, refreshSupabaseData } = useApp();
  const [copied, setCopied] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshSupabaseData();
    setIsRefreshing(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center backdrop-blur-xs">
              <Database className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold">Supabase Veritabanı Entegrasyonu</h3>
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  isSupabaseOnline ? 'bg-emerald-400/20 text-emerald-100 border border-emerald-300/30' : 'bg-amber-400/20 text-amber-100 border border-amber-300/30'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isSupabaseOnline ? 'bg-emerald-300 animate-ping' : 'bg-amber-300'}`} />
                  {isSupabaseOnline ? 'Canlı Bağlı' : 'SQL Çalıştırma Bekleniyor'}
                </span>
              </div>
              <p className="text-xs text-emerald-100/80">Proje ID: <strong className="font-mono">{SUPABASE_PROJECT_ID}</strong></p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-700 text-xs">
          
          {/* Status Box */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                API Bağlantısı Tanımlandı
              </span>
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium transition cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? 'Kontrol Ediliyor...' : 'Bağlantıyı Yenile'}
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
              <div>
                <span className="text-slate-400">Data API URL:</span>
                <p className="font-mono text-slate-800 truncate">{SUPABASE_DATA_API_URL}</p>
              </div>
              <div>
                <span className="text-slate-400">Durum:</span>
                <p className="font-semibold text-emerald-700">
                  {isSupabaseOnline
                    ? 'Tablolar ve RLS politikaları algılandı, veriler gerçek zamanlı senkronize ediliyor.'
                    : 'Uygulama API anahtarıyla hazır. Aşağıdaki SQL kodunu Supabase Dashboard\'a yapıştırdığınızda tablolar anında aktif olacaktır.'}
                </p>
              </div>
            </div>
          </div>

          {/* Instructions Step-by-Step */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-indigo-600" />
              SQL Kodunu Nasıl Yükleyeceksiniz? (3 Adım)
            </h4>
            <ol className="list-decimal list-inside space-y-1.5 text-slate-600 bg-indigo-50/50 p-3.5 rounded-xl border border-indigo-100">
              <li>
                <a
                  href={`https://supabase.com/dashboard/project/${SUPABASE_PROJECT_ID}/sql`}
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-indigo-700 hover:underline inline-flex items-center gap-1"
                >
                  Supabase SQL Editor'ı açın
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>Aşağıdaki yeşil <strong>"SQL Kodunu Kopyala"</strong> butonuna tıklayın.</li>
              <li>Supabase SQL Editor'de <strong>"New query"</strong> butonuna basıp kodu yapıştırın ve sağ alttaki <strong>"Run"</strong> butonuna tıklayın.</li>
            </ol>
          </div>

          {/* SQL Code Box with Copy Button */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Veritabanı Tabloları, İzinler ve Örnek Veriler SQL Kodu:
              </span>
              <button
                onClick={handleCopy}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer shadow-xs ${
                  copied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    Kopyalandı!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    SQL Kodunu Kopyala
                  </>
                )}
              </button>
            </div>

            <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 text-slate-200 font-mono text-[11px]">
              <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-slate-400">
                <span>supabase_schema.sql (10 Tablo + RLS Güvenlik Politikaları + Başlangıç Verileri)</span>
                <button
                  onClick={handleCopy}
                  className="hover:text-white transition flex items-center gap-1 cursor-pointer"
                >
                  <Copy className="w-3 h-3" />
                  {copied ? 'Kopyalandı' : 'Kopyala'}
                </button>
              </div>
              <pre className="p-4 max-h-72 overflow-y-auto overflow-x-auto whitespace-pre leading-relaxed text-emerald-400 selection:bg-emerald-800 selection:text-white">
                {SUPABASE_SQL_CODE}
              </pre>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Öğretmen ve örnek öğrenci hesapları SQL şeması içinde güvenli olarak yapılandırılmıştır.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-bold transition cursor-pointer"
          >
            Kapat
          </button>
        </div>

      </div>
    </div>
  );
};
