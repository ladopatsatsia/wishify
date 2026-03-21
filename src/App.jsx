import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, useParams } from 'react-router-dom';
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

  // Hide main UI components when viewing a full-screen interactive card
  const isViewMode = location.pathname.startsWith('/view/') || location.pathname.startsWith('/birthday-card');

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
        <Route path="/birthday-card" element={<BirthdayCard />} />
        <Route path="/birthday-card/:cardId" element={<BirthdayCard />} />
      </Routes>

      {!isViewMode && <Footer />}
    </div>
  );
}

// Helper to wrap CardEditor and handle its logic
function CardEditorWrapper() {
  const navigate = useNavigate();
  const { categoryId, cardId } = useParams();
  const catId = categoryId?.toLowerCase();
  console.log("CardEditorWrapper Render:", { categoryId: catId, cardId });

  const card = cardsData[catId]?.find(c => c.id === cardId);
  console.log("Found Card:", card);

  if (!card) return (
    <div className="p-20 text-center">
      <h2 className="text-2xl font-bold">Card not found: {cardId}</h2>
      <button onClick={() => navigate('/')} className="mt-4 text-violet-600">Go Home</button>
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
