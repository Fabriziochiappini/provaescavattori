import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Sales from './pages/Sales';
import Rental from './pages/Rental';
import About from './pages/About';
import Contact from './pages/Contact';
import Assistance from './pages/Assistance';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';
import Admin from './pages/Admin';
import MachineDetail from './pages/MachineDetail';
import CookieBanner from './components/CookieBanner';
import { PWADashboard } from './components/pwa/PWADashboard';
import { CameraView } from './components/pwa/CameraView';
import { LocalGalleryEditor } from './components/pwa/LocalGalleryEditor';
import { SimpleDetailsForm } from './components/pwa/SimpleDetailsForm';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const LayoutContent: React.FC = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50">
      {!isAdmin && <Navbar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/vendita" element={<Sales />} />
          <Route path="/noleggio" element={<Rental />} />
          <Route path="/macchina/:id" element={<MachineDetail />} />
          <Route path="/chi-siamo" element={<About />} />
          <Route path="/contatti" element={<Contact />} />
          <Route path="/assistenza" element={<Assistance />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/termini-e-condizioni" element={<Terms />} />
          <Route path="/admin" element={<Admin />} />

          {/* PWA Routes */}
          <Route path="/admin/pwa" element={<PWADashboard />} />
          <Route path="/admin/pwa/camera" element={<CameraView />} />
          <Route path="/admin/pwa/gallery" element={<LocalGalleryEditor />} />
          <Route path="/admin/pwa/details" element={<SimpleDetailsForm />} />
        </Routes>
        <CookieBanner />
      </main>
      {!isAdmin && <Footer />}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <DataProvider>
      <Router>
        <ScrollToTop />
        <LayoutContent />
      </Router>
    </DataProvider>
  );
};

export default App;
