import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, useParams } from 'react-router-dom';
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
import { cardsData } from './data/cardsData';

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

  // If on a subdomain, render the card page directly (no Navbar, no routing)
  if (subdomain) {
    return <BirthdayCard subdomainSlug={subdomain} />;
  }

  // Hide main UI components when viewing a full-screen interactive card or Admin Dashboard
  const isViewMode = 
    location.pathname.startsWith('/view/') || 
    location.pathname.startsWith('/birthday-card') || 
    location.pathname === '/payment' ||
    location.pathname.startsWith('/admin');

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
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile/saved" element={<SavedCards />} />
        <Route path="/profile/published" element={<PublishedCards />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/birthday-card" element={<BirthdayCard />} />
        <Route path="/birthday-card/:cardId" element={<BirthdayCard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>

      {!isViewMode && <Footer />}
      <LanguageSwitcher />
    </div>
  );
}

// Helper to wrap CardEditor and handle its logic
function CardEditorWrapper() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { categoryId, cardId } = useParams();
  const catId = categoryId?.toLowerCase();
  console.log("CardEditorWrapper Render:", { categoryId: catId, cardId });

  const card = cardsData[catId]?.find(c => c.id === cardId);
  console.log("Found Card:", card);

  if (!card) return (
    <div className="p-20 text-center">
      <h2 className="text-2xl font-bold">
        {language === 'ka' ? 'ბარათი არ მოიძებნა:' : language === 'ru' ? 'Открытка не найдена:' : 'Card not found:'} {cardId}
      </h2>
      <button onClick={() => navigate('/')} className="mt-4 text-violet-600 cursor-pointer">
        {language === 'ka' ? 'მთავარ გვერდზე დაბრუნება' : language === 'ru' ? 'Вернуться на главную' : 'Go Home'}
      </button>
    </div>
  );

  return (
    <CardEditor
      card={card}
      category={categoryId}
      onBack={() => navigate(`/browse/${categoryId}`)}
      onClose={() => navigate(`/browse/${categoryId}`)}
    />
  );
}
