import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function SavedCards() {
  const { user } = useAuth();
  const navigate = useNavigate();
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

        if (!response.ok) {
          throw new Error('Failed to fetch saved cards');
        }

        const data = await response.json();
        setCards(data);
      } catch (err) {
        console.error('Error fetching cards:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedCards();
  }, [user, navigate]);

  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const handleDelete = async (cardId) => {
    if (confirmDeleteId !== cardId) {
      setConfirmDeleteId(cardId);
      // Auto-reset confirmation state after 3 seconds
      setTimeout(() => {
        setConfirmDeleteId(current => current === cardId ? null : current);
      }, 3000);
      return;
    }

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
      alert("There was an error deleting the card.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 pt-24 pb-12 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-4xl font-black text-slate-800 tracking-tight mb-4">
            My <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-pink-600">Saved Cards</span>
          </h1>
          <p className="text-lg text-slate-500 font-medium">
            All your customized and beautifully personalized greeting cards.
          </p>
        </div>

        {cards.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-bold text-slate-700 mb-2">No saved cards yet</h3>
            <p className="text-slate-500 mb-6 max-w-md mx-auto">
              You haven't customized any cards yet. Head over to our templates and create something magical!
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-slate-900 text-white font-bold py-3 px-8 rounded-xl hover:bg-slate-800 transition shadow-lg"
            >
              Start Customizing
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cards.map(card => {
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

                  <div className="flex flex-col h-full p-8 text-center relative z-10">
                    <div className="text-6xl mb-4">{emoji}</div>
                    <h3 className="text-xl font-black mb-2 text-slate-800 line-clamp-1">{card.heading}</h3>
                    <p className="text-slate-600 text-sm font-medium line-clamp-2 px-2">{card.message1}</p>

                    <div className="mt-auto grid grid-cols-2 gap-2">
                       <button
                        onClick={() => navigate(`/view/${card.id}`)}
                        className="w-full bg-white/90 backdrop-blur text-slate-800 text-sm font-bold py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all flex justify-center cursor-pointer"
                       >
                         👀 View
                       </button>
                       <button
                        onClick={() => handleDelete(card.id)}
                        className={`w-full text-sm font-bold py-2.5 rounded-xl shadow-sm transition-all flex justify-center cursor-pointer ${
                          confirmDeleteId === card.id 
                            ? 'bg-red-500 text-white shadow-red-500/30 hover:bg-red-600 animate-pulse'
                            : 'bg-red-100 backdrop-blur text-red-600 hover:bg-red-200 hover:shadow-md'
                        }`}
                       >
                         {confirmDeleteId === card.id ? '⚠️ Confirm?' : '🗑️ Remove'}
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
