import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export default function PublishedCards() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchSavedCards = async () => {
      try {
        const response = await fetch('http://localhost:5153/api/cards/user', {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });

        if (response.status === 401) {
          logout();
          navigate('/login');
          return;
        }

        if (!response.ok) {
          throw new Error('Failed to fetch cards');
        }

        const data = await response.json();
        const normalizedData = data.map(c => ({
          ...c,
          isPublic: c.isPublic ?? c.IsPublic
        }));
        setCards(normalizedData);
      } catch (err) {
        console.error('Error fetching cards:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedCards();
  }, [user, navigate]);

  const handleTogglePublish = async (cardId) => {
    try {
      const response = await fetch(`http://localhost:5153/api/cards/${cardId}/toggle-public`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to toggle visibility');
      }

      // Update local state
      setCards(prev => prev.map(c => 
        c.id === cardId ? { ...c, isPublic: !c.isPublic } : c
      ));
    } catch (err) {
      console.error(err);
      alert("Error updating card visibility.");
    }
  };

  const handleDelete = async (cardId) => {
    if (!window.confirm(language === 'ka' ? 'დარწმუნებული ხართ, რომ გსურთ ამ გამოქვეყნებული ბარათის წაშლა? ის ყველასთვის წაიშლება.' : language === 'ru' ? 'Вы уверены, что хотите удалить эту опубликованную открытку? Она исчезнет для всех.' : "Are you sure you want to delete this published card? It will disappear for everyone.")) return;

    try {
      const response = await fetch(`http://localhost:5153/api/cards/${cardId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete card');
      }

      setCards(prev => prev.filter(c => c.id !== cardId));
    } catch (err) {
      console.error(err);
      alert("Error deleting the card.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 pt-24 pb-12 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  const publishedCards = cards.filter(c => c.isPublic);

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-4xl font-black text-slate-800 tracking-tight mb-4">
            {language === 'ka' ? 'ჩემი ' : language === 'ru' ? 'Мои ' : 'My '}<span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-pink-600">{language === 'ka' ? 'გამოქვეყნებული ბარათები' : language === 'ru' ? 'Опубликованные открытки' : 'Published Cards'}</span>
          </h1>
          <p className="text-lg text-slate-500 font-medium">
            {language === 'ka' ? 'ლაივ ბარათები, რომლებიც ხილულია ყველასთვის ვისაც აქვს ლინკი.' : language === 'ru' ? 'Живые открытки, которые в данный момент видны любому, у кого есть ссылка.' : 'Live cards that are currently visible to anyone with the link.'}
          </p>
        </div>

        {publishedCards.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm">
            <div className="text-6xl mb-4">🌐</div>
            <h3 className="text-xl font-bold text-slate-700 mb-2">{language === 'ka' ? 'გამოქვეყნებული ბარათები არ არის' : language === 'ru' ? 'Нет опубликованных открыток' : 'No published cards'}</h3>
            <p className="text-slate-500 mb-6 max-w-md mx-auto">
              {language === 'ka' ? 'ჯერ არ გაქვთ გამოქვეყნებული ბარათები. გამოაქვეყნეთ შენახული ბარათებიდან!' : language === 'ru' ? 'Вы еще не сделали ни одной открытки публичной. Опубликуйте открытку из раздела «Сохраненные», чтобы увидеть её здесь!' : "You haven't made any cards public yet. Publish a card from your Saved section to see it here!"}
            </p>
            <button
              onClick={() => navigate('/profile/saved')}
              className="bg-slate-900 text-white font-bold py-3 px-8 rounded-xl hover:bg-slate-800 transition shadow-lg cursor-pointer"
            >
              {language === 'ka' ? 'გადასვლა შენახულ ბარათებზე' : language === 'ru' ? 'Перейти к сохраненным открыткам' : 'Go to Saved Cards'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {publishedCards.map(card => {
              const bgGradient = card.customBgGradient || 'from-slate-100 to-slate-200';
              const emoji = card.customEmoji || '✨';
              
              return (
                <div
                  key={card.id}
                  className={`relative h-80 rounded-[2.5rem] overflow-hidden shadow-xl shadow-purple-100/30 border border-white transition-all duration-500 bg-gradient-to-br ${bgGradient}`}
                >
                  {/* Background Decor */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/5 rounded-full -ml-12 -mb-12 blur-xl" />

                  {/* Visibility Toggle Button */}
                  <button
                    onClick={() => handleTogglePublish(card.id)}
                    title={card.isPublic ? "Click to make Private" : "Click to Publish"}
                    className={`absolute top-6 right-6 z-20 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider shadow-lg transition-all cursor-pointer flex items-center gap-1.5 border border-white/20 ${
                      card.isPublic 
                        ? 'bg-emerald-500 text-white hover:bg-emerald-600 scale-105' 
                        : 'bg-white/10 backdrop-blur text-white hover:bg-white/20'
                    }`}
                  >
                    <span>{card.isPublic ? '🌐' : '🔒'}</span>
                    {card.isPublic ? (language === 'ka' ? 'გამოქვეყნებული' : language === 'ru' ? 'Опубликовано' : 'Published') : (language === 'ka' ? 'პირადი' : language === 'ru' ? 'Личная' : 'Private')}
                  </button>

                  <div className="flex flex-col h-full p-8 text-center relative z-10">
                    <div className="text-6xl mb-4">{emoji}</div>
                    <h3 className="text-xl font-black mb-2 text-slate-800 line-clamp-1">{card.heading}</h3>
                    <p className="text-slate-600 text-sm font-medium line-clamp-2 px-2">{card.message1}</p>

                    <div className="mt-auto grid grid-cols-2 gap-2">
                       <button
                        onClick={() => navigate(`/birthday-card/${card.id}`)}
                        className="w-full bg-white/90 backdrop-blur text-slate-800 text-sm font-bold py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all flex justify-center cursor-pointer"
                       >
                         🔗 {language === 'ka' ? 'ლაივ ლინკი' : language === 'ru' ? 'Живая ссылка' : 'Live Link'}
                       </button>
                       <button
                        onClick={() => handleDelete(card.id)}
                        className="w-full bg-red-100 backdrop-blur text-red-600 hover:bg-red-200 hover:shadow-md text-sm font-bold py-2.5 rounded-xl shadow-sm transition-all flex justify-center cursor-pointer"
                       >
                         🗑️ {language === 'ka' ? 'წაშლა' : language === 'ru' ? 'Удалить' : 'Delete'}
                       </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
