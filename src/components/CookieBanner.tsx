import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, ShieldCheck } from 'lucide-react';

const CookieBanner = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('cookie-consent');
        if (!consent) {
            const timer = setTimeout(() => setIsVisible(true), 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const acceptAll = () => {
        localStorage.setItem('cookie-consent', 'all');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-6 left-6 right-6 md:right-auto md:max-w-md z-[100] animate-in fade-in slide-in-from-bottom-10 duration-700">
            <div className="bg-zinc-950 text-white p-8 rounded-3xl shadow-2xl border border-zinc-800 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-2">
                    <button onClick={() => setIsVisible(false)} className="text-zinc-500 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>
                <div className="flex items-center gap-4 mb-6">
                    <div className="bg-orange-600 p-3 rounded-2xl">
                        <ShieldCheck size={24} className="text-black" />
                    </div>
                    <h4 className="font-black uppercase italic text-xl tracking-tight">Privacy & Cookie</h4>
                </div>
                <p className="text-zinc-400 text-sm leading-relaxed mb-8">
                    Utilizziamo i cookie per migliorare la tua esperienza e analizzare il traffico. Cliccando su "Accetta Tutto", acconsenti al nostro utilizzo dei cookie.
                    Leggi la nostra <Link to="/privacy-policy" className="text-orange-500 underline underline-offset-4 font-bold">Privacy Policy</Link> per saperne di più.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                    <button
                        onClick={acceptAll}
                        className="flex-1 bg-orange-600 hover:bg-orange-700 text-black font-black py-4 rounded-xl transition-all shadow-lg shadow-orange-600/20 uppercase text-xs tracking-widest"
                    >
                        Accetta Tutto
                    </button>
                    <button
                        onClick={() => setIsVisible(false)}
                        className="flex-1 bg-zinc-900 hover:bg-zinc-800 text-white font-bold py-4 rounded-xl transition-all border border-zinc-800 uppercase text-xs tracking-widest"
                    >
                        Personalizza
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CookieBanner;
