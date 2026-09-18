-- ==============================================================================
-- ÖĞRETMEN & ÖĞRENCİ PLATFORMU - SUPABASE VERİTABANI KURULUM KODU (SQL)
-- ==============================================================================
-- Bu SQL kodunu Supabase Dashboard'unuzda (https://supabase.com/dashboard)
-- sol menüdeki "SQL Editor" bölümüne yapıştırıp "Run" butonuna basınız.
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
-- Anonim anahtar (anon) ve yetkilendirilmiş kullanıcılar için okuma/yazma izinleri
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

-- Politikaları tanımla (Her tablo için tam okuma, ekleme, güncelleme ve silme)
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

-- Öğretmen Hesabı ('burak' / '123456') ve Örnek Öğrenciler
INSERT INTO public.users (username, password, name, role, avatar, theme_color, bio, quote)
VALUES 
    ('burak', '123456', 'Burak Öğretmen', 'teacher', 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=150&auto=format&fit=crop&q=80', 'indigo', 'Fen Bilimleri ve Matematik Eğitmeni', 'Öğrenmek bir maceradır.'),
    ('ahmet', '123456', 'Ahmet Yılmaz', 'student', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80', 'indigo', 'Matematik ve uzay meraklısı bir öğrenci.', 'Bilgi güçtür, çalışmak başarının anahtarıdır.'),
    ('ayse', '123456', 'Ayşe Kaya', 'student', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', 'emerald', 'Biyoloji ve fen bilimleri aşığı.', 'Her gün yeni bir şey öğren!'),
    ('zeynep', '123456', 'Zeynep Demir', 'student', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80', 'rose', 'Resim yapmayı ve kodlamayı çok seviyorum.', 'Gelecek onu bugünden inşa edenlerindir.')
ON CONFLICT (username) DO NOTHING;

-- Örnek Ödevler
INSERT INTO public.assignments (id, title, description, subject, due_date, max_score, attachment_url)
VALUES
    ('asg-1', 'Güneş Sistemi ve Gezegenler Araştırması', 'Güneş sistemindeki karasal ve gaz devi gezegenlerin özelliklerini karşılaştırıp en az 3 gezegenin ilginç özelliklerini yazınız.', 'Fen Bilgisi', '2026-09-25', 100, 'https://tr.wikipedia.org/wiki/G%C3%BCne%C5%9F_Sistemi'),
    ('asg-2', 'Kesirlerle Dört İşlem Alıştırmaları', 'Paydaları eşitleme yöntemini kullanarak verilen 5 adet kesirli toplama ve çıkarma işlemini defterinize çözüp sonucunu buraya yazınız.', 'Matematik', '2026-09-28', 100, NULL),
    ('asg-3', 'Maddenin Halleri ve Isı Değişimi Deney Gözlemi', 'Eriyen bir buz küpünün sıcaklık-zaman grafiğini gözlemleyin ve hal değişimi sırasında sıcaklığın neden sabit kaldığını açıklayınız.', 'Fen Bilgisi', '2026-10-02', 100, NULL)
ON CONFLICT (id) DO NOTHING;

-- Örnek Ödev Teslimleri
INSERT INTO public.submissions (id, assignment_id, student_username, content, score, feedback, status)
VALUES
    ('sub-1', 'asg-1', 'ahmet', 'Merkür güneşe en yakın gezegendir fakat en sıcağı Venüstür. Jüpiter ise en büyük gaz devidir ve içinde Dünya onlarca kez sığabilir. Satürn halkaları ise buz ve kayalardan oluşur.', 95, 'Çok başarılı ve özetleyici bir araştırma olmuş Ahmet, tebrikler!', 'graded'),
    ('sub-2', 'asg-1', 'ayse', 'Mars yüzeyindeki demir oksit nedeniyle kızıl görünür. Venüs sera etkisiyle 465 dereceye kadar çıkar. Neptün ise en soğuk rüzgarlı gezegendir.', 90, 'Harika detaylar vermişsin Ayşe, emeğine sağlık.', 'graded'),
    ('sub-3', 'asg-2', 'ahmet', '1) 1/2 + 2/4 = 1\n2) 3/5 - 1/10 = 5/10 = 1/2\n3) 2/3 * 3/4 = 1/2\n4) 4/7 + 3/14 = 11/14\n5) 5/6 - 1/3 = 3/6 = 1/2', NULL, NULL, 'submitted')
ON CONFLICT (id) DO NOTHING;

-- Örnek Ders Videoları
INSERT INTO public.teacher_videos (id, title, description, url, subject, duration_minutes)
VALUES
    ('vid-1', 'Hücre Bölünmesi: Mitoz ve Mayoz Evreleri', 'Mitoz ve Mayoz bölünmenin aşamaları, kromozom sayısı değişimi ve temel farkların animasyonlu anlatımı.', 'https://www.youtube.com/watch?v=f-ldPgEfAHI', 'Fen Bilimleri', 12),
    ('vid-2', 'Kesirler Konu Anlatımı ve Pratik Çözümler', 'Kesirlerde sadeleştirme, genişletme ve problem çözme taktikleri.', 'https://www.youtube.com/watch?v=k3L1iUeqf4g', 'Matematik', 15),
    ('vid-3', 'Işığın Kırılması ve Mercekler Deneyi', 'Farklı ortamlardan geçen ışık ışınlarının kırılma kanunları ve odak noktası deneyi.', 'https://www.youtube.com/watch?v=95V8p3Q82x0', 'Fen Bilimleri', 8)
ON CONFLICT (id) DO NOTHING;

-- Örnek Video İzleme Kayıtları
INSERT INTO public.watch_records (id, video_id, student_username, watched_percent, is_completed)
VALUES
    ('w-1', 'vid-1', 'ahmet', 100, TRUE),
    ('w-2', 'vid-1', 'ayse', 100, TRUE),
    ('w-3', 'vid-1', 'zeynep', 60, FALSE),
    ('w-4', 'vid-2', 'ahmet', 100, TRUE),
    ('w-5', 'vid-2', 'ayse', 80, FALSE)
ON CONFLICT (id) DO NOTHING;

-- Örnek Oyunlar ve Bağlantılar
INSERT INTO public.games (id, title, description, type, subject, badge, url)
VALUES
    ('game-1', 'Hızlı Zihinden Matematik Meydan Okuması', '60 saniyede ekrana gelen zihinden toplama, çıkarma ve çarpma işlemlerini en hızlı şekilde çöz!', 'built-in-math', 'Matematik', 'Hız & Pratik', NULL),
    ('game-2', 'Bilim ve Doğa Genel Kültür Yarışması', 'Gezegenler, atomlar, elementler ve canlılar dünyası hakkında 4 şıklı soruları doğru bil!', 'built-in-words', 'Fen & Doğa', 'Bilgi Yarışması', NULL),
    ('game-3', 'Bilim Terimleri Hafıza Eşleştirme', 'Kartların arkasında gizlenmiş fen ve matematik kavramlarını eşleştirerek hafızanı geliştir.', 'built-in-memory', 'Hafıza & Mantık', 'Hafıza Kartları', NULL),
    ('game-4', 'Wordwall Eğitici Gezegenler Eşleme', 'Wordwall üzerinde hazırlanmış interaktif gezegen ve uzay oyunu.', 'external-link', 'Uzay & Bilim', 'Wordwall Bağlantısı', 'https://wordwall.net/tr/resource/1826131')
ON CONFLICT (id) DO NOTHING;

-- Örnek Oyun Skorları
INSERT INTO public.game_plays (id, game_id, student_username, score)
VALUES
    ('gp-1', 'game-1', 'ahmet', 140),
    ('gp-2', 'game-1', 'ayse', 110),
    ('gp-3', 'game-2', 'ahmet', 85),
    ('gp-4', 'game-2', 'zeynep', 95)
ON CONFLICT (id) DO NOTHING;

-- Örnek Mesajlaşmalar
INSERT INTO public.messages (id, from_username, to_username, student_username, content, is_read)
VALUES
    ('msg-1', 'ahmet', 'burak', 'ahmet', 'Hocam iyi günler, fen ödevindeki 3. soruda Venüsün sıcaklığı ile ilgili takıldım. Yardımcı olabilir misiniz?', TRUE),
    ('msg-2', 'burak', 'ahmet', 'ahmet', 'Merhaba Ahmet! Venüsün atmosferindeki yoğun karbondioksit sera etkisine yol açıyor, araştırmana bu konuyu ekleyebilirsin.', TRUE),
    ('msg-3', 'ayse', 'burak', 'ayse', 'Burak öğretmenim, hücre bölünmesi videosunu izledim ve defterime özet çıkardım. Yarın derste göstereceğim.', FALSE)
ON CONFLICT (id) DO NOTHING;

-- Örnek Öğrenci Kişisel Alanı Öğeleri (Notlar & Linkler)
INSERT INTO public.student_personal_items (id, student_username, type, title, content, category, url)
VALUES
    ('item-1', 'ahmet', 'note', 'Fotosentez Formülü', '6CO2 + 6H2O + Işık -> C6H12O6 + 6O2\nKloroplastta gerçekleşir, gündüz ışık varlığında olur.', 'Fen Bilimleri', NULL),
    ('item-2', 'ahmet', 'link', 'NASA Eyes on the Solar System', 'Güneş sistemini 3 boyutlu simüle eden harika NASA sitesi.', 'Uzay Araştırmaları', 'https://eyes.nasa.gov/apps/solar-system/'),
    ('item-3', 'ayse', 'note', 'Mitoz Bölünme Evreleri Sıralaması', 'Profaz -> Metafaz -> Anafaz -> Telofaz (Kısaltma: PMAT)', 'Ders Notu', NULL)
ON CONFLICT (id) DO NOTHING;

-- ==============================================================================
-- KURULUM TAMAMLANDI!
-- ==============================================================================
