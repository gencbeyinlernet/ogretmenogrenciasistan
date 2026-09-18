import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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
  StudentPersonalItem,
} from '../types';
import {
  INITIAL_TEACHER,
  INITIAL_STUDENTS,
  INITIAL_ASSIGNMENTS,
  INITIAL_SUBMISSIONS,
  INITIAL_VIDEOS,
  INITIAL_WATCH_RECORDS,
  INITIAL_GAMES,
  INITIAL_GAME_PLAYS,
  INITIAL_MESSAGES,
  INITIAL_ACTIVITIES,
  INITIAL_STUDENT_ITEMS,
} from '../mockData';
import { supabase } from '../lib/supabase';

interface RegisteredAccount {
  user: User;
  pass: string;
}

interface AppContextType {
  currentUser: User | null;
  isTeacher: boolean;
  isStudent: boolean;
  students: User[];
  assignments: Assignment[];
  submissions: AssignmentSubmission[];
  videos: TeacherVideo[];
  watchRecords: VideoWatchRecord[];
  games: TeacherGameOrLink[];
  gamePlays: GamePlayRecord[];
  messages: Message[];
  activities: StudentActivity[];
  studentItems: StudentPersonalItem[];
  isSupabaseOnline: boolean;
  
  // Auth methods
  login: (username: string, pass: string) => Promise<{ success: boolean; message: string }> | { success: boolean; message: string };
  registerStudent: (username: string, pass: string) => Promise<{ success: boolean; message: string }> | { success: boolean; message: string };
  logout: () => void;
  switchUserQuick: (username: string) => void;

  // Teacher actions
  addAssignment: (asg: Omit<Assignment, 'id' | 'createdAt'>) => void;
  deleteAssignment: (id: string) => void;
  gradeSubmission: (submissionId: string, score: number, feedback: string) => void;
  addVideo: (vid: Omit<TeacherVideo, 'id' | 'createdAt'>) => void;
  deleteVideo: (id: string) => void;
  addGame: (game: Omit<TeacherGameOrLink, 'id' | 'createdAt'>) => void;
  deleteGame: (id: string) => void;
  replyMessage: (studentUsername: string, content: string) => void;
  markMessagesAsRead: (studentUsername: string, readerUsername: string) => void;

  // Student actions
  submitHomework: (assignmentId: string, content: string, attachmentUrl?: string) => void;
  recordVideoWatch: (videoId: string, percent: number) => void;
  recordGamePlay: (gameId: string, score?: number) => void;
  sendMessageToTeacher: (content: string) => void;
  addPersonalItem: (item: Omit<StudentPersonalItem, 'id' | 'studentUsername' | 'createdAt'>) => void;
  updatePersonalItem: (id: string, updates: Partial<StudentPersonalItem>) => void;
  deletePersonalItem: (id: string) => void;
  updateStudentProfile: (updates: Partial<User>) => void;

