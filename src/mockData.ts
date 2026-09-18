import {
  User,
  Assignment,
  AssignmentSubmission,
  TeacherVideo,
  VideoWatchRecord,
  TeacherGameOrLink,
  GamePlayRecord,
  Message,
  StudentActivity,
  StudentPersonalItem
} from './types';

// Pre-seeded users
// Teacher credentials: username 'burak', password '123456'
export const INITIAL_TEACHER: User = {
  username: 'burak',
  role: 'teacher',
  name: 'Burak Öğretmen',
  registeredAt: '2026-09-01T08:00:00Z',
  avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=150&auto=format&fit=crop&q=80',
  bio: 'Fen Bilgisi ve Matematik Eğitmeni',
};

export const INITIAL_STUDENTS: { user: User; pass: string }[] = [
  {
    user: {
      username: 'ahmet',
      role: 'student',
      name: 'Ahmet Yılmaz',
      registeredAt: '2026-09-10T10:30:00Z',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      themeColor: 'indigo',
      bio: 'Matematik ve uzay meraklısı bir öğrenci.',
      quote: 'Bilgi güçtür, çalışmak başarının anahtarıdır.',
    },
    pass: '123456',
  },
  {
    user: {
      username: 'ayse',
      role: 'student',
      name: 'Ayşe Kaya',
      registeredAt: '2026-09-12T14:15:00Z',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      themeColor: 'emerald',
      bio: 'Biyoloji ve fen bilimleri aşığı.',
      quote: 'Her gün yeni bir şey öğren!',
    },
    pass: '123456',
  },
  {
    user: {
      username: 'zeynep',
      role: 'student',
      name: 'Zeynep Demir',
      registeredAt: '2026-09-15T09:20:00Z',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80',
      themeColor: 'rose',
      bio: 'Resim yapmayı ve kodlamayı çok seviyorum.',
      quote: 'Gelecek onu bugünden inşa edenlerindir.',
    },
    pass: '123456',
  },
];

export const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: 'asg-1',
    title: 'Güneş Sistemi ve Gezegenler Araştırması',
    subject: 'Fen Bilgisi',
    description: 'Güneş sistemindeki karasal ve gaz devi gezegenlerin özelliklerini karşılaştırıp en az 3 gezegenin ilginç özelliklerini yazınız.',
    dueDate: '2026-09-25',
    maxScore: 100,
    attachmentUrl: 'https://tr.wikipedia.org/wiki/G%C3%BCne%C5%9F_Sistemi',
    createdAt: '2026-09-15T09:00:00Z',
  },
  {
    id: 'asg-2',
    title: 'Kesirlerle Dört İşlem Alıştırmaları',
    subject: 'Matematik',
    description: 'Paydaları eşitleme yöntemini kullanarak verilen 5 adet kesirli toplama ve çıkarma işlemini defterinize çözüp sonucunu buraya yazınız.',
    dueDate: '2026-09-28',
    maxScore: 100,
    createdAt: '2026-09-16T11:00:00Z',
  },
  {
    id: 'asg-3',
    title: 'Maddenin Halleri ve Isı Değişimi Deney Gözlemi',
    subject: 'Fen Bilgisi',
    description: 'Eriyen bir buz küpünün sıcaklık-zaman grafiğini gözlemleyin ve hal değişimi sırasında sıcaklığın neden sabit kaldığını açıklayınız.',
    dueDate: '2026-10-02',
    maxScore: 100,
    createdAt: '2026-09-17T14:30:00Z',
  }
];

export const INITIAL_SUBMISSIONS: AssignmentSubmission[] = [
  {
    id: 'sub-1',
    assignmentId: 'asg-1',
    studentUsername: 'ahmet',
    submittedAt: '2026-09-16T16:45:00Z',
    content: 'Öğretmenim, Merkür, Venüs ve Jüpiter gezegenlerini inceledim. Merkür güneşe en yakın olmasına rağmen Venüs sera gazları nedeniyle en sıcak gezegendir. Jüpiter ise en büyük gaz devidir.',
    score: 95,
    feedback: 'Tebrikler Ahmet! Karşılaştırman ve sera etkisi tespiti çok başarılı.',
    status: 'graded',
  },
  {
    id: 'sub-2',
    assignmentId: 'asg-1',
    studentUsername: 'ayse',
    submittedAt: '2026-09-17T10:15:00Z',
    content: 'Mars, Satürn ve Neptün gezegenlerini araştırdım. Mars kızıl rengini demir oksitten alır. Satürn halkaları buz parçacıklarından oluşur.',
    score: 100,
    feedback: 'Harika bir araştırma Ayşe, kaynak kullanımın da çok düzenli.',
    status: 'graded',
  },
  {
    id: 'sub-3',
    assignmentId: 'asg-2',
    studentUsername: 'ahmet',
    submittedAt: '2026-09-17T18:00:00Z',
    content: '1) 1/2 + 2/3 = 7/6\n2) 3/4 - 1/8 = 5/8\n3) 2/5 + 3/10 = 7/10\n4) 5/6 - 1/3 = 1/2\n5) 1/4 + 3/8 = 5/8',
    status: 'submitted',
  }
];

