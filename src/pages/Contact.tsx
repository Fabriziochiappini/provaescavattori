
import React from 'react';
import { Mail, Phone, MapPin, Clock, Send, HelpCircle } from 'lucide-react';
import { useData } from '../context/DataContext';
import FAQSection from '../components/FAQSection';

const Contact: React.FC = () => {
  const { contacts, trackInteraction } = useData();
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    phone: '',
    interest: 'Vendita Escavatore',
    message: ''
  });
  const [status, setStatus] = React.useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'contact',
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: `Nuovo Contatto: ${formData.interest}`,
          message: `Interessato a: ${formData.interest}\n\nMessaggio:\n${formData.message}`
        }),
      });

      if (response.ok) {
        setStatus('success');
        trackInteraction();
        setFormData({ name: '', email: '', phone: '', interest: 'Vendita Escavatore', message: '' });
        alert('Messaggio inviato con successo! Ti abbiamo inviato una email di conferma.');
      } else {
        throw new Error('Errore durante l\'invio');
      }
    } catch (error) {
      console.error(error);
      setStatus('error');
      alert('Si è verificato un errore. Riprova più tardi.');
    } finally {
      setStatus('idle');
    }
  };

  // Helper function to map icon names to Lucide icons
  const getIcon = (iconName: string) => {
    switch (iconName?.toLowerCase()) {
      case 'phone': return Phone;
      case 'email':
      case 'mail': return Mail;
      case 'place':
      case 'map':
      case 'map-pin': return MapPin;
      case 'schedule':
      case 'clock': return Clock;
      case 'whatsapp': return Phone; // Using Phone for now as Lucide doesn't have Whatsapp by default in common versions, or I could use MessageCircle
      default: return HelpCircle;
    }
  };

  return (
    <div>
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center bg-zinc-900 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="/images/contact-header.png" className="w-full h-full object-cover opacity-50" alt="Contact Header" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-zinc-50"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
          <h1 className="text-6xl md:text-8xl font-black uppercase italic mb-6 text-white dropshadow-2xl">
            Contattaci
          </h1>
          <p className="text-zinc-100 max-w-2xl mx-auto text-xl font-light dropshadow-md">
            Siamo a tua disposizione per consulenze tecniche, preventivi e assistenza. La tua prossima sfida inizia da qui.
          </p>
        </div>
      </section>

      <div className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Info Side */}
          <div className="space-y-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {contacts.map((item, i) => {
                const Icon = getIcon(item.icon);
                return (
                  <a
                    key={item.id || i}
                    href={item.href || '#'}
                    target={item.href?.startsWith('http') ? '_blank' : '_self'}
                    rel={item.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                    onClick={() => trackInteraction()}
                    className="bg-zinc-100 p-8 rounded-2xl border border-zinc-200 flex flex-col justify-between hover:border-orange-600 transition-all duration-300 group"
                  >
                    <Icon className="text-orange-600 mb-6 group-hover:scale-110 transition-transform" size={32} />
                    <div>
                      <h4 className="font-bold text-lg mb-2 uppercase tracking-widest text-zinc-400 text-xs">{item.label}</h4>
                      <p className="text-zinc-900 font-black text-xl italic break-all">{item.value}</p>
                      {item.sub && <p className="text-zinc-600 text-sm mt-1 font-bold">{item.sub}</p>}
                    </div>
                  </a>
                );
              })}
              {contacts.length === 0 && (
                <div className="col-span-2 py-10 text-center text-zinc-400 font-bold uppercase tracking-widest">
                  Nessuna informazione di contatto disponibile
                </div>
              )}
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
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-zinc-900 border-none rounded-xl py-4 px-6 focus:ring-2 focus:ring-orange-600 outline-none transition-all"
                    placeholder="Mario Rossi"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Email</label>
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-zinc-900 border-none rounded-xl py-4 px-6 focus:ring-2 focus:ring-orange-600 outline-none transition-all"
                    placeholder="mario.rossi@email.com"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Telefono</label>
                  <input
                    required
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-zinc-900 border-none rounded-xl py-4 px-6 focus:ring-2 focus:ring-orange-600 outline-none transition-all"
                    placeholder="+39 333 1234567"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Interessato a:</label>
                <select 
                  value={formData.interest}
                  onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                  className="w-full bg-zinc-900 border-none rounded-xl py-4 px-6 focus:ring-2 focus:ring-orange-600 outline-none transition-all appearance-none"
                >
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
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-zinc-900 border-none rounded-xl py-4 px-6 focus:ring-2 focus:ring-orange-600 outline-none transition-all resize-none"
                  placeholder="Descrivi brevemente la tua richiesta..."
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-orange-600 hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed text-black font-black py-5 rounded-xl text-xl flex items-center justify-center gap-3 transition-all transform active:scale-95"
              >
                {status === 'loading' ? 'INVIO IN CORSO...' : (
                    <>
                        <Send size={24} />
                        INVIA RICHIESTA
                    </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
      <FAQSection />
    </div>
  );
};

export default Contact;