  // Query helpers
  getVideoWatchers: (videoId: string) => { student: User; record: VideoWatchRecord }[];
  getStudentStats: (studentUsername: string) => {
    assignmentsCount: number;
    submittedCount: number;
    gradedAverage: number | null;
    watchedVideosCount: number;
    totalVideosCount: number;
    playedGamesCount: number;
    personalItemsCount: number;
  };
  refreshSupabaseData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CURRENT_USER: 'edu_platform_current_user',
  ACCOUNTS: 'edu_platform_accounts',
  ASSIGNMENTS: 'edu_platform_assignments',
  SUBMISSIONS: 'edu_platform_submissions',
  VIDEOS: 'edu_platform_videos',
  WATCH_RECORDS: 'edu_platform_watch_records',
  GAMES: 'edu_platform_games',
  GAME_PLAYS: 'edu_platform_game_plays',
  MESSAGES: 'edu_platform_messages',
  ACTIVITIES: 'edu_platform_activities',
  STUDENT_ITEMS: 'edu_platform_student_items',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSupabaseOnline, setIsSupabaseOnline] = useState<boolean>(false);

  // Accounts
  const [accounts, setAccounts] = useState<RegisteredAccount[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACCOUNTS);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [
      { user: INITIAL_TEACHER, pass: '123456' },
      ...INITIAL_STUDENTS,
    ];
  });

  // Current user
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_TEACHER;
  });

  // Assignments
  const [assignments, setAssignments] = useState<Assignment[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ASSIGNMENTS);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_ASSIGNMENTS;
  });

  // Submissions
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SUBMISSIONS);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_SUBMISSIONS;
  });

  // Teacher Videos
  const [videos, setVideos] = useState<TeacherVideo[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.VIDEOS);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_VIDEOS;
  });

  // Watch Records
  const [watchRecords, setWatchRecords] = useState<VideoWatchRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WATCH_RECORDS);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_WATCH_RECORDS;
  });

  // Teacher Games
  const [games, setGames] = useState<TeacherGameOrLink[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.GAMES);
      if (saved) {
        const parsed: TeacherGameOrLink[] = JSON.parse(saved);
        const existingIds = new Set(parsed.map(g => g.id));
        const missing = INITIAL_GAMES.filter(g => !existingIds.has(g.id));
        return missing.length > 0 ? [...parsed, ...missing] : parsed;
      }
    } catch {
      // ignore
    }
    return INITIAL_GAMES;
  });

  // Game Plays
  const [gamePlays, setGamePlays] = useState<GamePlayRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.GAME_PLAYS);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_GAME_PLAYS;
  });

  // Messages
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MESSAGES);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_MESSAGES;
  });

  // Activities
  const [activities, setActivities] = useState<StudentActivity[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_ACTIVITIES;
  });

  // Student personal items
  const [studentItems, setStudentItems] = useState<StudentPersonalItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STUDENT_ITEMS);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_STUDENT_ITEMS;
  });

  // Fetch all data from Supabase
  const refreshSupabaseData = useCallback(async () => {
    try {
      // Test connection with users table
      const { data: usersData, error: usersErr } = await supabase.from('users').select('*');

      if (usersErr) {
        // Table may not have been created yet by user
        console.info('Supabase tablosu henüz hazır değil veya erişim bekleniyor:', usersErr.message);
        setIsSupabaseOnline(false);
        return;
      }

      setIsSupabaseOnline(true);

      if (usersData && usersData.length > 0) {
        const mappedAccounts: RegisteredAccount[] = usersData.map((row: any) => ({
          user: {
            username: row.username,
            name: row.name,
            role: row.role as 'teacher' | 'student',
            registeredAt: row.registered_at || new Date().toISOString(),
            avatar: row.avatar,
            themeColor: row.theme_color || 'indigo',
            bio: row.bio,
            quote: row.quote,
          },
          pass: row.password,
        }));
        setAccounts(mappedAccounts);
      }

      // Fetch assignments
      const { data: asgData } = await supabase
        .from('assignments')
        .select('*')
        .order('created_at', { ascending: false });

      if (asgData && asgData.length > 0) {
        setAssignments(
          asgData.map((row: any) => ({
            id: row.id,
            title: row.title,
            description: row.description,
            subject: row.subject,
            dueDate: row.due_date,
            maxScore: row.max_score || 100,
            attachmentUrl: row.attachment_url,
            createdAt: row.created_at,
          }))
        );
      }

      // Fetch submissions
      const { data: subData } = await supabase.from('submissions').select('*');
      if (subData && subData.length > 0) {
        setSubmissions(
          subData.map((row: any) => ({
            id: row.id,
            assignmentId: row.assignment_id,
            studentUsername: row.student_username,
            content: row.content,
            attachmentUrl: row.attachment_url,
            score: row.score,
            feedback: row.feedback,
            status: row.status as 'submitted' | 'graded',
            submittedAt: row.submitted_at,
          }))
        );
      }

      // Fetch teacher videos
      const { data: vidData } = await supabase
        .from('teacher_videos')
        .select('*')
        .order('created_at', { ascending: false });
      if (vidData && vidData.length > 0) {
        setVideos(
          vidData.map((row: any) => ({
            id: row.id,
            title: row.title,
            description: row.description,
            url: row.url,
            subject: row.subject,
            durationMinutes: row.duration_minutes || 10,
            createdAt: row.created_at,
          }))
        );
      }

      // Fetch watch records
      const { data: watchData } = await supabase.from('watch_records').select('*');
      if (watchData && watchData.length > 0) {
        setWatchRecords(
          watchData.map((row: any) => ({
            id: row.id,
            videoId: row.video_id,
            studentUsername: row.student_username,
            watchedPercent: row.watched_percent,
            isCompleted: row.is_completed,
            lastWatchedAt: row.last_watched_at,
          }))
        );
      }

      // Fetch games
      const { data: gamesData } = await supabase
        .from('games')
        .select('*')
        .order('created_at', { ascending: false });
      if (gamesData && gamesData.length > 0) {
        const fetchedGames = gamesData.map((row: any) => ({
          id: row.id,
          title: row.title,
          description: row.description,
          type: row.type,
          url: row.url,
          subject: row.subject,
          badge: row.badge,
          createdAt: row.created_at,
        }));
        const existingIds = new Set(fetchedGames.map((g: any) => g.id));
        const missing = INITIAL_GAMES.filter(g => !existingIds.has(g.id));
        setGames([...fetchedGames, ...missing]);
      }

      // Fetch game plays
      const { data: gpData } = await supabase.from('game_plays').select('*');
      if (gpData && gpData.length > 0) {
        setGamePlays(
          gpData.map((row: any) => ({
            id: row.id,
            gameId: row.game_id,
            studentUsername: row.student_username,
            score: row.score,
            playedAt: row.played_at,
          }))
        );
      }

      // Fetch student personal items
      const { data: piData } = await supabase
        .from('student_personal_items')
        .select('*')
        .order('created_at', { ascending: false });
      if (piData && piData.length > 0) {
        setStudentItems(
          piData.map((row: any) => ({
            id: row.id,
            studentUsername: row.student_username,
            type: row.type,
            title: row.title,
            content: row.content,
            url: row.url,
            category: row.category,
            color: row.color,
            createdAt: row.created_at,
          }))
        );
      }

      // Fetch messages
      const { data: msgData } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: true });
      if (msgData && msgData.length > 0) {
        setMessages(
          msgData.map((row: any) => ({
            id: row.id,
            from: row.from_username,
            to: row.to_username,
            studentUsername: row.student_username,
            content: row.content,
            isRead: row.is_read,
            createdAt: row.created_at,
          }))
        );
      }

      // Fetch activities
      const { data: actData } = await supabase
        .from('student_activities')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(100);
      if (actData && actData.length > 0) {
        setActivities(
          actData.map((row: any) => ({
            id: row.id,
            studentUsername: row.student_username,
            action: row.action,
            detail: row.detail,
            timestamp: row.timestamp,
          }))
        );
      }
    } catch (err) {
      console.warn('Supabase veri senkronizasyonu hatası:', err);
    }
  }, []);

  // Initial load and Realtime sync
  useEffect(() => {
    refreshSupabaseData();

    // Supabase Realtime channel
    const channel = supabase
      .channel('edu-platform-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public' },
        () => {
          // Re-fetch data upon any changes from any client
          refreshSupabaseData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refreshSupabaseData]);

  // Local storage synchronization fallbacks
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify(assignments));
  }, [assignments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(submissions));
  }, [submissions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.VIDEOS, JSON.stringify(videos));
  }, [videos]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WATCH_RECORDS, JSON.stringify(watchRecords));
  }, [watchRecords]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.GAMES, JSON.stringify(games));
  }, [games]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.GAME_PLAYS, JSON.stringify(gamePlays));
  }, [gamePlays]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STUDENT_ITEMS, JSON.stringify(studentItems));
  }, [studentItems]);

  const students = accounts
    .filter(acc => acc.user.role === 'student')
    .map(acc => acc.user);

  const isTeacher = currentUser?.role === 'teacher';
  const isStudent = currentUser?.role === 'student';

  const logActivity = (studentUsername: string, action: StudentActivity['action'], detail: string) => {
    const newAct: StudentActivity = {
      id: 'act-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      studentUsername,
      action,
      detail,
      timestamp: new Date().toISOString(),
    };
    setActivities(prev => [newAct, ...prev]);

    // Async write to Supabase
    supabase.from('student_activities').insert({
      id: newAct.id,
      student_username: studentUsername,
      action,
      detail,
      timestamp: newAct.timestamp,
    }).then(() => {});
  };

  // Auth: Login
  const login = async (username: string, pass: string): Promise<{ success: boolean; message: string }> => {
    const trimmedUsername = username.trim().toLowerCase();

    // Teacher check
    if (trimmedUsername === 'burak') {
      if (pass === '123456') {
        const teacherAcc = accounts.find(a => a.user.username.toLowerCase() === 'burak') || {
          user: INITIAL_TEACHER,
          pass: '123456',
        };
        setCurrentUser(teacherAcc.user);
        return { success: true, message: 'Hoş geldiniz Burak Öğretmenim!' };
      } else {
        return { success: false, message: 'Öğretmen şifresi hatalı! Lütfen tekrar deneyiniz.' };
      }
    }

    // Try finding in local accounts first
    const studentAcc = accounts.find(a => a.user.username.toLowerCase() === trimmedUsername);
    if (studentAcc) {
      if (studentAcc.pass !== pass) {
        return { success: false, message: 'Girdiğiniz şifre hatalı. Lütfen tekrar deneyiniz.' };
      }
      setCurrentUser(studentAcc.user);
      logActivity(studentAcc.user.username, 'login', 'Sisteme giriş yaptı.');
      return { success: true, message: `Hoş geldin, ${studentAcc.user.name}!` };
    }

    // Try querying Supabase directly for real-time registered users
    try {
      const { data: supaUser } = await supabase
        .from('users')
        .select('*')
        .eq('username', trimmedUsername)
        .single();

      if (supaUser) {
        if (supaUser.password !== pass) {
          return { success: false, message: 'Girdiğiniz şifre hatalı. Lütfen tekrar deneyiniz.' };
        }
        const userObj: User = {
          username: supaUser.username,
          name: supaUser.name,
          role: supaUser.role as 'teacher' | 'student',
          registeredAt: supaUser.registered_at,
          avatar: supaUser.avatar,
          themeColor: supaUser.theme_color || 'indigo',
          bio: supaUser.bio,
          quote: supaUser.quote,
        };
        setAccounts(prev => [...prev, { user: userObj, pass: supaUser.password }]);
        setCurrentUser(userObj);
        logActivity(userObj.username, 'login', 'Sisteme giriş yaptı.');
        return { success: true, message: `Hoş geldin, ${userObj.name}!` };
      }
    } catch {
      // ignore
    }

    return {
      success: false,
      message: 'Bu kullanıcı adına ait bir öğrenci bulunamadı. Lütfen önce "Kayıt Ol" sekmesinden kayıt olunuz.',
    };
  };

  // Auth: Student Registration (ONLY username and password requested!)
  const registerStudent = async (username: string, pass: string): Promise<{ success: boolean; message: string }> => {
    const trimmedUsername = username.trim().toLowerCase();

    if (!trimmedUsername || !pass) {
      return { success: false, message: 'Lütfen kullanıcı adı ve şifrenizi giriniz.' };
    }

    if (trimmedUsername === 'burak') {
      return { success: false, message: '"burak" kullanıcı adı öğretmenimize aittir, lütfen farklı bir kullanıcı adı seçiniz.' };
    }

    if (trimmedUsername.length < 3) {
      return { success: false, message: 'Kullanıcı adı en az 3 karakter olmalıdır.' };
    }

    if (pass.length < 4) {
      return { success: false, message: 'Şifre en az 4 karakter olmalıdır.' };
    }

    const exists = accounts.some(a => a.user.username.toLowerCase() === trimmedUsername);
    if (exists) {
      return { success: false, message: 'Bu kullanıcı adı zaten kayıtlı. Lütfen "Giriş Yap" sekmesini kullanın veya başka bir kullanıcı adı seçin.' };
    }

    const displayName = trimmedUsername.charAt(0).toUpperCase() + trimmedUsername.slice(1);
    
    const avatars = [
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    ];
    const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];

    const newStudentUser: User = {
      username: trimmedUsername,
      role: 'student',
      name: displayName,
      registeredAt: new Date().toISOString(),
      avatar: randomAvatar,
      themeColor: 'indigo',
      bio: 'Eğitim platformuna yeni katıldı.',
      quote: 'Öğrenmek bir maceradır!',
    };

    const newAccount: RegisteredAccount = {
      user: newStudentUser,
      pass,
    };

    setAccounts(prev => [...prev, newAccount]);
    setCurrentUser(newStudentUser);
    logActivity(trimmedUsername, 'register', 'Sisteme yeni öğrenci olarak kayıt oldu.');

    // Save to Supabase
    try {
      await supabase.from('users').insert({
        username: trimmedUsername,
        password: pass,
        name: displayName,
        role: 'student',
        avatar: randomAvatar,
        theme_color: 'indigo',
        bio: 'Eğitim platformuna yeni katıldı.',
        quote: 'Öğrenmek bir maceradır!',
        registered_at: newStudentUser.registeredAt,
      });
    } catch (err) {
      console.warn('Supabase kullanıcı kaydı yedeklendi:', err);
    }

    return { success: true, message: `Tebrikler ${displayName}! Kaydınız başarıyla tamamlandı ve giriş yapıldı.` };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const switchUserQuick = (username: string) => {
    const acc = accounts.find(a => a.user.username.toLowerCase() === username.toLowerCase());
    if (acc) {
      setCurrentUser(acc.user);
    }
  };

  // Teacher: Add Assignment
  const addAssignment = (asg: Omit<Assignment, 'id' | 'createdAt'>) => {
    const newAsg: Assignment = {
      ...asg,
      id: 'asg-' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    setAssignments(prev => [newAsg, ...prev]);

    // Supabase
    supabase.from('assignments').insert({
      id: newAsg.id,
      title: newAsg.title,
      description: newAsg.description,
      subject: newAsg.subject,
      due_date: newAsg.dueDate,
      max_score: newAsg.maxScore,
      attachment_url: newAsg.attachmentUrl,
      created_at: newAsg.createdAt,
    }).then(() => {});
  };

  // Teacher: Delete Assignment
  const deleteAssignment = (id: string) => {
    setAssignments(prev => prev.filter(a => a.id !== id));
    setSubmissions(prev => prev.filter(s => s.assignmentId !== id));

    // Supabase
    supabase.from('assignments').delete().eq('id', id).then(() => {});
  };

  // Teacher: Grade Submission
  const gradeSubmission = (submissionId: string, score: number, feedback: string) => {
    setSubmissions(prev =>
      prev.map(s => {
        if (s.id === submissionId) {
          return {
            ...s,
            score,
            feedback,
            status: 'graded',
          };
        }
        return s;
      })
    );

    // Supabase
    supabase.from('submissions').update({
      score,
      feedback,
      status: 'graded',
    }).eq('id', submissionId).then(() => {});
  };

  // Teacher: Add Video
  const addVideo = (vid: Omit<TeacherVideo, 'id' | 'createdAt'>) => {
    const newVid: TeacherVideo = {
      ...vid,
      id: 'vid-' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    setVideos(prev => [newVid, ...prev]);

    // Supabase
    supabase.from('teacher_videos').insert({
      id: newVid.id,
      title: newVid.title,
      description: newVid.description,
      url: newVid.url,
      subject: newVid.subject,
      duration_minutes: newVid.durationMinutes,
      created_at: newVid.createdAt,
    }).then(() => {});
  };

  // Teacher: Delete Video
  const deleteVideo = (id: string) => {
    setVideos(prev => prev.filter(v => v.id !== id));
    setWatchRecords(prev => prev.filter(r => r.videoId !== id));

    // Supabase
    supabase.from('teacher_videos').delete().eq('id', id).then(() => {});
  };

  // Teacher: Add Game
  const addGame = (game: Omit<TeacherGameOrLink, 'id' | 'createdAt'>) => {
    const newGame: TeacherGameOrLink = {
      ...game,
      id: 'game-' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    setGames(prev => [newGame, ...prev]);

    // Supabase
    supabase.from('games').insert({
      id: newGame.id,
      title: newGame.title,
      description: newGame.description,
      type: newGame.type,
      url: newGame.url,
      subject: newGame.subject,
      badge: newGame.badge,
      created_at: newGame.createdAt,
    }).then(() => {});
  };

  // Teacher: Delete Game
  const deleteGame = (id: string) => {
    setGames(prev => prev.filter(g => g.id !== id));
    setGamePlays(prev => prev.filter(gp => gp.gameId !== id));

    // Supabase
    supabase.from('games').delete().eq('id', id).then(() => {});
  };

  // Teacher: Reply Message
  const replyMessage = (studentUsername: string, content: string) => {
    const newMsg: Message = {
      id: 'msg-' + Date.now(),
      from: 'burak',
      to: studentUsername,
      studentUsername,
      content,
      createdAt: new Date().toISOString(),
      isRead: false,
    };
    setMessages(prev => [...prev, newMsg]);

    // Supabase
    supabase.from('messages').insert({
      id: newMsg.id,
      from_username: 'burak',
      to_username: studentUsername,
      student_username: studentUsername,
      content,
      is_read: false,
      created_at: newMsg.createdAt,
    }).then(() => {});
  };

  // Mark Messages as Read (both local and Supabase)
  const markMessagesAsRead = (studentUsername: string, readerUsername: string) => {
    setMessages(prev =>
      prev.map(m => {
        if (m.studentUsername === studentUsername && m.to === readerUsername && !m.isRead) {
          return { ...m, isRead: true };
        }
        return m;
      })
    );

    // Supabase
    supabase
      .from('messages')
      .update({ is_read: true })
      .eq('student_username', studentUsername)
      .eq('to_username', readerUsername)
      .eq('is_read', false)
      .then(() => {});
  };

  // Student: Submit Homework
  const submitHomework = (assignmentId: string, content: string, attachmentUrl?: string) => {
    if (!currentUser) return;
    const existing = submissions.find(
      s => s.assignmentId === assignmentId && s.studentUsername === currentUser.username
    );

    const asg = assignments.find(a => a.id === assignmentId);
    const asgTitle = asg ? asg.title : 'Ödev';

    if (existing) {
      setSubmissions(prev =>
        prev.map(s => {
          if (s.id === existing.id) {
            return {
              ...s,
              content,
              attachmentUrl,
              submittedAt: new Date().toISOString(),
              status: 'submitted',
            };
          }
          return s;
        })
      );
      logActivity(currentUser.username, 'submit_assignment', `"${asgTitle}" ödevini güncelledi ve teslim etti.`);

      // Supabase
      supabase.from('submissions').update({
        content,
        attachment_url: attachmentUrl,
        submitted_at: new Date().toISOString(),
        status: 'submitted',
      }).eq('id', existing.id).then(() => {});
    } else {
      const newSub: AssignmentSubmission = {
        id: 'sub-' + Date.now(),
        assignmentId,
        studentUsername: currentUser.username,
        submittedAt: new Date().toISOString(),
        content,
        attachmentUrl,
        status: 'submitted',
      };
      setSubmissions(prev => [...prev, newSub]);
      logActivity(currentUser.username, 'submit_assignment', `"${asgTitle}" ödevini teslim etti.`);

      // Supabase
      supabase.from('submissions').insert({
        id: newSub.id,
        assignment_id: assignmentId,
        student_username: currentUser.username,
        content,
        attachment_url: attachmentUrl,
        status: 'submitted',
        submitted_at: newSub.submittedAt,
      }).then(() => {});
    }
  };

  // Student: Record Video Watch
  const recordVideoWatch = (videoId: string, percent: number) => {
    if (!currentUser || currentUser.role !== 'student') return;

    const existing = watchRecords.find(
      r => r.videoId === videoId && r.studentUsername === currentUser.username
    );

    const vid = videos.find(v => v.id === videoId);
    const vidTitle = vid ? vid.title : 'Video';
    const isCompleted = percent >= 95;

    if (existing) {
      const highestPercent = Math.max(existing.watchedPercent, percent);
      const updatedRecord = {
        ...existing,
        watchedPercent: highestPercent,
        isCompleted: highestPercent >= 95 || existing.isCompleted,
        lastWatchedAt: new Date().toISOString(),
      };
      setWatchRecords(prev =>
        prev.map(r => (r.id === existing.id ? updatedRecord : r))
      );
      if (isCompleted && !existing.isCompleted) {
        logActivity(currentUser.username, 'watch_video', `"${vidTitle}" videosunu tamamladı (%100).`);
      }

      // Supabase
      supabase.from('watch_records').update({
        watched_percent: highestPercent,
        is_completed: updatedRecord.isCompleted,
        last_watched_at: updatedRecord.lastWatchedAt,
      }).eq('id', existing.id).then(() => {});
    } else {
      const newRec: VideoWatchRecord = {
        id: 'rec-' + Date.now(),
        videoId,
        studentUsername: currentUser.username,
        watchedPercent: percent,
        isCompleted,
        lastWatchedAt: new Date().toISOString(),
      };
      setWatchRecords(prev => [...prev, newRec]);
      logActivity(
        currentUser.username,
        'watch_video',
        `"${vidTitle}" videosunu izlemeye başladı (%${percent}).`
      );

      // Supabase
      supabase.from('watch_records').insert({
        id: newRec.id,
        video_id: videoId,
        student_username: currentUser.username,
        watched_percent: percent,
        is_completed: isCompleted,
        last_watched_at: newRec.lastWatchedAt,
      }).then(() => {});
    }
  };

  // Student: Record Game Play
  const recordGamePlay = (gameId: string, score?: number) => {
    if (!currentUser || currentUser.role !== 'student') return;
    const gm = games.find(g => g.id === gameId);
    const title = gm ? gm.title : 'Eğitici Oyun';

    const newGp: GamePlayRecord = {
      id: 'gp-' + Date.now(),
      gameId,
      studentUsername: currentUser.username,
      score,
      playedAt: new Date().toISOString(),
    };
    setGamePlays(prev => [...prev, newGp]);
    logActivity(
      currentUser.username,
      'play_game',
      `"${title}" oyununu oynadı ${score !== undefined ? `(Skor: ${score})` : ''}.`
    );

    // Supabase
    supabase.from('game_plays').insert({
      id: newGp.id,
      game_id: gameId,
      student_username: currentUser.username,
      score: score || 0,
      played_at: newGp.playedAt,
    }).then(() => {});
  };

  // Student: Send Message to Teacher Burak
  const sendMessageToTeacher = (content: string) => {
    if (!currentUser || currentUser.role !== 'student') return;
    const newMsg: Message = {
      id: 'msg-' + Date.now(),
      from: currentUser.username,
      to: 'burak',
      studentUsername: currentUser.username,
      content,
      createdAt: new Date().toISOString(),
      isRead: false,
    };
    setMessages(prev => [...prev, newMsg]);
    logActivity(currentUser.username, 'send_message', 'Öğretmene soru / mesaj iletti.');

    // Supabase
    supabase.from('messages').insert({
      id: newMsg.id,
      from_username: currentUser.username,
      to_username: 'burak',
      student_username: currentUser.username,
      content,
      is_read: false,
      created_at: newMsg.createdAt,
    }).then(() => {});
  };

  // Student: Personal Workspace Items
  const addPersonalItem = (item: Omit<StudentPersonalItem, 'id' | 'studentUsername' | 'createdAt'>) => {
    if (!currentUser || currentUser.role !== 'student') return;
    const newItem: StudentPersonalItem = {
      ...item,
      id: 'pi-' + Date.now(),
      studentUsername: currentUser.username,
      createdAt: new Date().toISOString(),
    };
    setStudentItems(prev => [newItem, ...prev]);
    logActivity(
      currentUser.username,
      'add_personal_item',
      `Kendi alanına yeni ${item.type === 'note' ? 'not' : item.type === 'video' ? 'video' : 'bağlantı'} ekledi.`
    );

    // Supabase
    supabase.from('student_personal_items').insert({
      id: newItem.id,
      student_username: currentUser.username,
      type: newItem.type,
      title: newItem.title,
      content: newItem.content,
      url: newItem.url,
      category: newItem.category,
      color: newItem.color,
      created_at: newItem.createdAt,
    }).then(() => {});
  };

  const updatePersonalItem = (id: string, updates: Partial<StudentPersonalItem>) => {
    setStudentItems(prev =>
      prev.map(it => {
        if (it.id === id) {
          return { ...it, ...updates };
        }
        return it;
      })
    );

    // Supabase
    supabase.from('student_personal_items').update({
      title: updates.title,
      content: updates.content,
      url: updates.url,
      category: updates.category,
      color: updates.color,
    }).eq('id', id).then(() => {});
  };

  const deletePersonalItem = (id: string) => {
    setStudentItems(prev => prev.filter(it => it.id !== id));

    // Supabase
    supabase.from('student_personal_items').delete().eq('id', id).then(() => {});
  };

  const updateStudentProfile = (updates: Partial<User>) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, ...updates };
    setCurrentUser(updatedUser);
    setAccounts(prev =>
      prev.map(acc => {
        if (acc.user.username === currentUser.username) {
          return { ...acc, user: updatedUser };
        }
        return acc;
      })
    );

    // Supabase
    supabase.from('users').update({
      bio: updates.bio,
      quote: updates.quote,
      theme_color: updates.themeColor,
      avatar: updates.avatar,
      name: updates.name,
    }).eq('username', currentUser.username).then(() => {});
  };

  const getVideoWatchers = (videoId: string) => {
    return watchRecords
      .filter(r => r.videoId === videoId)
      .map(record => {
        const student = students.find(s => s.username === record.studentUsername) || {
          username: record.studentUsername,
          name: record.studentUsername,
          role: 'student' as const,
          registeredAt: new Date().toISOString(),
        };
        return { student, record };
      });
  };

  const getStudentStats = (studentUsername: string) => {
    const studentSubmissions = submissions.filter(s => s.studentUsername === studentUsername);
    const gradedSubmissions = studentSubmissions.filter(s => s.status === 'graded' && s.score !== undefined);
    const gradedAverage =
      gradedSubmissions.length > 0
        ? Math.round(gradedSubmissions.reduce((acc, curr) => acc + (curr.score || 0), 0) / gradedSubmissions.length)
        : null;

    const studentWatchRecords = watchRecords.filter(r => r.studentUsername === studentUsername);
    const watchedVideosCount = studentWatchRecords.filter(r => r.isCompleted || r.watchedPercent >= 90).length;
    const studentPlays = gamePlays.filter(p => p.studentUsername === studentUsername);
    const studentMyItems = studentItems.filter(i => i.studentUsername === studentUsername);

    return {
      assignmentsCount: assignments.length,
      submittedCount: studentSubmissions.length,
      gradedAverage,
      watchedVideosCount,
      totalVideosCount: videos.length,
      playedGamesCount: studentPlays.length,
      personalItemsCount: studentMyItems.length,
    };
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        isTeacher,
        isStudent,
        students,
        assignments,
        submissions,
        videos,
        watchRecords,
        games,
        gamePlays,
        messages,
        activities,
        studentItems,
        isSupabaseOnline,
        login,
        registerStudent,
        logout,
        switchUserQuick,
        addAssignment,
        deleteAssignment,
        gradeSubmission,
        addVideo,
        deleteVideo,
        addGame,
        deleteGame,
        replyMessage,
        markMessagesAsRead,
        submitHomework,
        recordVideoWatch,
        recordGamePlay,
        sendMessageToTeacher,
        addPersonalItem,
        updatePersonalItem,
        deletePersonalItem,
        updateStudentProfile,
        getVideoWatchers,
        getStudentStats,
        refreshSupabaseData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
