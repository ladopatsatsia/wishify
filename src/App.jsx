import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, useParams, Navigate } from 'react-router-dom';
import { useLanguage } from './context/LanguageContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import Features from './components/Features';
import Testimonials from './components/Testimonials';
import SocialProof from './components/SocialProof';
import BottomCTA from './components/BottomCTA';
import Footer from './components/Footer';
import CardsBrowser from './components/CardsBrowser';
import CardEditor from './components/CardEditor';
import Login from './components/Login';
import Signup from './components/Signup';
import InteractiveCardView from './components/InteractiveCardView';
import BirthdayCard from './components/birthday/BirthdayCard';
import SavedCards from './pages/SavedCards';
import PublishedCards from './pages/PublishedCards';
import PaymentPage from './pages/PaymentPage';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import LanguageSwitcher from './components/LanguageSwitcher';
import MemoryCardEditor from './components/memory/MemoryCardEditor';
import LoveLetterEditor from './components/love/LoveLetterEditor';
import InvitationEditor from './components/invitation/InvitationEditor';
import { cardsData } from './data/cardsData';
import { useAuth } from './context/AuthContext';
import { CARDS_URL } from './api/config';

// Observe all fade-in elements on the landing page after it mounts
function observeFadeElements() {
  const elements = document.querySelectorAll('.fade-in-section');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('is-visible');
      });
    },
    { threshold: 0.1 }
  );
  elements.forEach(el => observer.observe(el));
  return () => observer.disconnect();
}

