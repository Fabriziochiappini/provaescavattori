
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, HardHat, Eye, MousePointerClick } from 'lucide-react';
import { useData } from '../context/DataContext';

const Footer: React.FC = () => {
  const { stats, trackInteraction } = useData();
  
  return (
    <footer className="bg-zinc-950 text-white pt-16 pb-8 border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Info */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-orange-600 p-2 rounded-lg">
                <HardHat className="w-6 h-6 text-black" />
              </div>
              <span className="text-xl font-bold font-oswald tracking-tighter">
                CONTE<span className="text-orange-500">GROUP</span>
              </span>
            </Link>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Da oltre 40 anni, Venus SRL (Conte Group) è il vostro partner di fiducia in Campania per la vendita, il noleggio e l'assistenza di macchine movimento terra e carrelli elevatori.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/macchine.conte.9" target="_blank" rel="noopener noreferrer" className="p-2 bg-zinc-900 rounded-full hover:bg-orange-600 hover:text-black transition-all">
                <Facebook size={18} />
              </a>
              <a href="https://www.instagram.com/contecarrelli/" target="_blank" rel="noopener noreferrer" className="p-2 bg-zinc-900 rounded-full hover:bg-orange-600 hover:text-black transition-all">
                <Instagram size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold font-oswald uppercase tracking-wider mb-6">Menu Rapido</h4>
            <ul className="space-y-4">
              {[
                { name: 'Home', path: '/' },
                { name: 'Vendita', path: '/vendita' },
                { name: 'Noleggio', path: '/noleggio' },
                { name: 'Chi Siamo', path: '/chi-siamo' },
                { name: 'Contatti', path: '/contatti' },
                { name: 'Area Admin', path: '/admin' }
              ].map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-zinc-400 hover:text-orange-500 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-bold font-oswald uppercase tracking-wider mb-6">I Nostri Servizi</h4>
            <ul className="space-y-4">
              {['Vendita Usato', 'Noleggio Breve Termine', 'Noleggio Lungo Termine', 'Assistenza Tecnica', 'Ricambi'].map((item) => (
                <li key={item}>
                  <Link to={item === 'Ricambi' ? '/assistenza' : `/${item.toLowerCase().replace(/ /g, '-')}`} className="text-zinc-400 hover:text-orange-500 transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold font-oswald uppercase tracking-wider mb-6">Contattaci</h4>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3 text-zinc-400">
                <MapPin className="text-orange-500 shrink-0 mt-1" size={18} />
                <span>Sede Operativa: Via Campo di Santo, 38<br />81040 Pietravairano (CE)</span>
              </li>
              <li className="flex items-center space-x-3 text-zinc-400">
                <Phone className="text-orange-500 shrink-0" size={18} />
                <a onClick={trackInteraction} href="tel:+390823982162" className="hover:text-orange-500">+39 0823 982162</a>
              </li>
              <li className="flex items-center space-x-3 text-zinc-400">
                <Mail className="text-orange-500 shrink-0" size={18} />
                <a onClick={trackInteraction} href="mailto:info@contegroup.com" className="hover:text-orange-500">info@contegroup.com</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-4 text-zinc-500 text-xs text-center md:text-left">
          <p className="flex items-center gap-2">
            © 2026 Venus S.r.l. - P.IVA 03030410611 - Tutti i diritti riservati.
          </p>
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex gap-4">
                <div className="flex items-center gap-2 text-zinc-600 bg-zinc-900 px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider">
                    <Eye size={12} />
                    <span>{stats?.visits ? stats.visits.toLocaleString() : '0'} Visite</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-600 bg-zinc-900 px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider">
                    <MousePointerClick size={12} />
                    <span>{stats?.interactions ? stats.interactions.toLocaleString() : '0'} Click</span>
                </div>
            </div>
            <div className="flex gap-6 uppercase tracking-widest font-bold text-xs">
              <Link to="/privacy-policy" className="hover:text-orange-500 transition-colors">Privacy Policy</Link>
              <Link to="/termini-e-condizioni" className="hover:text-orange-500 transition-colors">Termini e Condizioni</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