export const INITIAL_VIDEOS: TeacherVideo[] = [
  {
    id: 'vid-1',
    title: 'Güneş Sistemi ve Gezegenlerin Gizemi',
    subject: 'Fen Bilimleri',
    description: 'Gezegenlerin yörüngeleri, boyutları ve büyüleyici uzay olayları.',
    url: 'https://www.youtube.com/watch?v=libKVRa01L8',
    durationMinutes: 12,
    createdAt: '2026-09-14T10:00:00Z',
  },
  {
    id: 'vid-2',
    title: 'Pratik Matematik: Kesirleri Kolayca Anlama',
    subject: 'Matematik',
    description: 'Görsel modellemeler ve günlük hayat örnekleriyle kesir kavramı.',
    url: 'https://www.youtube.com/watch?v=CAk_6rFj5Z4',
    durationMinutes: 9,
    createdAt: '2026-09-15T13:00:00Z',
  },
  {
    id: 'vid-3',
    title: 'Maddenin Halleri ve Moleküler Hareket',
    subject: 'Fen Bilgisi',
    description: 'Katı, sıvı ve gaz halindeki molekül kinetiği ve faz değişimleri.',
    url: 'https://www.youtube.com/watch?v=bMbm_N81wG4',
    durationMinutes: 8,
    createdAt: '2026-09-17T09:30:00Z',
  }
];

export const INITIAL_WATCH_RECORDS: VideoWatchRecord[] = [
  {
    id: 'rec-1',
    videoId: 'vid-1',
    studentUsername: 'ahmet',
    watchedPercent: 100,
    isCompleted: true,
    lastWatchedAt: '2026-09-15T15:20:00Z',
  },
  {
    id: 'rec-2',
    videoId: 'vid-1',
    studentUsername: 'ayse',
    watchedPercent: 100,
    isCompleted: true,
    lastWatchedAt: '2026-09-16T11:40:00Z',
  },
  {
    id: 'rec-3',
    videoId: 'vid-2',
    studentUsername: 'ahmet',
    watchedPercent: 85,
    isCompleted: false,
    lastWatchedAt: '2026-09-17T19:10:00Z',
  }
];

export const INITIAL_GAMES: TeacherGameOrLink[] = [
  {
    id: 'game-1',
    title: 'Hızlı Zihinden Matematik Meydan Okuması',
    description: 'Süre bitmeden olabildiğince çok matematik işlemini doğru çöz ve en yüksek skora ulaş!',
    type: 'built-in-math',
    subject: 'Matematik',
    badge: 'İnteraktif Oyun',
    createdAt: '2026-09-13T10:00:00Z',
  },
  {
    id: 'game-2',
    title: 'Genel Kültür & Bilim Bilgi Yarışması',
    description: 'Uzay, fen, coğrafya ve tarih sorularıyla seviyeleri tamamla!',
    type: 'built-in-words',
    subject: 'Fen & Genel Kültür',
    badge: 'Bilgi Kartı',
    createdAt: '2026-09-14T11:30:00Z',
  },
  {
    id: 'game-3',
    title: 'Bilim Terimleri Hafıza Eşleştirme',
    description: 'Kapalı kartları çevirerek terim ve görselleri eşleştir, hafızanı test et!',
    type: 'built-in-memory',
    subject: 'Hafıza & Mantık',
    badge: 'Kart Eşleme',
    createdAt: '2026-09-16T12:00:00Z',
  },
  {
    id: 'game-canva-1',
    title: 'Ülke - Başkent Eşleştirme Oyunu',
    description: 'Dünya ülkelerini ve başkentlerini eşleştirerek coğrafya ve genel kültür bilgini test et!',
    type: 'external-link',
    url: 'https://canvawebsitesi.my.canva.site/lke-ba-kent-e-le-tirme-oyunu',
    subject: 'Coğrafya & Genel Kültür',
    badge: 'Canva Oyunu',
    createdAt: '2026-09-18T10:00:00Z',
  },
  {
    id: 'game-canva-2',
    title: 'Oyun Temalı Yapay Zekâ Kelimeleri',
    description: 'Yapay zekâ ve bilişim dünyasının temel kavramlarını eğlenceli oyun formatında keşfet!',
    type: 'external-link',
    url: 'https://canvawebsitesi.my.canva.site/oyun-temal-yapay-zek-kelimeleri',
    subject: 'Bilişim & Yapay Zekâ',
    badge: 'Canva Oyunu',
    createdAt: '2026-09-18T10:15:00Z',
  },
  {
    id: 'game-canva-3',
    title: 'Deyim ve Atasözleri Oyunu',
    description: 'Türkçemizin zengin deyim ve atasözlerini eğlenceli görsel bulmaca ve eşleştirmelerle öğren!',
    type: 'external-link',
    url: 'https://canvawebsitesi.my.canva.site/deyim-ve-atas-zleri-oyun-logosu',
    subject: 'Türkçe & Edebiyat',
    badge: 'Canva Oyunu',
    createdAt: '2026-09-18T10:30:00Z',
  },
  {
    id: 'game-4',
    title: 'TÜBİTAK Bilim Genç İnteraktif Deneyler',
    description: 'Etkileşimli simülasyonlar ve bilimsel deney alanı bağlantısı.',
    type: 'external-link',
    url: 'https://bilimgenc.tubitak.gov.tr',
    subject: 'Fen Bilgisi',
    badge: 'Dış Bağlantı',
    createdAt: '2026-09-17T15:00:00Z',
  }
];

