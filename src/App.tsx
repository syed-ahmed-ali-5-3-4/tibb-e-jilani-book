import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { BookProvider } from './contexts/BookContext';
import { SettingsProvider } from './contexts/SettingsContext';
import HomePage from './pages/HomePage';
import ReaderPage from './pages/ReaderPage';
import BookmarksPage from './pages/BookmarksPage';
import TestimonialsPage from './pages/TestimonialsPage';
import NotesPage from './pages/NotesPage';
import AdminPortal from './pages/AdminPortal'; // Import the Admin Portal
import GeometricBackground from './components/layout/GeometricBackground';
import { useBook } from './contexts/BookContext';
import { Loader2 } from 'lucide-react';

const AppContent: React.FC = () => {
  const { loading } = useBook();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <GeometricBackground />
        <div className="relative z-10 text-center">
          <Loader2 className="w-12 h-12 animate-spin text-islamic-gold-400 mx-auto mb-4" />
          <p className="text-white text-lg">Loading Islamic Healthcare Wisdom...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="relative min-h-screen text-white">
        <GeometricBackground />
        <div className="relative z-10">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/reader/:language/:chapterId?" element={<ReaderPage />} />
            <Route path="/bookmarks" element={<BookmarksPage />} />
            <Route path="/notes" element={<NotesPage />} />
            <Route path="/testimonials" element={<TestimonialsPage />} />
            <Route path="/admin/*" element={<AdminPortal />} /> {/* Add Admin Route */}
          </Routes>
        </div>
      </div>
    </Router>
  );
};

function App() {
  return (
    <SettingsProvider>
      <BookProvider>
        <AppContent />
      </BookProvider>
    </SettingsProvider>
  );
}

export default App;
