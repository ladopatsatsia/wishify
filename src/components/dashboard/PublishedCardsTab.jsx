import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import ScheduleManagementModal from '../profile/ScheduleManagementModal';
import DeleteConfirmModal from '../profile/DeleteConfirmModal';
import { getScheduleFromCard } from '../profile/scheduleUtils';
import { CARDS_URL } from '../../api/config';

function normalizeCard(card) {
  return {
    ...card,
    id: card.id ?? card.Id,
    creatorId: card.creatorId ?? card.CreatorId,
    templateId: card.templateId ?? card.TemplateId,
    heading: card.heading ?? card.Heading,
    message1: card.message1 ?? card.Message1,
    message2: card.message2 ?? card.Message2,
    footer: card.footer ?? card.Footer,
    isPublic: card.isPublic ?? card.IsPublic ?? false,
    isAutoSend: card.isAutoSend ?? card.IsAutoSend ?? false,
    autoSendRecipient: card.autoSendRecipient ?? card.AutoSendRecipient ?? '',
    scheduledDate: card.scheduledDate ?? card.ScheduledDate ?? '',
    scheduledTime: card.scheduledTime ?? card.ScheduledTime ?? '',
    sendMethod: card.sendMethod ?? card.SendMethod ?? 'email',
    isSent: card.isSent ?? card.IsSent ?? false,
    urlSlug: card.urlSlug ?? card.UrlSlug ?? '',
    customBgGradient: card.customBgGradient ?? card.CustomBgGradient,
    customEmoji: card.customEmoji ?? card.CustomEmoji,
    imagesJson: card.imagesJson ?? card.ImagesJson,
  };
}

