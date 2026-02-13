
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, ShieldCheck, Truck, Clock, Award, Users } from 'lucide-react';
import { MACHINES_DATA } from '../constants';
import MachineCard from '../components/MachineCard';
import BrandsBanner from '../components/BrandsBanner';
import MachineCardStack from '../components/MachineCardStack';
import { useData } from '../context/DataContext';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const fadeInRight = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const fadeInLeft = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const Home: React.FC = () => {
  const { brandsBanner } = useData();
  const [activeTab, setActiveTab] = React.useState<'sale' | 'rental'>('sale');

  const filteredMachines = MACHINES_DATA.filter(machine =>
    activeTab === 'sale'
      ? machine.type === 'sale' || machine.type === 'both'
      : machine.type === 'rental' || machine.type === 'both'
  ).slice(0, 4);

  return (
    <div className="pt-20">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-slate-950">
        <div className="absolute inset-0 z-0">
          <motion.img
            initial={{ scale: 1.05, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.6 }}
            transition={{ duration: 2, ease: "easeOut" }}
            src="/images/hero-excavator.png"
            className="w-full h-full object-cover"
            alt="Hero Excavator"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20 lg:py-0">
          <div className="max-w-3xl">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="text-left"
            >
              <motion.div variants={fadeInLeft} className="mb-6 flex items-center gap-4">
                <span className="h-[2px] w-12 bg-orange-600"></span>
                <span className="text-orange-500 font-bold tracking-[0.3em] text-xs uppercase">
                  Dal 1984, Leader nel settore
                </span>
              </motion.div>

              <motion.h1
                variants={fadeInLeft}
                className="text-5xl md:text-8xl font-black text-white leading-[0.9] tracking-tighter mb-8 uppercase flex flex-col"
              >
                <span>SOLUZIONI</span>
                <span className="text-orange-600">INDUSTRIALI</span>
                <span className="text-white/40">D'ECCELLENZA</span>
              </motion.h1>

              <motion.p
                variants={fadeInLeft}
                className="text-lg md:text-xl text-slate-300 mb-12 leading-relaxed font-medium max-w-xl border-l-2 border-slate-700 pl-8"
              >
                Conte Group rappresenta il punto di riferimento per la vendita, il noleggio e l'assistenza di macchine movimento terra e industriali.
                <span className="block mt-4 text-slate-400 text-sm italic font-normal">Innovazione, efficienza e supporto globale per il tuo cantiere.</span>
              </motion.p>

              <motion.div
                variants={fadeInUp}
                className="flex flex-col sm:flex-row gap-6"
              >
                <Link to="/vendita" className="group bg-orange-600 hover:bg-orange-700 text-white px-10 py-5 font-bold text-base flex items-center justify-center gap-4 transition-all shadow-xl hover:shadow-orange-900/20">
                  CONSULTA IL CATALOGO
                  <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                </Link>
                <Link to="/noleggio" className="group bg-transparent border border-white/30 hover:border-white text-white px-10 py-5 font-bold text-base flex items-center justify-center gap-4 transition-all backdrop-blur-md">
                  SOLUZIONI DI NOLEGGIO
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Decorative element */}
        <div className="absolute bottom-0 right-0 p-12 hidden lg:block">
          <div className="flex flex-col items-end">
            <span className="text-slate-500 font-black text-9xl leading-none opacity-5 tracking-tighter">CONTE</span>
            <span className="text-orange-600 font-black text-6xl leading-none -mt-8 opacity-20 tracking-tighter uppercase italic">Group</span>
          </div>
        </div>
      </section>

      {brandsBanner.position === 'after_hero' && <BrandsBanner />}

      {/* 2. STATS SECTION */}
      <section className="py-24 bg-slate-950 text-white relative border-y border-white/5">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-4 gap-12"
          >
            {[
              { label: 'Anni di Esperienza', value: '40', suffix: '+' },
              { label: 'Macchine in Flotta', value: '500', suffix: '+' },
              { label: 'Clienti Soddisfatti', value: '1000', suffix: '+' },
              { label: 'Sede Operativa', value: '1', suffix: '' },
            ].map((stat, i) => (
              <motion.div key={i} variants={fadeInUp} className="relative group">
                <div className="flex flex-col">
                  <span className="text-orange-600 font-bold text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                    <span className="w-4 h-[1px] bg-orange-600"></span>
                    {stat.label}
                  </span>
                  <div className="flex items-baseline">
                    <p className="text-6xl md:text-7xl font-black text-white tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
                      {stat.value}
                    </p>
                    <span className="text-3xl font-bold text-orange-600 ml-1">{stat.suffix}</span>
                  </div>
                </div>
                <div className="absolute -bottom-4 left-0 w-0 h-[2px] bg-orange-600 group-hover:w-full transition-all duration-700"></div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 3. LATEST ARRIVALS GRID */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="flex flex-col lg:flex-row lg:items-end justify-between mb-20 gap-8"
          >
            <motion.div variants={fadeInLeft} className="max-w-2xl">
              <span className="text-orange-600 font-bold text-xs uppercase tracking-[0.3em] mb-4 block">Parco Macchine</span>
              <h2 className="text-4xl md:text-6xl font-black uppercase leading-tight mb-6 text-slate-900 tracking-tighter">
                SOLUZIONI PER OGNI <br />
                <span className="text-orange-600 underline decoration-slate-900 decoration-8 underline-offset-4">ESIGENZA OPERATIVA</span>
              </h2>
              <p className="text-slate-500 text-lg border-l-2 border-slate-100 pl-6">
                Selezioniamo solo i migliori brand del settore per garantire affidabilità e performance senza compromessi nel tempo.
              </p>
            </motion.div>
            <motion.div variants={fadeInRight}>
              <div className="bg-slate-50 p-2 border border-slate-100 flex gap-2">
                <button
                  onClick={() => setActiveTab('sale')}
                  className={`px-10 py-4 font-bold text-xs tracking-[0.2em] transition-all duration-300 uppercase ${activeTab === 'sale' ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:text-slate-900'}`}
                >
                  Vendita
                </button>
                <button
                  onClick={() => setActiveTab('rental')}
                  className={`px-10 py-4 font-bold text-xs tracking-[0.2em] transition-all duration-300 uppercase ${activeTab === 'rental' ? 'bg-orange-600 text-white shadow-xl' : 'text-slate-400 hover:text-slate-900'}`}
                >
                  Noleggio
                </button>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            key={activeTab}
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10"
          >
            {filteredMachines.map((machine) => (
              <motion.div key={machine.id} variants={fadeInUp}>
                <MachineCard machine={machine} />
              </motion.div>
            ))}
          </motion.div>

          <motion.div variants={fadeInUp} className="mt-16 text-center">
            <Link to={activeTab === 'sale' ? "/vendita" : "/noleggio"} className="inline-flex items-center gap-4 text-slate-900 font-black uppercase tracking-widest hover:text-orange-600 transition-colors group">
              Vedi tutto il catalogo
              <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 4. WHY CHOOSE US (SERVICES) */}
      <section className="py-32 bg-slate-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-slate-100/50 skew-x-12 translate-x-1/2"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInLeft}
              className="space-y-12"
            >
              <div>
                <span className="text-orange-600 font-bold text-xs uppercase tracking-[0.3em] mb-4 block">Vantaggio Strategico</span>
                <h2 className="text-5xl md:text-6xl font-black uppercase leading-[0.9] text-slate-900 tracking-tighter mb-8">
                  PERCHÉ SCEGLIERE <br />
                  <span className="text-orange-600">CONTE GROUP?</span>
                </h2>
                <p className="text-slate-500 text-lg max-w-md">
                  Offriamo soluzioni integrate che vanno oltre la semplice fornitura, diventando partner strategici per la crescita del tuo business.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-10">
                {[
                  { icon: ShieldCheck, title: 'Standard Qualitativi Elevati', desc: 'Ogni mezzo della nostra flotta è sottoposto a protocolli di manutenzione rigorosi per garantire la massima efficienza operativa.' },
                  { icon: Truck, title: 'Logistica Integrata', desc: 'Sistemi di trasporto dedicati per garantire la consegna e il ritiro dei mezzi nei tempi concordati, direttamente in situ.' },
                  { icon: Clock, title: 'Assistenza Tecnica 24/7', desc: 'Network di officine mobili pronte a intervenire tempestivamente per minimizzare i tempi di inattività del cantiere.' },
                ].map((feature, i) => (
                  <motion.div key={i} variants={fadeInUp} className="flex gap-8 group">
                    <div className="bg-slate-900 border-l-4 border-orange-600 p-5 shrink-0 h-fit transition-transform group-hover:scale-110 duration-300 shadow-xl">
                      <feature.icon className="text-white" size={28} />
                    </div>
                    <div>
                      <h4 className="text-xl font-extrabold text-slate-900 mb-2 uppercase tracking-tight">{feature.title}</h4>
                      <p className="text-slate-500 leading-relaxed text-sm font-medium">{feature.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInRight}
              className="relative"
            >
              <div className="relative z-10 border-[20px] border-white shadow-2xl">
                <img src="/images/service-technician.png" className="w-full grayscale hover:grayscale-0 transition-all duration-700" alt="Service Team" />
              </div>

              <div className="absolute -bottom-12 -left-12 bg-slate-900 text-white p-10 shadow-2xl z-20 hidden md:block">
                <div className="flex items-center gap-6">
                  <div className="p-4 bg-orange-600">
                    <Users size={40} className="text-white" />
                  </div>
                  <div>
                    <p className="text-3xl font-black tracking-tighter uppercase italic leading-none">Team Expertise</p>
                    <p className="text-xs font-bold text-orange-500 uppercase tracking-[0.2em] mt-2">Supporto Tecnico Specializzato</p>
                  </div>
                </div>
              </div>

              {/* Decorative background box */}
              <div className="absolute -top-12 -right-12 w-full h-full border-2 border-orange-600/20 -z-10"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 5. TESTIMONIALS */}
      <section className="py-32 bg-slate-950 text-white overflow-hidden relative border-t border-white/5">
        <div className="absolute inset-0 z-0">
          <img src="/images/excavator-action.png" className="w-full h-full object-cover opacity-10 grayscale" alt="Background" />
          <div className="absolute inset-0 bg-slate-950/80"></div>
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInLeft}
              className="max-w-2xl"
            >
              <span className="text-orange-600 font-bold text-xs uppercase tracking-[0.3em] mb-4 block">Feedback</span>
              <h2 className="text-4xl md:text-6xl font-black uppercase leading-tight tracking-tighter text-white">
                LA FIDUCIA DEI <br />
                <span className="text-orange-600">NOSTRI PARTNER</span>
              </h2>
            </motion.div>
            <motion.div variants={fadeInRight} className="hidden md:block">
              <HardHat size={120} className="text-white/5" />
            </motion.div>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-10"
          >
            {[
              { author: "Marco Rossi", company: "Costruzioni Generali srl", text: "Contegroup è diventato il nostro unico referente per il noleggio. Mezzi sempre nuovi e assistenza impeccabile." },
              { author: "Luca Bianchi", company: "Terra & Co.", text: "Ho acquistato un Caterpillar usato da loro. Macchina perfetta, sembrava nuova. Consulenza d'acquisto eccellente." },
              { author: "Elena Verdi", company: "Scavi e Urbanistica", text: "La rapidità con cui gestiscono i preventivi e la consegna in cantiere è ciò che fa la differenza." },
            ].map((t, i) => (
              <motion.div key={i} variants={fadeInUp} className="bg-slate-900/50 backdrop-blur-md p-10 border-l-4 border-orange-600 relative group hover:bg-slate-900 transition-all duration-500">
                <div className="absolute -top-4 -right-4 text-orange-600 opacity-20 group-hover:opacity-40 transition-opacity">
                  <Users size={60} />
                </div>
                <div className="flex gap-1 text-orange-500 mb-8">
                  {[...Array(5)].map((_, j) => <CheckCircle key={j} size={14} fill="currentColor" />)}
                </div>
                <p className="text-slate-300 text-lg italic mb-10 leading-relaxed font-medium">"{t.text}"</p>
                <div>
                  <p className="font-black text-xl text-white uppercase tracking-tight">{t.author}</p>
                  <p className="text-orange-600 text-xs font-bold uppercase tracking-[0.2em] mt-1">{t.company}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 6. CALL TO ACTION */}
      <section className="py-32 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="bg-slate-900 p-12 md:p-24 relative overflow-hidden flex flex-col items-center text-center group"
          >
            <div className="absolute inset-0 z-0 opacity-20 group-hover:opacity-30 transition-opacity duration-1000">
              <img src="/images/machinery-fleet.png" className="w-full h-full object-cover grayscale" alt="Fleet" />
            </div>

            <div className="relative z-10 max-w-4xl">
              <span className="text-orange-600 font-bold text-xs uppercase tracking-[0.4em] mb-8 block">Inizia Ora</span>
              <h2 className="text-4xl md:text-7xl font-black text-white uppercase italic leading-[0.9] mb-10 tracking-tighter">
                PRONTO A POTENZIARE IL <br />
                <span className="text-orange-600">TUO BUSINESS?</span>
              </h2>
              <p className="text-xl text-slate-400 font-medium mb-12 max-w-2xl mx-auto border-y border-white/10 py-8">
                Richiedi una consulenza tecnica gratuita. Il nostro team di esperti analizzerà le tue esigenze per offrirti la soluzione più efficiente.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link to="/contatti" className="bg-orange-600 text-white hover:bg-orange-700 px-12 py-6 font-bold text-lg transition-all shadow-2xl hover:shadow-orange-600/20">
                  RICHIEDI UN PREVENTIVO
                </Link>
                <a href="tel:+390823982162" className="bg-white text-slate-900 hover:bg-slate-100 px-12 py-6 font-bold text-lg transition-all shadow-xl">
                  CONTATTACI: 0823 982162
                </a>
              </div>
            </div>

            {/* Border glow decoration */}
            <div className="absolute bottom-0 left-0 w-full h-2 bg-orange-600"></div>
          </motion.div>
        </div>
      </section>

      {brandsBanner.position === 'before_footer' && <BrandsBanner />}
    </div>
  );
};

// Helper for consistency
import { HardHat } from 'lucide-react';

export default Home;
