import React, { useState } from 'react';
import {
  Sparkles,
  Plus,
  StickyNote,
  Video,
  Link2,
  Trash2,
  Edit2,
  ExternalLink,
  Play,
  Palette,
  Check,
  X,
  FileText,
  Quote
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StudentPersonalItem } from '../../types';
import { VideoPlayerModal } from '../VideoPlayerModal';

const THEME_COLORS = [
  { id: 'indigo', name: 'İndigo Mavi', class: 'bg-indigo-600', ring: 'ring-indigo-500', text: 'text-indigo-600' },
  { id: 'emerald', name: 'Zümrüt Yeşil', class: 'bg-emerald-600', ring: 'ring-emerald-500', text: 'text-emerald-600' },
  { id: 'rose', name: 'Gül Kurusu', class: 'bg-rose-600', ring: 'ring-rose-500', text: 'text-rose-600' },
  { id: 'amber', name: 'Sıcak Amber', class: 'bg-amber-600', ring: 'ring-amber-500', text: 'text-amber-600' },
  { id: 'sky', name: 'Gökyüzü Mavisi', class: 'bg-sky-600', ring: 'ring-sky-500', text: 'text-sky-600' },
  { id: 'purple', name: 'Asil Mor', class: 'bg-purple-600', ring: 'ring-purple-500', text: 'text-purple-600' },
];

