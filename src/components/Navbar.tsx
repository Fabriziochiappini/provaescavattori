
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, HardHat, Phone } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Vendita', path: '/vendita' },
    { name: 'Noleggio', path: '/noleggio' },
    { name: 'Servizi', path: '/servizi' },
    { name: 'Assistenza', path: '/assistenza' },
    { name: 'Chi Siamo', path: '/chi-siamo' },
    { name: 'Galleria', path: '/galleria' },
    { name: 'Contatti', path: '/contatti' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed w-full z-50 bg-white text-slate-900 shadow-md border-b border-slate-100/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/images/logoconte.png" 
              alt="Conte Group Logo" 
              className="h-20 w-auto object-contain"
            />
            <span className="text-2xl font-black font-oswald tracking-tighter uppercase text-slate-900">
              CONTE<span className="text-orange-600">GROUP</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-bold uppercase tracking-widest transition-all duration-300 hover:text-orange-600 ${isActive(link.path) 
                  ? 'text-orange-600 border-b-2 border-orange-600 pb-1' 
                  : 'text-slate-500 hover:text-slate-900'
                  }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-xl text-slate-500 hover:text-orange-600 hover:bg-orange-50 transition-colors focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 animate-in slide-in-from-top duration-300 shadow-xl absolute w-full left-0">
          <div className="px-4 pt-4 pb-6 space-y-2 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-4 rounded-xl text-base font-bold transition-all text-center ${isActive(link.path) 
                  ? 'bg-orange-600 text-white shadow-lg shadow-orange-500/30' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/admin"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-4 rounded-xl text-base font-black transition-all text-center text-orange-600 border-2 border-orange-100 mt-4 hover:bg-orange-50"
            >
              AREA ADMIN
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