export default function PublishedCardsTab() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [scheduleModal, setScheduleModal] = useState({ open: false, card: null });
  const [deleteModal, setDeleteModal] = useState({ open: false, cardId: null });

  const fetchCards = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);
    try {
      const response = await fetch(`${CARDS_URL}/user`, {
        headers: { Authorization: `Bearer ${user.token}` },
        signal: controller.signal,
      });
      clearTimeout(timeout);
      if (response.status === 401) { logout(); navigate('/login'); return; }
      if (!response.ok) throw new Error('Failed to fetch cards');
      const data = await response.json();
      setCards(data.map(normalizeCard));
    } catch (err) {
      clearTimeout(timeout);
      if (err.name !== 'AbortError') {
        console.error('Error fetching cards:', err);
        setError(language === 'ka' ? 'ბარათები ვერ ჩაიტვირთა. შეამოწმეთ კავშირი.' : 'Could not load cards. Check connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleTogglePublish = async (cardId) => {
    try {
      const response = await fetch(`${CARDS_URL}/${cardId}/toggle-public`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${user.token}` }
      });
      if (!response.ok) throw new Error('Failed to toggle visibility');
      setCards(prev => prev.map(c => c.id === cardId ? { ...c, isPublic: !c.isPublic } : c));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = (cardId) => {
    setDeleteModal({ open: true, cardId });
  };

  const confirmDelete = async () => {
    const cardId = deleteModal.cardId;
    if (!cardId) return;

    try {
      const response = await fetch(`${CARDS_URL}/${cardId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${user.token}` }
      });
      if (!response.ok) throw new Error('Failed to delete card');
      setCards(prev => prev.filter(c => c.id !== cardId));
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteModal({ open: false, cardId: null });
    }
  };

  const handleScheduleUpdate = (updatedCard) => {
    setCards(prev => prev.map(c => c.id === updatedCard.id ? { ...c, ...normalizeCard(updatedCard) } : c));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-8 h-8 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white/80 backdrop-blur rounded-3xl p-14 text-center border border-red-100/80 shadow-sm">
        <div className="text-6xl mb-4">⚠️</div>
        <h3 className="text-xl font-bold text-slate-700 mb-3">{error}</h3>
        <button
          onClick={fetchCards}
          className="bg-gradient-to-r from-violet-600 to-pink-600 text-white font-bold py-3 px-10 rounded-xl hover:opacity-90 transition shadow-lg shadow-violet-200 cursor-pointer"
        >
          {language === 'ka' ? '🔄 ხელახლა ცდა' : '🔄 Retry'}
        </button>
      </div>
    );
  }

  const publishedCards = cards.filter(c => c.urlSlug);

  if (publishedCards.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur rounded-3xl p-14 text-center border border-slate-100/80 shadow-sm">
        <div className="text-7xl mb-5">🌐</div>
        <h3 className="text-2xl font-bold text-slate-700 mb-3">
          {language === 'ka' ? 'გამოქვეყნებული ბარათები არ არის' : language === 'ru' ? 'Нет опубликованных открыток' : 'No published cards'}
        </h3>
        <p className="text-slate-400 mb-8 max-w-md mx-auto text-base">
          {language === 'ka' ? 'ჯერ არ გაქვთ გამოქვეყნებული ბარათები. გამოაქვეყნეთ შენახული ბარათებიდან!' :
           language === 'ru' ? 'Вы еще не опубликовали ни одной открытки.' :
           "You haven't made any cards public yet. Publish a card from your Saved tab!"}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {publishedCards.map(card => {
          const bgGradient = card.customBgGradient || 'from-slate-100 to-slate-200';
          const emoji = card.customEmoji || '✨';
          const schedule = getScheduleFromCard(card);
          return (
            <div
              key={card.id}
              className={`relative h-80 rounded-[2.5rem] overflow-hidden shadow-xl shadow-purple-100/30 border border-white/50 transition-all duration-500 bg-gradient-to-br ${bgGradient} hover:scale-[1.02] hover:shadow-2xl`}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/5 rounded-full -ml-12 -mb-12 blur-xl" />

              <div className="absolute top-5 left-5 z-20 flex flex-col gap-1.5">
                <div className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider shadow border border-white/20 w-fit ${
                  card.isPublic ? 'bg-emerald-500 text-white' : 'bg-slate-500 text-white'
                }`}>
                  <span className="mr-1">{card.isPublic ? '🌐' : '🔒'}</span>
                  {card.isPublic
                    ? (language === 'ka' ? 'აქტიური' : language === 'ru' ? 'Активный' : 'Active')
                    : (language === 'ka' ? 'გამორთული' : language === 'ru' ? 'Отключено' : 'Disabled')}
                </div>
                <div className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider shadow border border-white/20 w-fit flex items-center gap-1 ${
                  card.isSent ? 'bg-blue-600 text-white' : schedule.isAutoSend ? 'bg-violet-600 text-white' : 'bg-slate-200 text-slate-600'
                }`}>
                  <span>{card.isSent ? '✅' : schedule.isAutoSend ? '⏰' : '⚪'}</span>
                  {card.isSent
                    ? (language === 'ka' ? 'გაგზავნილი' : language === 'ru' ? 'Отправлено' : 'Sent')
                    : schedule.isAutoSend
                    ? (language === 'ka' ? 'დაგეგმილი' : language === 'ru' ? 'Запланировано' : 'Scheduled')
                    : (language === 'ka' ? 'დაუგეგმავი' : language === 'ru' ? 'Не запланировано' : 'Not Scheduled')}
                </div>
              </div>

              <div className="flex flex-col h-full p-8 text-center relative z-10">
                <div className="text-6xl mb-4">{emoji}</div>
                <h3 className="text-xl font-black mb-2 text-slate-800 line-clamp-1">{card.heading}</h3>
                <p className="text-slate-600 text-sm font-medium line-clamp-2 px-2">{card.message1}</p>

                <div className="mt-auto grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setScheduleModal({ open: true, card })}
                    className={`w-full text-sm font-bold py-2.5 rounded-xl shadow-sm transition-all flex justify-center cursor-pointer items-center gap-2 ${
                      schedule.isAutoSend && !card.isSent ? 'bg-white text-violet-600 border border-violet-100' : 'bg-slate-900 text-white hover:bg-slate-800'
                    }`}
                  >
                    {schedule.isAutoSend ? '⚙️' : '🔔'}
                    {schedule.isAutoSend && !card.isSent
                      ? (language === 'ka' ? 'მართვა' : language === 'ru' ? 'Управление' : 'Manage Send')
                      : (language === 'ka' ? 'დაგეგმვა' : language === 'ru' ? 'Запланировать' : 'Setup Send')}
                  </button>
                  <button
                    onClick={() => handleDelete(card.id)}
                    className="w-full bg-red-50 text-red-600 text-sm font-bold py-2.5 rounded-xl shadow-sm hover:bg-red-100 transition-all flex justify-center cursor-pointer items-center gap-2"
                  >
                    🗑️ {language === 'ka' ? 'წაშლა' : language === 'ru' ? 'Удаლის' : 'Remove'}
                  </button>
                </div>

                <div className="mt-2 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      if (card.urlSlug) {
                        const url = `http://${card.urlSlug}.localhost:5173`;
                        window.open(url, '_blank');
                      } else {
                        let category = 'birthday';
                        if (card.templateId?.startsWith('i') || card.templateId?.startsWith('inv')) category = 'invitation';
                        else if (card.templateId?.startsWith('m')) category = 'memory';
                        else if (card.templateId?.startsWith('l')) category = 'love';
                        else if (card.imagesJson && (typeof card.imagesJson === 'string' ? card.imagesJson.includes('memory') : card.imagesJson.type === 'memory')) category = 'memory';
                        
                        if (category === 'birthday') {
                          navigate(`/birthday-card/${card.id}`);
                        } else {
                          navigate(`/view/${category}/${card.id}`);
                        }
                      }
                    }}
                    className="w-full bg-slate-800 text-white text-[10px] font-black uppercase py-2.5 rounded-xl hover:bg-slate-900 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    👀 {language === 'ka' ? 'ნახვა' : 'View'}
                  </button>
                  <div className="w-full bg-slate-100 text-slate-400 text-[10px] font-black uppercase py-2.5 rounded-xl flex items-center justify-center gap-2 border border-slate-200 shadow-inner">
                    🔒 {language === 'ka' ? 'დაბლოკილია' : 'Locked'}
                  </div>
                </div>

                <div className="mt-2 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      const url = `http://${card.urlSlug}.localhost:5173`;
                      navigator.clipboard.writeText(url);
                      setCopiedId(card.id);
                      setTimeout(() => setCopiedId(null), 2000);
                    }}
                    className="w-full bg-white/90 backdrop-blur text-slate-800 text-[10px] font-black uppercase py-1.5 rounded-lg shadow-sm hover:shadow-md transition-all flex justify-center cursor-pointer items-center gap-1.5"
                  >
                    {copiedId === card.id
                      ? (language === 'ka' ? '✅' : '✅')
                      : (language === 'ka' ? '🔗' : '🔗')}
                    {copiedId === card.id
                      ? (language === 'ka' ? 'დაკოპირდა' : 'Copied')
                      : (language === 'ka' ? 'კოპირება' : 'Copy')}
                  </button>
                  <button
                    onClick={() => handleTogglePublish(card.id)}
                    className={`w-full text-xs font-bold py-2 rounded-xl shadow-sm transition-all flex justify-center cursor-pointer items-center gap-1.5 ${
                      card.isPublic ? 'bg-amber-100 text-amber-600 hover:bg-amber-200' : 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200'
                    }`}
                  >
                    {card.isPublic
                      ? (language === 'ka' ? '⏸️ გათიშვა' : language === 'ru' ? '⏸️ Отключить' : '⏸️ Disable')
                      : (language === 'ka' ? '▶️ ჩართვა' : language === 'ru' ? '▶️ Включить' : '▶️ Enable')}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <ScheduleManagementModal
        isOpen={scheduleModal.open}
        card={scheduleModal.card}
        onClose={() => setScheduleModal({ open: false, card: null })}
        onUpdate={handleScheduleUpdate}
      />
      <DeleteConfirmModal 
        isOpen={deleteModal.open}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModal({ open: false, cardId: null })}
      />
    </>
  );
}
