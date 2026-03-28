import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import PublishModal from '../profile/PublishModal';

export default function SavedCardsTab() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [publishModal, setPublishModal] = useState({ open: false, card: null });
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  useEffect(() => {
    if (!user) return;
    const fetchSavedCards = async () => {
      try {
        const response = await fetch('https://localhost:44328/api/cards/user', {
          headers: { 'Authorization': `Bearer ${user.token}` }
        });
        if (response.status === 401) { logout(); navigate('/login'); return; }
        if (!response.ok) throw new Error('Failed to fetch saved cards');
        const data = await response.json();
        setCards(data.map(c => ({ ...c, isPublic: c.isPublic ?? c.IsPublic })));
      } catch (err) {
        console.error('Error fetching cards:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSavedCards();
  }, [user, navigate, logout]);

  const handleDelete = async (cardId) => {
    if (confirmDeleteId !== cardId) {
      setConfirmDeleteId(cardId);
      setTimeout(() => setConfirmDeleteId(c => c === cardId ? null : c), 3000);
      return;
    }
    try {
      const response = await fetch(`https://localhost:44328/api/cards/${cardId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      if (!response.ok) throw new Error('Failed to delete card');
      setCards(prev => prev.filter(c => c.id !== cardId));
    } catch (err) {
      console.error(err);
    }
  };

  const handleTogglePublish = (cardId) => {
    const card = cards.find(c => c.id === cardId);
    if (!card) return;
    setPublishModal({ open: true, card });
  };

  const startPublishProcess = (cardId, slug, scheduleData) => {
    setPublishModal({ open: false, card: null });
    navigate('/payment', { state: { cardId, slug, schedule: scheduleData } });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-8 h-8 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
      </div>
    );
  }

  const privateCards = cards.filter(c => !c.urlSlug);

  if (cards.length === 0 || privateCards.length === 0) {
    return (
      <>
        <div className="bg-white/80 backdrop-blur rounded-3xl p-14 text-center border border-slate-100/80 shadow-sm">
          <div className="text-7xl mb-5">{cards.length === 0 ? '📭' : '💮'}</div>
          <h3 className="text-2xl font-bold text-slate-700 mb-3">
            {cards.length === 0
              ? t('dashboard.no_saved')
              : (language === 'ka' ? 'პირადი ბარათები არ არის' : language === 'ru' ? 'Нет личных открыток' : 'No private cards')}
          </h3>
          <p className="text-slate-400 mb-8 max-w-md mx-auto text-base">
            {cards.length === 0 ? t('dashboard.no_saved_desc') : t('dashboard.no_public_desc')}
          </p>
          <button
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-violet-600 to-pink-600 text-white font-bold py-3 px-10 rounded-xl hover:opacity-90 transition shadow-lg shadow-violet-200 cursor-pointer"
          >
            {t('dashboard.btn_create')}
          </button>
        </div>
        <PublishModal
          isOpen={publishModal.open}
          card={publishModal.card}
          onClose={() => setPublishModal({ open: false, card: null })}
          onProceed={startPublishProcess}
        />
      </>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {privateCards.map(card => {
          const bgGradient = card.customBgGradient || 'from-slate-100 to-slate-200';
          const emoji = card.customEmoji || '✨';
          return (
            <div
              key={card.id}
              className={`relative h-80 rounded-[2.5rem] overflow-hidden shadow-xl shadow-purple-100/30 border border-white/50 transition-all duration-500 bg-gradient-to-br ${bgGradient} hover:scale-[1.02] hover:shadow-2xl`}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/5 rounded-full -ml-12 -mb-12 blur-xl" />

              <button
                onClick={() => handleTogglePublish(card.id)}
                title={card.isPublic ? 'Click to make Private' : 'Click to Publish'}
                className={`absolute top-5 right-5 z-20 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider shadow-lg transition-all cursor-pointer flex items-center gap-1.5 border border-white/20 ${
                  card.isPublic
                    ? 'bg-emerald-500 text-white hover:bg-emerald-600 scale-105'
                    : 'bg-white/10 backdrop-blur text-white hover:bg-white/20'
                }`}
              >
                <span>{card.isPublic ? '🌐' : '🔒'}</span>
                {card.isPublic
                  ? (language === 'ka' ? 'გამოქვეყნებული' : language === 'ru' ? 'Опубликовано' : 'Published')
                  : (language === 'ka' ? 'პირადი' : language === 'ru' ? 'Личная' : 'Private')}
              </button>

              <div className="flex flex-col h-full p-8 text-center relative z-10">
                <div className="text-6xl mb-4">{emoji}</div>
                <h3 className="text-xl font-black mb-2 text-slate-800 line-clamp-1">{card.heading}</h3>
                <p className="text-slate-600 text-sm font-medium line-clamp-2 px-2">{card.message1}</p>

                <div className="mt-auto grid grid-cols-2 gap-2">
                  <button
                    onClick={() => navigate(`/birthday-card/${card.id}`, { state: { from: '/dashboard#saved' } })}
                    className="w-full bg-white/90 backdrop-blur text-slate-800 text-sm font-bold py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all flex justify-center cursor-pointer"
                  >
                    👀 {language === 'ka' ? 'ნახვა' : language === 'ru' ? 'Просмотр' : 'View'}
                  </button>
                  <button
                    onClick={() => handleDelete(card.id)}
                    className={`w-full text-sm font-bold py-2.5 rounded-xl shadow-sm transition-all flex justify-center cursor-pointer ${
                      confirmDeleteId === card.id
                        ? 'bg-red-500 text-white shadow-red-500/30 hover:bg-red-600 animate-pulse'
                        : 'bg-red-100 backdrop-blur text-red-600 hover:bg-red-200 hover:shadow-md'
                    }`}
                  >
                    {confirmDeleteId === card.id
                      ? (language === 'ka' ? '⚠️ დარწმუნებული ხართ?' : language === 'ru' ? '⚠️ Вы уверены?' : '⚠️ Confirm?')
                      : (language === 'ka' ? '🗑️ წაშლა' : language === 'ru' ? '🗑️ Удалить' : '🗑️ Remove')}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <PublishModal
        isOpen={publishModal.open}
        card={publishModal.card}
        onClose={() => setPublishModal({ open: false, card: null })}
        onProceed={startPublishProcess}
      />
    </>
  );
}
