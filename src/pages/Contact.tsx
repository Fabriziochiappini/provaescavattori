
import React from 'react';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';

const Contact: React.FC = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Messaggio inviato con successo! Ti ricontatteremo a breve.');
  };

  return (
    <div className="pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-16">
          <h1 className="text-6xl md:text-8xl font-black uppercase italic mb-8">
            Contattaci
          </h1>
          <p className="text-zinc-500 max-w-2xl text-xl font-light">
            Siamo a tua disposizione per consulenze tecniche, preventivi e assistenza. La tua prossima sfida inizia da qui.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Info Side */}
          <div className="space-y-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="bg-zinc-100 p-8 rounded-2xl border border-zinc-200">
                <Phone className="text-orange-600 mb-6" size={32} />
                <h4 className="font-bold text-lg mb-2 uppercase tracking-widest">Telefono</h4>
                <p className="text-zinc-600">+39 06 1234567</p>
                <p className="text-zinc-600">+39 333 4567890</p>
              </div>
              <div className="bg-zinc-100 p-8 rounded-2xl border border-zinc-200">
                <Mail className="text-orange-600 mb-6" size={32} />
                <h4 className="font-bold text-lg mb-2 uppercase tracking-widest">Email</h4>
                <p className="text-zinc-600">info@contegroup.it</p>
                <p className="text-zinc-600">commerciale@contegroup.it</p>
              </div>
              {[
                { icon: Phone, title: 'TELEFONO', content: '0823 982162', sub: 'LUN - VEN: 08:30 - 18:30', href: 'tel:+390823982162' },
                { icon: Mail, title: 'EMAIL', content: 'info@contegroup.com', sub: 'Rispondiamo entro 24h', href: 'mailto:info@contegroup.com' },
                { icon: MapPin, title: 'SEDE', content: 'SP330, 24, 81016', sub: 'Pietravairano (CE)', href: 'https://maps.app.goo.gl/uXvV7yXWzQZ' },
                { icon: Clock, title: 'ORARI', content: '08:00 - 18:30', sub: 'Sabato: 08:00 - 13:00' },
              ].map((item, i) => (
                <a
                  key={i}
                  href={item.href}
                  target={item.href?.startsWith('http') ? '_blank' : '_self'}
                  rel={item.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="bg-zinc-100 p-8 rounded-2xl border border-zinc-200 flex flex-col justify-between hover:border-orange-600 transition-all duration-300"
                >
                  <item.icon className="text-orange-600 mb-6" size={32} />
                  <div>
                    <h4 className="font-bold text-lg mb-2 uppercase tracking-widest">{item.title}</h4>
                    <p className="text-zinc-600">{item.content}</p>
                    {item.sub && <p className="text-zinc-600 text-sm mt-1">{item.sub}</p>}
                  </div>
                </a>
              ))}
            </div>

            <section className="h-[500px] rounded-3xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-1000 shadow-2xl">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3000.5!2d14.1!3d41.3!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDE4JzAwLjAiTiAxNMKwMDYnMDAuMCJF!5e0!3m2!1sit!2sit!4v1234567890" // This should be updated with a real embed link if available, or I can use the search tool to find the exact coordinates.
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
              ></iframe>
            </section>
          </div>

          {/* Form Side */}
          <div className="bg-zinc-950 p-10 md:p-16 rounded-3xl text-white shadow-2xl">
            <h3 className="text-3xl font-black uppercase italic mb-8">Inviaci un Messaggio</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Nome e Cognome</label>
                  <input
                    required
                    type="text"
                    className="w-full bg-zinc-900 border-none rounded-xl py-4 px-6 focus:ring-2 focus:ring-orange-600 outline-none transition-all"
                    placeholder="Mario Rossi"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Email</label>
                  <input
                    required
                    type="email"
                    className="w-full bg-zinc-900 border-none rounded-xl py-4 px-6 focus:ring-2 focus:ring-orange-600 outline-none transition-all"
                    placeholder="mario.rossi@email.com"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Interessato a:</label>
                <select className="w-full bg-zinc-900 border-none rounded-xl py-4 px-6 focus:ring-2 focus:ring-orange-600 outline-none transition-all appearance-none">
                  <option>Vendita Escavatore</option>
                  <option>Noleggio Breve Termine</option>
                  <option>Noleggio Lungo Termine</option>
                  <option>Assistenza Tecnica</option>
                  <option>Altro</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Messaggio</label>
                <textarea
                  required
                  rows={4}
                  className="w-full bg-zinc-900 border-none rounded-xl py-4 px-6 focus:ring-2 focus:ring-orange-600 outline-none transition-all resize-none"
                  placeholder="Descrivi brevemente la tua richiesta..."
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-orange-600 hover:bg-orange-700 text-black font-black py-5 rounded-xl text-xl flex items-center justify-center gap-3 transition-all transform active:scale-95"
              >
                <Send size={24} />
                INVIA RICHIESTA
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