function LandingPage() {
  useEffect(() => {
    const timer = setTimeout(observeFadeElements, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Hero />
      <SocialProof />
      <HowItWorks />
      <Features />
      <BottomCTA />
    </>
  );
}

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Detect subdomain (e.g. 'wishyfy' from wishyfy.localhost:5173)
  const hostname = window.location.hostname;
  const parts = hostname.split('.');
  const subdomain = (parts.length === 2 && parts[1] === 'localhost')
    ? parts[0]
    : null;

  if (subdomain && subdomain !== 'localhost' && subdomain !== 'www' && subdomain !== 'wishyfy') {
    const guestPhone = window.location.pathname.split('/')[1];
    return (
      <div className="min-h-screen bg-white flex flex-col font-sans">
        <InteractiveCardView subdomainSlug={subdomain} guestPhone={guestPhone} />
      </div>
    );
  }

  // Hide main UI components when viewing a full-screen interactive card or Admin Dashboard
  const isViewMode = 
    location.pathname.startsWith('/view/') || 
    location.pathname.startsWith('/birthday-card') || 
    location.pathname === '/payment' ||
    location.pathname.startsWith('/admin') ||
    location.pathname.startsWith('/create/') ||
    location.pathname.startsWith('/edit/') ||
    (window.location.hostname.split('.').length > 2 && !window.location.hostname.includes('www') && !window.location.hostname.includes('localhost')) ||
    (subdomain && subdomain !== 'localhost' && subdomain !== 'www' && subdomain !== 'wishyfy');

  const handleCardClick = (categoryId, card) => {
    if (card) {
      navigate(`/edit/${categoryId}/${card.id}`);
    } else {
      navigate(`/browse/${categoryId}`);
    }
  };

  return (
    <div className="relative">
      {!isViewMode && <Navbar />}

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/browse/:categoryId" element={<CardsBrowser onCardClick={handleCardClick} />} />
        <Route
          path="/edit/:categoryId/:cardId"
          element={<CardEditorWrapper />}
        />
        <Route path="/view/:categoryId/:cardId" element={<InteractiveCardView />} />
        <Route path="/view/:categoryId/:cardId/:guestPhone" element={<InteractiveCardView />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile/saved" element={<Navigate to="/dashboard#saved" replace />} />
        <Route path="/profile/published" element={<Navigate to="/dashboard#published" replace />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/birthday-card" element={<BirthdayCard />} />
        <Route path="/birthday-card/:cardId" element={<BirthdayCard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>

      {!isViewMode && <Footer />}
      {!isViewMode && <LanguageSwitcher />}
    </div>
  );
}

// Helper to wrap CardEditor and handle its logic
function CardEditorWrapper() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { language } = useLanguage();
  const { categoryId, cardId } = useParams();
  const catId = categoryId?.toLowerCase();
  const [dbCard, setDbCard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // If cardId is a GUID (long), it's likely a saved card from the DB
  const isSavedCard = cardId && cardId.length > 20;

  useEffect(() => {
    if (isSavedCard && !authLoading) {
      setLoading(true);
      fetch(`${CARDS_URL}/${cardId}`, {
        headers: {
          ...(user?.token ? { 'Authorization': `Bearer ${user.token}` } : {})
        }
      })
      .then(res => {
        if (res.status === 403) throw new Error('Forbidden: Not your card');
        if (!res.ok) throw new Error('Failed to fetch card');
        return res.json();
      })
      .then(data => {
        if (data && data.id) setDbCard(data);
      })
      .catch(err => {
        console.error("Failed to fetch saved card for editing", err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
    }
  }, [cardId, isSavedCard, user, authLoading]);

  // Wait for auth to load before deciding what to do
  if (authLoading || (isSavedCard && !dbCard && loading)) return (
    <div className="h-screen flex items-center justify-center bg-slate-50">
      <div className="w-10 h-10 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
    </div>
  );

  if (error) return (
    <div className="p-20 text-center">
      <h2 className="text-2xl font-bold text-red-600">
        {language === 'ka' ? 'შეცდომა:' : 'Error:'} {error}
      </h2>
      <button onClick={() => navigate('/dashboard#saved')} className="mt-4 text-violet-600 cursor-pointer">
        {language === 'ka' ? 'შენახულებში დაბრუნება' : 'Back to Saved Cards'}
      </button>
    </div>
  );

  const templateCard = dbCard 
    ? cardsData[dbCard.templateId?.startsWith('m') ? 'memory' : dbCard.templateId?.startsWith('l') ? 'love' : dbCard.templateId?.startsWith('i') ? 'invitation' : 'birthday']?.find(t => t.id === dbCard.templateId)
    : cardsData[catId]?.find(c => c.id === cardId);

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-slate-50">
      <div className="w-10 h-10 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
    </div>
  );

  if (!templateCard) return (
    <div className="p-20 text-center">
      <h2 className="text-2xl font-bold">
        {language === 'ka' ? 'ბარათი არ მოიძებნა:' : language === 'ru' ? 'Открытка не найдена:' : 'Card not found:'} {cardId}
      </h2>
      <button onClick={() => navigate('/')} className="mt-4 text-violet-600 cursor-pointer">
        {language === 'ka' ? 'მთავარ გვერდზე დაბრუნება' : language === 'ru' ? 'Вернуться на главную' : 'Go Home'}
      </button>
    </div>
  );

  // If it's a memory card
  if (templateCard.id?.startsWith('m') || dbCard?.templateId?.startsWith('m')) {
    return (
      <MemoryCardEditor
        card={dbCard || templateCard}
        category={categoryId || 'memory'}
        onBack={() => navigate(-1)}
        onClose={() => navigate('/dashboard#saved')}
      />
    );
  }

  // If it's a love letter
  if (templateCard.id?.startsWith('l') || dbCard?.templateId?.startsWith('l')) {
    return (
      <LoveLetterEditor
        card={dbCard || templateCard}
        existingCard={dbCard}
        category={categoryId || 'love'}
        onBack={() => navigate(-1)}
        onClose={() => navigate('/dashboard#saved')}
      />
    );
  }

  // If it's an invitation
  if (templateCard.id?.startsWith('i') || dbCard?.templateId?.startsWith('i') || categoryId === 'invitation') {
    return (
      <InvitationEditor
        card={dbCard || templateCard}
        existingCard={dbCard}
        category={categoryId || 'invitation'}
        onBack={() => navigate(-1)}
        onClose={() => navigate('/dashboard#saved')}
      />
    );
  }

  return (
    <CardEditor
      card={templateCard}
      existingCard={dbCard}
      category={categoryId || 'birthday'}
      onBack={() => navigate(-1)}
      onClose={() => navigate('/dashboard#saved')}
    />
  );
}
