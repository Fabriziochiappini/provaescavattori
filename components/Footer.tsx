
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, HardHat } from 'lucide-react';

const Footer: React.FC = () => {
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
              Leader nel settore del movimento terra. Offriamo soluzioni di vendita e noleggio su misura per ogni esigenza di cantiere, garantendo macchinari all'avanguardia e assistenza dedicata.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="p-2 bg-zinc-900 rounded-full hover:bg-orange-600 hover:text-black transition-all">
                <Facebook size={18} />
              </a>
              <a href="#" className="p-2 bg-zinc-900 rounded-full hover:bg-orange-600 hover:text-black transition-all">
                <Instagram size={18} />
              </a>
              <a href="#" className="p-2 bg-zinc-900 rounded-full hover:bg-orange-600 hover:text-black transition-all">
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold font-oswald uppercase tracking-wider mb-6">Menu Rapido</h4>
            <ul className="space-y-4">
              {['Home', 'Vendita', 'Noleggio', 'Chi Siamo', 'Contatti'].map((item) => (
                <li key={item}>
                  <Link to={`/${item.toLowerCase().replace(' ', '-')}`} className="text-zinc-400 hover:text-orange-500 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-bold font-oswald uppercase tracking-wider mb-6">I Nostri Servizi</h4>
            <ul className="space-y-4">
              {['Vendita Usato', 'Noleggio Breve Termine', 'Noleggio Lungo Termine', 'Assistenza Tecnica', 'Pezzi di Ricambio'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-zinc-400 hover:text-orange-500 transition-colors">{item}</a>
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
                <span>Via dell'Industria, 123<br />00100 Roma (RM), Italia</span>
              </li>
              <li className="flex items-center space-x-3 text-zinc-400">
                <Phone className="text-orange-500 shrink-0" size={18} />
                <span>+39 06 1234567</span>
              </li>
              <li className="flex items-center space-x-3 text-zinc-400">
                <Mail className="text-orange-500 shrink-0" size={18} />
                <span>info@contegroup.it</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-zinc-900 text-center text-zinc-500 text-xs">
          <p>© {new Date().getFullYear()} Contegroup S.r.l. - P.IVA 01234567890 - Tutti i diritti riservati.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
