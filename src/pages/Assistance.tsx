
import React, { useState } from 'react';
import { Settings, Truck, Phone, Send, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useData } from '../context/DataContext';

const Assistance: React.FC = () => {
    const { trackInteraction } = useData();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        serviceType: 'ricambi',
        message: ''
    });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');

        try {
            const response = await fetch('/api/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'assistance',
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    subject: `Richiesta Assistenza: ${formData.serviceType.toUpperCase()}`,
                    message: `Tipo richiesta: ${formData.serviceType.toUpperCase()}\n\nMessaggio:\n${formData.message}`
                }),
            });

            if (response.ok) {
                setStatus('success');
                trackInteraction();
                setFormData({ name: '', email: '', phone: '', serviceType: 'ricambi', message: '' });
                alert(`Richiesta inviata con successo! Ti abbiamo inviato una email di conferma.`);
            } else {
                throw new Error('Errore durante l\'invio');
            }
        } catch (error) {
            console.error(error);
            setStatus('error');
            alert('Si è verificato un errore durante l\'invio. Riprova più tardi o contattaci telefonicamente.');
        } finally {
            setStatus('idle');
        }
    };

    const scrollToForm = () => {
        const formElement = document.getElementById('assistance-form');
        if (formElement) {
            formElement.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="pt-32 pb-24 bg-zinc-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Hero Section */}
                <header className="mb-20">
                    <h1 className="text-6xl md:text-8xl font-black uppercase italic mb-8 leading-none">
                        Assistenza <span className="text-orange-600 tracking-tighter">H24</span>
                    </h1>
                    <p className="text-zinc-500 max-w-2xl text-xl font-light">
                        Il tuo lavoro non può fermarsi. Offriamo supporto tecnico specializzato, ricambi originali e pronto intervento direttamente in cantiere.
                    </p>
                </header>

                {/* Feature Sections */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24">
                    {/* Ricambi Section */}
                    <div className="group relative bg-white rounded-3xl overflow-hidden shadow-xl border border-zinc-100 transition-all hover:shadow-2xl">
                        <div className="aspect-video overflow-hidden">
                            <img
                                src="https://res.cloudinary.com/dn96krsq7/image/upload/v1771848905/ricambioriginali_bwb3wa.png"
                                alt="Ricambi Originali"
                                className="w-full h-full object-cover transition-all group-hover:scale-105 duration-500 object-top"
                            />
                        </div>
                        <div className="p-10">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 bg-orange-100 rounded-2xl text-orange-600">
                                    <Settings size={32} />
                                </div>
                                <h3 className="text-3xl font-black uppercase italic">Ricambi Originali</h3>
                            </div>
                            <p className="text-zinc-500 mb-8 leading-relaxed">
                                RICRICAMBI ORIGINALI E COMPATIBILI. Ampio magazzino di componenti per ogni modello. Garantiamo massima durata e performance.
                            </p>
                            <button
                                onClick={scrollToForm}
                                className="bg-zinc-950 text-white px-8 py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-orange-600 hover:text-black transition-all"
                            >
                                ORDINARE RICAMBI
                            </button>
                        </div>
                    </div>

                    {/* Service Section */}
                    <div className="group relative bg-white rounded-3xl overflow-hidden shadow-xl border border-zinc-100 transition-all hover:shadow-2xl">
                        <div className="aspect-video overflow-hidden">
                            <img
                                src="https://res.cloudinary.com/dn96krsq7/image/upload/v1771848906/assistenzatecnica_bp5eme.png"
                                alt="Service a Domicilio"
                                className="w-full h-full object-cover transition-all group-hover:scale-105 duration-500 object-top"
                            />
                        </div>
                        <div className="p-10">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 bg-orange-100 rounded-2xl text-orange-600">
                                    <Truck size={32} />
                                </div>
                                <h3 className="text-3xl font-black uppercase italic">Service a Domicilio</h3>
                            </div>
                            <p className="text-zinc-500 mb-8 leading-relaxed">
                                SERVICE A DOMICILIO. Officine mobili attrezzate per interventi rapidi. Riduciamo i tempi di fermo macchina ovunque ti trovi.
                            </p>
                            <button
                                onClick={scrollToForm}
                                className="bg-zinc-950 text-white px-8 py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-orange-600 hover:text-black transition-all"
                            >
                                RICHIEDI INTERVENTO
                            </button>
                        </div>
                    </div>
                </div>

                {/* Emergency Section */}
                <section className="bg-orange-600 rounded-[2rem] p-8 md:p-12 text-black mb-24 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl shadow-orange-600/20">
                    <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                        <AlertTriangle size={200} strokeWidth={1} />
                    </div>
                    
                    <div className="relative z-10 flex items-center gap-6">
                        <div className="bg-black text-orange-500 p-5 rounded-2xl shadow-lg shrink-0">
                            <Phone size={32} className="animate-pulse" />
                        </div>
                        <div>
                            <h2 className="text-2xl md:text-3xl font-black uppercase italic leading-none mb-2">
                                Pronto Intervento H24
                            </h2>
                            <p className="font-bold text-black/80 text-sm uppercase tracking-wide">
                                Disponibile 7 giorni su 7 per emergenze
                            </p>
                        </div>
                    </div>

                    <a
                        href="tel:+393518349368"
                        onClick={() => trackInteraction()}
                        className="relative z-10 bg-white hover:bg-black hover:text-orange-500 text-black px-8 py-4 rounded-xl font-black text-xl md:text-2xl tracking-tighter transition-all shadow-lg active:scale-95 whitespace-nowrap"
                    >
                        351 8349368
                    </a>
                </section>

                {/* Form Section */}
                <div id="assistance-form" className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                    <div className="space-y-8">
                        <h2 className="text-5xl font-black uppercase italic">Invio Richiesta <br /> Assistenza</h2>
                        <p className="text-zinc-500 text-lg leading-relaxed">
                            Compila il modulo per essere ricontattato dai nostri tecnici. Specifica il tipo di supporto necessario per aiutarci ad intervenire nel modo più rapido possibile.
                        </p>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 p-6 bg-white rounded-2xl shadow-sm border border-zinc-100">
                                <ShieldCheck className="text-orange-600" size={24} />
                                <span className="font-bold">Tecnici Specializzati Certificati</span>
                            </div>
                            <div className="flex items-center gap-4 p-6 bg-white rounded-2xl shadow-sm border border-zinc-100">
                                <ShieldCheck className="text-orange-600" size={24} />
                                <span className="font-bold">Tempi di risposta entro 4 ore lavorative</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-zinc-950 p-10 md:p-16 rounded-[2.5rem] text-white shadow-2xl">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Telefono</label>
                                <input
                                    required
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full bg-zinc-900 border-none rounded-2xl py-5 px-8 focus:ring-2 focus:ring-orange-600 outline-none transition-all"
                                    placeholder="+39 333 1234567"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Nome e Cognome / Ragione Sociale</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-zinc-900 border-none rounded-2xl py-5 px-8 focus:ring-2 focus:ring-orange-600 outline-none transition-all"
                                    placeholder="Inserisci il tuo nome"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Email di Contatto</label>
                                <input
                                    required
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full bg-zinc-900 border-none rounded-2xl py-5 px-8 focus:ring-2 focus:ring-orange-600 outline-none transition-all"
                                    placeholder="mario.rossi@azienda.it"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Servizio Richiesto</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, serviceType: 'ricambi' })}
                                        className={`py-4 rounded-xl font-bold uppercase tracking-wider text-sm transition-all ${formData.serviceType === 'ricambi' ? 'bg-orange-600 text-black shadow-[0_0_20px_rgba(234,88,12,0.4)]' : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'}`}
                                    >
                                        Ricambi
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, serviceType: 'service' })}
                                        className={`py-4 rounded-xl font-bold uppercase tracking-wider text-sm transition-all ${formData.serviceType === 'service' ? 'bg-orange-600 text-black shadow-[0_0_20px_rgba(234,88,12,0.4)]' : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'}`}
                                    >
                                        Service
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Dettagli della richiesta</label>
                                <textarea
                                    required
                                    rows={4}
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    className="w-full bg-zinc-900 border-none rounded-2xl py-5 px-8 focus:ring-2 focus:ring-orange-600 outline-none transition-all resize-none"
                                    placeholder="Descrivi il pezzo o il guasto..."
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={status === 'loading'}
                                className="w-full bg-orange-600 hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed text-black font-black py-6 rounded-2xl text-xl flex items-center justify-center gap-3 transition-all transform active:scale-95 group"
                            >
                                {status === 'loading' ? 'INVIO IN CORSO...' : (
                                    <>
                                        <Send size={24} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                        INVIA RICHIESTA TECNICA
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Assistance;