export const INITIAL_GAME_PLAYS: GamePlayRecord[] = [
  {
    id: 'gp-1',
    gameId: 'game-1',
    studentUsername: 'ahmet',
    score: 180,
    playedAt: '2026-09-16T14:10:00Z',
  },
  {
    id: 'gp-2',
    gameId: 'game-2',
    studentUsername: 'ayse',
    score: 250,
    playedAt: '2026-09-17T11:00:00Z',
  }
];

export const INITIAL_MESSAGES: Message[] = [
  {
    id: 'msg-1',
    from: 'ahmet',
    to: 'burak',
    studentUsername: 'ahmet',
    content: 'Merhaba Burak Öğretmenim, kesirler ödevindeki 4. soruda takıldım, paydaları 12 de mi eşitlemeliyiz?',
    createdAt: '2026-09-17T17:15:00Z',
    isRead: true,
  },
  {
    id: 'msg-2',
    from: 'burak',
    to: 'ahmet',
    studentUsername: 'ahmet',
    content: 'Merhaba Ahmet, evet hem 6 hem de 12 ile eşitleyebilirsin, en küçük ortak kat olan 6 daha kolay işlem sağlar. Aferin!',
    createdAt: '2026-09-17T17:30:00Z',
    isRead: true,
  },
  {
    id: 'msg-3',
    from: 'ayse',
    to: 'burak',
    studentUsername: 'ayse',
    content: 'Öğretmenim yeni paylaştığınız Güneş Sistemi videosunu izledim, çok faydalı oldu teşekkürler!',
    createdAt: '2026-09-17T12:00:00Z',
    isRead: false,
  }
];

export const INITIAL_ACTIVITIES: StudentActivity[] = [
  {
    id: 'act-1',
    studentUsername: 'ahmet',
    action: 'watch_video',
    detail: '"Güneş Sistemi ve Gezegenlerin Gizemi" videosunu tamamladı (%100).',
    timestamp: '2026-09-15T15:20:00Z',
  },
  {
    id: 'act-2',
    studentUsername: 'ahmet',
    action: 'submit_assignment',
    detail: '"Güneş Sistemi ve Gezegenler Araştırması" ödevini teslim etti.',
    timestamp: '2026-09-16T16:45:00Z',
  },
  {
    id: 'act-3',
    studentUsername: 'ayse',
    action: 'watch_video',
    detail: '"Güneş Sistemi ve Gezegenlerin Gizemi" videosunu tamamladı (%100).',
    timestamp: '2026-09-16T11:40:00Z',
  },
  {
    id: 'act-4',
    studentUsername: 'ayse',
    action: 'submit_assignment',
    detail: '"Güneş Sistemi ve Gezegenler Araştırması" ödevini teslim etti.',
    timestamp: '2026-09-17T10:15:00Z',
  },
  {
    id: 'act-5',
    studentUsername: 'ahmet',
    action: 'play_game',
    detail: '"Hızlı Zihinden Matematik" oyununda 180 puan aldı.',
    timestamp: '2026-09-16T14:10:00Z',
  },
  {
    id: 'act-6',
    studentUsername: 'ahmet',
    action: 'send_message',
    detail: 'Öğretmene soru mesajı gönderdi.',
    timestamp: '2026-09-17T17:15:00Z',
  }
];

export const INITIAL_STUDENT_ITEMS: StudentPersonalItem[] = [
  {
    id: 'pi-1',
    studentUsername: 'ahmet',
    type: 'note',
    title: 'Gezegen Sıralaması Hafıza Notum',
    content: 'Merkür, Venüs, Dünya, Mars, Jüpiter, Satürn, Uranüs, Neptün. (Kısaltma: Meraklı Veli Dünyadan Marsa Jetle Uçtu Neden?)',
    category: 'Fen',
    color: '#e0e7ff',
    createdAt: '2026-09-15T16:00:00Z',
  },
  {
    id: 'pi-2',
    studentUsername: 'ahmet',
    type: 'link',
    title: 'NASA Solar System Exploration',
    content: 'Güneş sistemi hakkında 3B modellemeler içeren resmi NASA sayfası.',
    url: 'https://solarsystem.nasa.gov',
    category: 'Kaynak',
    createdAt: '2026-09-16T10:00:00Z',
  },
  {
    id: 'pi-3',
    studentUsername: 'ahmet',
    type: 'video',
    title: 'Evrenin Büyüklüğü Karşılaştırması',
    content: 'Atomlardan galaksilere kadar boyut karşılaştırması animasyonu.',
    url: 'https://www.youtube.com/watch?v=17jymDn0W6U',
    category: 'İlham',
    createdAt: '2026-09-16T11:20:00Z',
  }
];
