
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, ShieldCheck, Truck, Clock, Award, Users } from 'lucide-react';
import { MACHINES_DATA } from '../constants';
import MachineCard from '../components/MachineCard';
import BrandsBanner from '../components/BrandsBanner';
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
      <section className="relative h-[90vh] flex items-center overflow-hidden bg-black">
        <div className="absolute inset-0 z-0">
          <motion.img
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            src="/images/hero-excavator.png"
            className="w-full h-full object-cover"
            alt="Hero Excavator"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="max-w-3xl"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.h1
              variants={fadeInRight}
              className="text-6xl md:text-8xl font-black text-white leading-none tracking-tighter mb-6 uppercase italic"
            >
              IL PARTNER IDEALE PER IL <span className="text-orange-500">TUO CANTIERE</span>
            </motion.h1>
            <motion.p
              variants={fadeInLeft}
              className="text-xl text-zinc-300 mb-10 leading-relaxed font-light"
            >
              Vendita, noleggio e assistenza di carrelli elevatori e macchine movimento terra. La nostra esperienza di oltre 40 anni al servizio della tua produttività.
            </motion.p>
            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link to="/vendita" className="group bg-orange-600 hover:bg-orange-700 text-black px-8 py-4 rounded font-bold text-lg flex items-center justify-center gap-2 transition-all">
                SCOPRI LA VENDITA
                <ArrowRight className="group-hover:translate-x-2 transition-transform" />
              </Link>
              <Link to="/noleggio" className="group border-2 border-white hover:bg-white hover:text-black text-white px-8 py-4 rounded font-bold text-lg flex items-center justify-center gap-2 transition-all">
                ESPLORA IL NOLEGGIO
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {brandsBanner.position === 'after_hero' && <BrandsBanner />}

      {/* 2. STATS SECTION */}
      <section className="py-20 bg-zinc-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src="/images/contact-header.png" className="w-full h-full object-cover grayscale" alt="Background" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center"
          >
            {[
              { label: 'Anni di Esperienza', value: '40+' },
              { label: 'Macchine in Flotta', value: '500+' },
              { label: 'Clienti Attivi', value: '1000+' },
              { label: 'Sede in Campania', value: '1' },
            ].map((stat, i) => (
              <motion.div key={i} variants={fadeInUp} className="space-y-2 border-l-2 border-orange-600 pl-8 text-left">
                <p className="text-5xl font-black text-white">{stat.value}</p>
                <p className="text-zinc-500 uppercase tracking-widest text-xs font-bold">{stat.label}</p>
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
            className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4"
          >
            <motion.div variants={fadeInLeft}>
              <h2 className="text-4xl md:text-6xl font-black uppercase italic leading-none mb-4">
                SCOPRI IL <span className="text-orange-600 underline decoration-black decoration-4">NOSTRO PARCO MACCHINE</span>
              </h2>
              <p className="text-zinc-500 max-w-xl">Le migliori soluzioni per il tuo business, selezionate e garantite dai nostri consulenti.</p>
            </motion.div>
            <motion.div variants={fadeInRight}>
              <div className="bg-zinc-100 p-1 rounded-xl flex gap-1 relative border border-zinc-200 shadow-sm">
                <button
                  onClick={() => setActiveTab('sale')}
                  className={`relative z-10 px-8 py-3 rounded-lg font-bold text-sm tracking-widest transition-colors ${activeTab === 'sale' ? 'text-white' : 'text-zinc-500'}`}
                >
                  VENDITA
                  {activeTab === 'sale' && (
                    <motion.div
                      layoutId="tab-underline"
                      className="absolute inset-0 bg-orange-600 rounded-lg -z-10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('rental')}
                  className={`relative z-10 px-8 py-3 rounded-lg font-bold text-sm tracking-widest transition-colors ${activeTab === 'rental' ? 'text-white' : 'text-zinc-500'}`}
                >
                  NOLEGGIO
                  {activeTab === 'rental' && (
                    <motion.div
                      layoutId="tab-underline"
                      className="absolute inset-0 bg-orange-600 rounded-lg -z-10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            key={activeTab}
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {filteredMachines.map((machine) => (
              <motion.div key={machine.id} variants={fadeInUp}>
                <MachineCard machine={machine} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 4. WHY CHOOSE US (SERVICES) */}
      <section className="py-24 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInRight}
              className="relative"
            >
              <img src="/images/service-technician.png" className="rounded-2xl shadow-2xl" alt="Service Team" />
              <div className="absolute -bottom-8 -right-8 bg-orange-600 text-black p-8 rounded-2xl shadow-2xl hidden md:block">
                <Users size={48} className="mb-4" />
                <p className="text-2xl font-black italic">Team di Esperti</p>
                <p className="text-sm font-bold opacity-80 uppercase tracking-widest">Al tuo servizio H24</p>
              </div>
            </motion.div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="space-y-12"
            >
              <motion.h2 variants={fadeInLeft} className="text-5xl font-black uppercase italic leading-none">
                Perché scegliere <br />
                <span className="text-orange-600 italic">Contegroup?</span>
              </motion.h2>
              <div className="space-y-8">
                {[
                  { icon: ShieldCheck, title: 'Usato Certificato e Garantito', desc: 'Ogni macchina usata è sottoposta a rigorosi controlli e viene consegnata con garanzia.' },
                  { icon: Truck, title: 'Consegna in Cantiere', desc: 'Organizziamo la consegna rapida della macchina direttamente presso il vostro cantiere.' },
                  { icon: Clock, title: 'Assistenza Specializzata', desc: 'Le nostre officine mobili intervengono a domicilio per ridurre al minimo i tempi di fermo.' },
                ].map((feature, i) => (
                  <motion.div key={i} variants={fadeInUp} className="flex gap-6">
                    <div className="bg-black p-4 rounded-xl shrink-0 h-fit">
                      <feature.icon className="text-orange-500" size={32} />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-2">{feature.title}</h4>
                      <p className="text-zinc-500 leading-relaxed">{feature.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 5. TESTIMONIALS */}
      <section className="py-24 bg-zinc-950 text-white overflow-hidden relative">
        <div className="absolute inset-0 z-0">
          <img src="/images/excavator-action.png" className="w-full h-full object-cover opacity-20 fixed-effect" alt="Background" style={{ backgroundAttachment: 'fixed' }} />
          <div className="absolute inset-0 bg-zinc-950/90"></div>
        </div>
        <div className="absolute top-0 right-0 opacity-10 pointer-events-none z-10">
          <HardHat size={500} className="text-orange-600" />
        </div>
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="text-4xl md:text-5xl font-black uppercase italic mb-4"
            >
              Cosa dicono i nostri <span className="text-orange-600">Clienti</span>
            </motion.h2>
          </div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              { author: "Marco Rossi", company: "Costruzioni Generali srl", text: "Contegroup è diventato il nostro unico referente per il noleggio. Mezzi sempre nuovi e assistenza impeccabile." },
              { author: "Luca Bianchi", company: "Terra & Co.", text: "Ho acquistato un Caterpillar usato da loro. Macchina perfetta, sembrava nuova. Consulenza d'acquisto eccellente." },
              { author: "Elena Verdi", company: "Scavi e Urbanistica", text: "La rapidità con cui gestiscono i preventivi e la consegna in cantiere è ciò che fa la differenza." },
            ].map((t, i) => (
              <motion.div key={i} variants={fadeInUp} className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800 hover:border-orange-600 transition-colors">
                <div className="flex gap-1 text-orange-500 mb-6">
                  {[...Array(5)].map((_, j) => <CheckCircle key={j} size={16} fill="currentColor" />)}
                </div>
                <p className="text-zinc-300 italic mb-8 leading-relaxed">"{t.text}"</p>
                <div>
                  <p className="font-bold text-lg">{t.author}</p>
                  <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">{t.company}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 6. CALL TO ACTION */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="bg-orange-600 rounded-3xl p-12 md:p-20 relative overflow-hidden flex flex-col items-center text-center group"
          >
            <div className="absolute inset-0 z-0">
              <img src="/images/machinery-fleet.png" className="w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity duration-700 mix-blend-multiply" alt="Fleet" />
            </div>
            <div className="absolute inset-0 opacity-10 pointer-events-none z-10">
              <div className="absolute -top-10 -left-10 w-64 h-64 bg-black rounded-full blur-3xl"></div>
              <div className="absolute -bottom-10 -right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
            </div>
            <h2 className="text-4xl md:text-7xl font-black text-black uppercase italic leading-none mb-8 relative z-10">
              PRONTO A POTENZIARE IL <br /> <span className="underline decoration-white decoration-4 underline-offset-8">TUO CANTIERE?</span>
            </h2>
            <p className="text-xl text-black font-medium mb-10 max-w-2xl relative z-10">
              Contattaci oggi per una consulenza gratuita. Il nostro team ti aiuterà a trovare la soluzione perfetta per le tue esigenze.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 relative z-10">
              <Link to="/contatti" className="bg-black text-white hover:bg-zinc-900 px-10 py-5 rounded-full font-black text-xl transition-all shadow-2xl">
                RICHIEDI UN PREVENTIVO
              </Link>
              <a href="tel:+390823982162" className="bg-white text-black hover:bg-zinc-100 px-10 py-5 rounded-full font-black text-xl transition-all shadow-xl">
                CHIAMA ORA: 0823 982162
              </a>
            </div>
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
