
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
    { name: 'Chi Siamo', path: '/chi-siamo' },
    { name: 'Contatti', path: '/contatti' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed w-full z-50 bg-zinc-950 text-white shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-orange-600 p-2 rounded-lg">
              <HardHat className="w-8 h-8 text-black" />
            </div>
            <span className="text-2xl font-bold font-oswald tracking-tighter">
              CONTE<span className="text-orange-500">GROUP</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-semibold uppercase tracking-widest transition-colors hover:text-orange-500 ${
                  isActive(link.path) ? 'text-orange-500 border-b-2 border-orange-500 pb-1' : 'text-zinc-300'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/contatti"
              className="bg-orange-600 hover:bg-orange-700 text-black font-bold py-2 px-6 rounded flex items-center gap-2 transition-transform active:scale-95"
            >
              <Phone className="w-4 h-4" />
              RICHIEDI PREVENTIVO
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-zinc-900 border-t border-zinc-800 animate-in slide-in-from-top duration-300">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-4 rounded-md text-base font-medium transition-colors ${
                  isActive(link.path) ? 'bg-orange-600 text-black' : 'text-zinc-300 hover:bg-zinc-800'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
