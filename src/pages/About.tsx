
import React from 'react';
import { Award, Target, Eye, Users } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Intro */}
        <section className="mb-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h1 className="text-6xl md:text-8xl font-black uppercase italic mb-8 leading-none">
              CHI <br /><span className="text-orange-600">SIAMO</span>
            </h1>
            <p className="text-xl text-zinc-600 leading-relaxed font-light mb-8">
              Fondata nel 2004 ma con un'esperienza di oltre 40 anni, Venus SRL (Conte Group) è il punto di riferimento in Campania per le imprese che cercano affidabilità e competenza. Nati a Pietravairano (CE), siamo cresciuti fino a diventare un partner strategico per centinaia di aziende.
            </p>
            <div className="flex gap-4">
              <div className="bg-zinc-100 p-6 rounded-2xl">
                <p className="text-4xl font-black text-black">40+</p>
                <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Anni di esperienza</p>
              </div>
              <div className="bg-zinc-100 p-6 rounded-2xl">
                <p className="text-4xl font-black text-black">20+</p>
                <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Tecnici esperti</p>
              </div>
            </div>
          </div>
          <div className="relative">
            <img src="https://picsum.photos/seed/about-office/800/1000" className="rounded-3xl shadow-2xl grayscale hover:grayscale-0 transition-all duration-1000" alt="Office" />
            <div className="absolute -bottom-10 -left-10 bg-white p-10 rounded-3xl shadow-2xl border border-zinc-100 max-w-xs hidden md:block">
              <p className="italic text-zinc-500">"Non vendiamo solo macchine, ma soluzioni concrete per garantire che il tuo cantiere non si fermi mai."</p>
              <p className="font-bold mt-4">— La Direzione</p>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-24 border-y border-zinc-200 grid grid-cols-1 md:grid-cols-3 gap-16">
          {[
            { icon: Target, title: "MISSION", text: "Fornire le migliori tecnologie per la movimentazione, ottimizzando tempi e costi per i nostri clienti." },
            { icon: Eye, title: "VISION", text: "Diventare il partner numero uno in Campania per l'innovazione e la sostenibilità nel settore." },
            { icon: Award, title: "QUALITÀ", text: "Manteniamo i più alti standard di manutenzione e sicurezza su ogni singola macchina." }
          ].map((val, i) => (
            <div key={i} className="text-center group">
              <div className="inline-flex bg-zinc-950 p-6 rounded-3xl mb-8 group-hover:bg-orange-600 transition-colors duration-500">
                <val.icon size={40} className="text-orange-500 group-hover:text-black" />
              </div>
              <h3 className="text-3xl font-black uppercase italic mb-6">{val.title}</h3>
              <p className="text-zinc-500 leading-relaxed">{val.text}</p>
            </div>
          ))}
        </section>

        {/* History Timeline placeholder */}
        <section className="py-24">
          <h2 className="text-4xl font-black uppercase italic text-center mb-16 underline decoration-orange-600 decoration-8 underline-offset-8">La nostra Storia</h2>
          <div className="space-y-12 max-w-4xl mx-auto">
            {[
              { year: "2004", event: "Nasce Venus SRL, portando con sé un'esperienza quarantennale nel settore." },
              { year: "2010", event: "Espansione della flotta noleggio con l'introduzione dei primi carrelli elevatori Linde." },
              { year: "2018", event: "Apertura della partnership con i principali marchi del settore movimento terra." },
              { year: "Oggi", event: "Leader in Campania con un servizio completo di vendita, noleggio e assistenza." }
            ].map((step, i) => (
              <div key={i} className="flex gap-8 group">
                <div className="font-black text-3xl text-orange-600 opacity-30 group-hover:opacity-100 transition-opacity shrink-0">{step.year}</div>
                <div className="pt-2">
                  <p className="text-lg font-bold text-zinc-900 leading-snug">{step.event}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