export const StudentPersonalSpace: React.FC = () => {
  const {
    currentUser,
    studentItems,
    addPersonalItem,
    updatePersonalItem,
    deletePersonalItem,
    updateStudentProfile,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'notes' | 'videos' | 'links' | 'customize'>('notes');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<StudentPersonalItem | null>(null);
  const [previewVideo, setPreviewVideo] = useState<{ title: string; url: string; subject: string; durationMinutes: number } | null>(null);

  // Form states
  const [itemType, setItemType] = useState<'note' | 'video' | 'link'>('note');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState('Ders Notu');

  // Customization profile states
  const [bioText, setBioText] = useState(currentUser?.bio || '');
  const [quoteText, setQuoteText] = useState(currentUser?.quote || '');
  const [selectedColor, setSelectedColor] = useState(currentUser?.themeColor || 'indigo');
  const [profileSavedMsg, setProfileSavedMsg] = useState(false);

  if (!currentUser) return null;

  // Filter items belonging to this student only (strict privacy)
  const myItems = studentItems.filter(i => i.studentUsername === currentUser.username);
  const myNotes = myItems.filter(i => i.type === 'note');
  const myVideos = myItems.filter(i => i.type === 'video');
  const myLinks = myItems.filter(i => i.type === 'link');

  const handleOpenAdd = (type: 'note' | 'video' | 'link') => {
    setItemType(type);
    setTitle('');
    setContent('');
    setUrl('');
    setCategory(type === 'note' ? 'Ders Notu' : type === 'video' ? 'Çalışma Videosu' : 'Kaynak Bağlantı');
    setEditingItem(null);
    setShowAddModal(true);
  };

  const handleOpenEdit = (item: StudentPersonalItem) => {
    setEditingItem(item);
    setItemType(item.type);
    setTitle(item.title);
    setContent(item.content);
    setUrl(item.url || '');
    setCategory(item.category || 'Genel');
    setShowAddModal(true);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingItem) {
      updatePersonalItem(editingItem.id, {
        title: title.trim(),
        content: content.trim(),
        url: url.trim() || undefined,
        category,
      });
    } else {
      addPersonalItem({
        type: itemType,
        title: title.trim(),
        content: content.trim(),
        url: url.trim() || undefined,
        category,
      });
    }

    setShowAddModal(false);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateStudentProfile({
      bio: bioText.trim(),
      quote: quoteText.trim(),
      themeColor: selectedColor,
    });
    setProfileSavedMsg(true);
    setTimeout(() => setProfileSavedMsg(false), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner with Personalization preview */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
            alt={currentUser.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-100 shadow-sm"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">{currentUser.name} - Kişisel Alanım</h2>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                @{currentUser.username}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {currentUser.bio || 'Burada kendi notlarını, çalışma videolarını ve linklerini dilediğin gibi düzenleyebilirsin.'}
            </p>
            {currentUser.quote && (
              <p className="text-[11px] text-slate-400 italic mt-0.5 flex items-center gap-1">
                <Quote className="w-3 h-3 text-indigo-400" />
                "{currentUser.quote}"
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('customize')}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition flex items-center gap-1.5 cursor-pointer"
          >
            <Palette className="w-3.5 h-3.5 text-indigo-600" />
            Temayı & Profili Özelleştir
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('notes')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'notes' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <StickyNote className="w-3.5 h-3.5" />
            Notlarım ({myNotes.length})
          </button>
          <button
            onClick={() => setActiveTab('videos')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'videos' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            Videolarım ({myVideos.length})
          </button>
          <button
            onClick={() => setActiveTab('links')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'links' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Link2 className="w-3.5 h-3.5" />
            Bağlantılarım ({myLinks.length})
          </button>
          <button
            onClick={() => setActiveTab('customize')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'customize' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            Görünüm Ayarları
          </button>
        </div>

        {activeTab !== 'customize' && (
          <button
            onClick={() => handleOpenAdd(activeTab === 'notes' ? 'note' : activeTab === 'videos' ? 'video' : 'link')}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            Yeni {activeTab === 'notes' ? 'Not' : activeTab === 'videos' ? 'Video' : 'Bağlantı'} Ekle
          </button>
        )}
      </div>

      {/* Tab Content: Notes */}
      {activeTab === 'notes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {myNotes.length === 0 ? (
            <div className="col-span-full text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300 p-8">
              <StickyNote className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-slate-700">Henüz hiç not eklemedin</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Ders çalışırken aklında tutmak istediğin formülleri, özetleri ve ipuçlarını buraya kaydedebilirsin.
              </p>
              <button
                onClick={() => handleOpenAdd('note')}
                className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl cursor-pointer"
              >
                İlk Notunu Yaz
              </button>
            </div>
          ) : (
            myNotes.map(note => (
              <div
                key={note.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-indigo-200 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-amber-50 text-amber-800 rounded-md border border-amber-200">
                      {note.category || 'Not'}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEdit(note)}
                        className="p-1 text-slate-400 hover:text-indigo-600 rounded-md"
                        title="Düzenle"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deletePersonalItem(note.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded-md"
                        title="Sil"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 mb-2">{note.title}</h3>
                  <p className="text-xs text-slate-600 whitespace-pre-line leading-relaxed mb-4">
                    {note.content}
                  </p>
                </div>

                <div className="text-[10px] text-slate-400 border-t border-slate-100 pt-2 flex justify-between">
                  <span>Oluşturulma:</span>
                  <span>{new Date(note.createdAt).toLocaleDateString('tr-TR')}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab Content: Personal Videos */}
      {activeTab === 'videos' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {myVideos.length === 0 ? (
            <div className="col-span-full text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300 p-8">
              <Video className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-slate-700">Henüz çalışma videosu eklemedin</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                YouTube'dan faydalı bulduğun ders ve deney videolarını buraya ekleyip doğrudan izleyebilirsin.
              </p>
              <button
                onClick={() => handleOpenAdd('video')}
                className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl cursor-pointer"
              >
                Video Ekle
              </button>
            </div>
          ) : (
            myVideos.map(vid => (
              <div
                key={vid.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-indigo-200 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-indigo-50 text-indigo-800 rounded-md border border-indigo-200">
                      {vid.category || 'Video'}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEdit(vid)}
                        className="p-1 text-slate-400 hover:text-indigo-600 rounded-md"
                        title="Düzenle"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deletePersonalItem(vid.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded-md"
                        title="Sil"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 mb-1">{vid.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mb-4">
                    {vid.content || 'Kendi çalışma videom.'}
                  </p>
                </div>

                <div className="space-y-2">
                  {vid.url && (
                    <button
                      onClick={() =>
                        setPreviewVideo({
                          title: vid.title,
                          url: vid.url!,
                          subject: vid.category || 'Öğrenci Videosu',
                          durationMinutes: 10,
                        })
                      }
                      className="w-full py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5" />
                      Videoyu İzle
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab Content: Personal Links */}
      {activeTab === 'links' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {myLinks.length === 0 ? (
            <div className="col-span-full text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300 p-8">
              <Link2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-slate-700">Henüz bağlantı eklemedin</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Ders çalıştığın faydalı web sitelerini ve doküman linklerini buraya kaydedebilirsin.
              </p>
              <button
                onClick={() => handleOpenAdd('link')}
                className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl cursor-pointer"
              >
                Bağlantı Ekle
              </button>
            </div>
          ) : (
            myLinks.map(lnk => (
              <div
                key={lnk.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-indigo-200 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-sky-50 text-sky-800 rounded-md border border-sky-200">
                      {lnk.category || 'Bağlantı'}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEdit(lnk)}
                        className="p-1 text-slate-400 hover:text-indigo-600 rounded-md"
                        title="Düzenle"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deletePersonalItem(lnk.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded-md"
                        title="Sil"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 mb-1">{lnk.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mb-4">
                    {lnk.content || 'Faydalı kaynak web sitesi.'}
                  </p>
                </div>

                <div>
                  <a
                    href={lnk.url}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition flex items-center justify-center gap-1.5"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-indigo-600" />
                    Web Sitesine Git
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab Content: Appearance / Profile Customization */}
      {activeTab === 'customize' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs max-w-2xl mx-auto">
          <div className="mb-6 pb-4 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Palette className="w-4 h-4 text-indigo-600" />
              Öğrenci Profilini ve Arayüzünü Özelleştir
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Kendi çalışma alanının rengini, kendini tanıtan metnini ve motivasyon cümleni belirle.
            </p>
          </div>

          {profileSavedMsg && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2 font-semibold">
              <Check className="w-4 h-4 text-emerald-600" />
              Profil tercihleriniz başarıyla güncellendi!
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-5">
            {/* Theme color choices */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Arayüz Vurgu Rengi
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {THEME_COLORS.map(tc => (
                  <button
                    key={tc.id}
                    type="button"
                    onClick={() => setSelectedColor(tc.id)}
                    className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition cursor-pointer ${
                      selectedColor === tc.id
                        ? 'border-slate-800 bg-slate-50 ring-2 ring-slate-800 font-bold'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full ${tc.class}`} />
                    <span className="text-[10px] text-slate-700">{tc.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Kısa Hakkımda / İlgi Alanlarım
              </label>
              <input
                type="text"
                value={bioText}
                onChange={e => setBioText(e.target.value)}
                placeholder="Örn: Fen bilimleri ve uzay meraklısı bir öğrenci."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Motivasyon Cümlen (Öğrenci Sloganın)
              </label>
              <input
                type="text"
                value={quoteText}
                onChange={e => setQuoteText(e.target.value)}
                placeholder="Örn: Her gün yeni bir bilgi öğren!"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />
            </div>

            <div className="pt-3 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition cursor-pointer shadow-sm"
              >
                Ayarları Kaydet
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add / Edit Personal Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-200">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                {itemType === 'note' && <StickyNote className="w-4 h-4 text-amber-500" />}
                {itemType === 'video' && <Video className="w-4 h-4 text-indigo-600" />}
                {itemType === 'link' && <Link2 className="w-4 h-4 text-sky-600" />}
                {editingItem ? 'İçeriği Düzenle' : `Kendi Alanına Yeni ${itemType === 'note' ? 'Not' : itemType === 'video' ? 'Video' : 'Bağlantı'} Ekle`}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Başlık
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder={
                    itemType === 'note'
                      ? 'Örn: Fotosentez Denklemi Notum'
                      : itemType === 'video'
                      ? 'Örn: Atom Modelleri Açıklama Videosu'
                      : 'Örn: NASA Solar System Sayfası'
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>

              {(itemType === 'video' || itemType === 'link') && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {itemType === 'video' ? 'Video Bağlantısı (YouTube veya MP4)' : 'Web Sitesi URL Adresi'}
                  </label>
                  <input
                    type="url"
                    required
                    value={url}
                    onChange={e => setUrl(e.target.value)}
                    placeholder={itemType === 'video' ? 'https://www.youtube.com/watch?v=...' : 'https://...'}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kategori / Etiket
                </label>
                <input
                  type="text"
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  placeholder="Örn: Matematik, Fen, Türkçe, Genel"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {itemType === 'note' ? 'Not İçeriği' : 'Açıklama / Kendine Notlar'}
                </label>
                <textarea
                  rows={4}
                  required={itemType === 'note'}
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  placeholder="Buraya istediğin içeriği detaylıca yazabilirsin..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-medium cursor-pointer"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-sm"
                >
                  {editingItem ? 'Güncelle' : 'Kaydet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Video Preview Modal for student personal videos */}
      {previewVideo && (
        <VideoPlayerModal
          video={{
            id: 'personal-preview',
            title: previewVideo.title,
            url: previewVideo.url,
            subject: previewVideo.subject,
            durationMinutes: previewVideo.durationMinutes,
            description: 'Öğrencinin kendi eklediği çalışma videosu.',
            createdAt: new Date().toISOString(),
          }}
          onClose={() => setPreviewVideo(null)}
          isStudentMode={false}
        />
      )}

    </div>
  );
};
