
import React, { useState } from 'react';
import { MACHINES_DATA } from '../constants';
import MachineCard from '../components/MachineCard';
import { Clock, Shield, Zap } from 'lucide-react';

const Rental: React.FC = () => {
  const rentalMachines = MACHINES_DATA.filter(m => m.type === 'rental' || m.type === 'both');

  return (
    <div className="pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-16">
          <h1 className="text-5xl md:text-7xl font-black uppercase italic mb-6">
            Noleggio <span className="text-orange-600">Mezzi</span>
          </h1>
          <p className="text-zinc-500 max-w-2xl text-lg">
            Soluzioni flessibili di noleggio a breve e lungo termine. Mezzi moderni, pronti all'uso e coperti da assistenza completa.
          </p>
        </header>

        {/* Rental Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {[
            { icon: Clock, title: "Flessibilità Totale", text: "Noleggio da un solo giorno a periodi pluriennali, adattandoci ai tuoi carichi di lavoro." },
            { icon: Shield, title: "Copertura Kasko", text: "Tutti i nostri mezzi a noleggio sono coperti da assicurazione completa per la tua serenità." },
            { icon: Zap, title: "Zero Manutenzione", text: "Ci occupiamo noi di tutto: dalla manutenzione ordinaria ai ricambi necessari." }
          ].map((benefit, idx) => (
            <div key={idx} className="bg-white p-8 rounded-2xl border border-zinc-100 shadow-sm flex flex-col items-center text-center">
              <div className="bg-orange-600 p-4 rounded-2xl mb-6 shadow-lg shadow-orange-600/20">
                <benefit.icon size={32} className="text-black" />
              </div>
              <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">{benefit.text}</p>
            </div>
          ))}
        </div>

        <h2 className="text-3xl font-black uppercase italic mb-10 border-l-8 border-orange-600 pl-6">Parco Macchine Disponibile</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rentalMachines.map((machine) => (
            <MachineCard key={machine.id} machine={machine} />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-20 bg-zinc-950 rounded-3xl p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h3 className="text-3xl font-black text-white uppercase italic mb-2">Hai bisogno di un intero parco mezzi?</h3>
            <p className="text-zinc-400">Offriamo quotazioni personalizzate per noleggi flotta e lunghe durate.</p>
          </div>
          <button className="bg-orange-600 hover:bg-orange-700 text-black font-black px-10 py-5 rounded-full whitespace-nowrap transition-all shadow-xl shadow-orange-600/20">
            CHIEDI PREVENTIVO FLOTTA
          </button>
        </div>
      </div>
    </div>
  );
};

export default Rental;
