import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import PublishModal from '../profile/PublishModal';
import DeleteConfirmModal from '../profile/DeleteConfirmModal';
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
    customBgGradient: card.customBgGradient ?? card.CustomBgGradient,
    customEmoji: card.customEmoji ?? card.CustomEmoji,
    imagesJson: card.imagesJson ?? card.ImagesJson,
  };
}

export default function SavedCardsTab() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [publishModal, setPublishModal] = useState({ open: false, card: null });
  const [deleteModal, setDeleteModal] = useState({ open: false, cardId: null });

  const fetchCards = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);
    try {
      const response = await fetch(`${CARDS_URL}/user`, {
        headers: { 'Authorization': `Bearer ${user.token}` },
        signal: controller.signal,
      });
      clearTimeout(timeout);
      if (response.status === 401) { logout(); navigate('/login'); return; }
      if (!response.ok) throw new Error('Failed to fetch saved cards');
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

  const handleDelete = async (cardId) => {
    setDeleteModal({ open: true, cardId });
  };

  const confirmDelete = async () => {
    const cardId = deleteModal.cardId;
    if (!cardId) return;
    
    try {
      const response = await fetch(`${CARDS_URL}/${cardId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      if (!response.ok) throw new Error('Failed to delete card');
      setCards(prev => prev.filter(c => c.id !== cardId));
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteModal({ open: false, cardId: null });
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
        <DeleteConfirmModal 
          isOpen={deleteModal.open}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteModal({ open: false, cardId: null })}
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

              {/* Left Badge: Saved */}
              <div className="absolute top-5 left-5 z-20 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider bg-white/40 backdrop-blur text-slate-900 border border-white/20 shadow-lg pointer-events-none">
                <span>💾</span> {language === 'ka' ? 'შენახული' : language === 'ru' ? 'Сохранено' : 'Saved'}
              </div>

              {/* Right Badge: Delete Button */}
              <button
                onClick={() => handleDelete(card.id)}
                className="absolute top-5 right-5 z-20 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider shadow-lg transition-all cursor-pointer flex items-center gap-1.5 border border-white/20 bg-white/40 backdrop-blur text-red-600 hover:bg-white/60"
              >
                <span>🗑️</span>
                {language === 'ka' ? 'წაშლა' : language === 'ru' ? 'Удалить' : 'Remove'}
              </button>

              <div className="flex flex-col h-full p-8 text-center relative z-10">
                <div className="text-6xl mb-4">{emoji}</div>
                <h3 className="text-xl font-black mb-2 text-slate-800 line-clamp-1">{card.heading}</h3>
                <p className="text-slate-600 text-sm font-medium line-clamp-2 px-2">{card.message1}</p>

                <div className="mt-auto grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      let category = 'birthday';
                      if (card.templateId?.startsWith('i') || card.templateId?.startsWith('inv')) {
                        category = 'invitation';
                      } else if (card.templateId?.startsWith('m')) {
                        category = 'memory';
                      } else if (card.templateId?.startsWith('l')) {
                        category = 'love';
                      } else if (card.imagesJson) {
                        const parsed = typeof card.imagesJson === 'string' ? JSON.parse(card.imagesJson) : card.imagesJson;
                        if (parsed && parsed.type === 'memory') category = 'memory';
                      }
                      
                      if (category === 'birthday') {
                        navigate(`/birthday-card/${card.id}`, { state: { from: '/dashboard#saved' } });
                      } else {
                        navigate(`/view/${category}/${card.id}`, { state: { from: '/dashboard#saved' } });
                      }
                    }}
                    className="w-full bg-white/90 backdrop-blur text-slate-800 text-sm font-bold py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all flex justify-center cursor-pointer items-center gap-1.5"
                  >
                    👀 {language === 'ka' ? 'ნახვა' : language === 'ru' ? 'Просмотр' : 'View'}
                  </button>
                  <button
                    onClick={() => {
                      let categoryId = 'birthday';
                      if (card.templateId?.startsWith('i') || card.templateId?.startsWith('inv')) {
                        categoryId = 'invitation';
                      } else if (card.templateId?.startsWith('m')) {
                        categoryId = 'memory';
                      } else if (card.templateId?.startsWith('l')) {
                        categoryId = 'love';
                      } else if (card.imagesJson) {
                        const parsed = typeof card.imagesJson === 'string' ? JSON.parse(card.imagesJson) : card.imagesJson;
                        if (parsed && parsed.type === 'memory') categoryId = 'memory';
                      }
                      
                      const editUrl = categoryId === 'birthday'
                        ? `/birthday-card/${card.id}?mode=edit`
                        : `/edit/${categoryId}/${card.id}`;
                        
                      navigate(editUrl, { state: { from: '/dashboard#saved' } });
                    }}
                    className="w-full bg-violet-600 text-white text-sm font-bold py-2.5 rounded-xl shadow-sm hover:bg-violet-700 transition-all flex justify-center cursor-pointer items-center gap-1.5"
                  >
                    ✏️ {language === 'ka' ? 'შეცვლა' : language === 'ru' ? 'Смена' : 'Edit'}
                  </button>
                </div>
                <div className="mt-2">
                  <button
                    onClick={() => handleTogglePublish(card.id)}
                    className={`w-full text-xs font-black py-2.5 rounded-xl shadow-sm transition-all flex justify-center cursor-pointer uppercase tracking-widest ${
                      card.isPublic
                        ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                        : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:shadow-md'
                    }`}
                  >
                    <span>{card.isPublic ? '🌐' : '🔒'}</span>
                    &nbsp;
                    {card.isPublic
                      ? (language === 'ka' ? 'გამოქვეყნებული' : language === 'ru' ? 'Опубликовано' : 'Published')
                      : (language === 'ka' ? 'გამოქვეყნება' : language === 'ru' ? 'Опубликовать' : 'Publish')}
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
      <DeleteConfirmModal 
        isOpen={deleteModal.open}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModal({ open: false, cardId: null })}
      />
    </>
  );
}
