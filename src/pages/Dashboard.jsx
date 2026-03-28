import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import SavedCardsTab from '../components/dashboard/SavedCardsTab';
import PublishedCardsTab from '../components/dashboard/PublishedCardsTab';
import ChangePasswordTab from '../components/dashboard/ChangePasswordTab';

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t, language } = useLanguage();

  // Determine initial tab from URL hash or default to 'saved'
  const getInitialTab = () => {
    const hash = location.hash.replace('#', '');
    if (['saved', 'published', 'password'].includes(hash)) return hash;
    return 'saved';
  };

  const [activeTab, setActiveTab] = useState(getInitialTab);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate('/login', { state: { from: '/dashboard' } });
    }
  }, [user, authLoading, navigate]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    navigate(`/dashboard#${tab}`, { replace: true });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/30 to-pink-50/20 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const tabs = [
    { id: 'saved', icon: '💾', label: t('dashboard.saved_title') },
    { id: 'published', icon: '🌐', label: t('dashboard.published_title') },
    { id: 'password', icon: '🔐', label: t('dashboard.change_password_title') },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/30 to-pink-50/20">
      {/* Hero Header */}
      <div className="relative overflow-hidden pt-28 pb-10 px-4">
        {/* Background decorations */}
        <div className="absolute top-16 left-1/4 w-72 h-72 bg-violet-200/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-24 right-1/4 w-64 h-64 bg-pink-200/25 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-black text-slate-800 tracking-tight mb-2">
            {language === 'ka' ? 'გამარჯობა, ' : language === 'ru' ? 'Привет, ' : 'Hello, '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600">
              {user.firstName}!
            </span>
          </h1>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="max-w-5xl mx-auto px-4 mb-8">
        <div className="bg-white/70 backdrop-blur-md rounded-2xl p-1.5 border border-slate-100/80 shadow-lg shadow-slate-100/50 flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm transition-all duration-200 cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-violet-600 to-pink-600 text-white shadow-lg shadow-violet-200/60 scale-[1.02]'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50/80'
              }`}
            >
              <span>{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-5xl mx-auto px-4 pb-16">
        {activeTab === 'saved' && <SavedCardsTab />}
        {activeTab === 'published' && <PublishedCardsTab />}
        {activeTab === 'password' && <ChangePasswordTab />}
      </div>
    </div>
  );
}
