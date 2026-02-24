
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Truck, Clock, Users, Maximize2 } from 'lucide-react';
import MachineCard from '../components/MachineCard';
import BrandsBanner from '../components/BrandsBanner';
import MachineCardStack from '../components/MachineCardStack';
import { useData, type Gallery } from '../context/DataContext';
import GalleryModal from '../components/GalleryModal';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
};

const fadeInRight = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
};

const fadeInLeft = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
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
  const { brandsBanner, galleries, services, excavators } = useData();
  const [activeTab, setActiveTab] = React.useState<'sale' | 'rental'>('sale');
  const [selectedGallery, setSelectedGallery] = React.useState<Gallery | null>(null);
  const [initialIndex, setInitialIndex] = React.useState(0);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const featuredGalleries = galleries.filter(g => g.showInHome);

  const openGallery = (gallery: Gallery, index: number) => {
    setSelectedGallery(gallery);
    setInitialIndex(index);
    setIsModalOpen(true);
  };

  const filteredMachines = excavators
    .filter(machine => {
      const isRental = activeTab === 'rental' && (machine.type === 'rental' || machine.type === 'rent');
      const isSale = activeTab === 'sale' && machine.type === 'sale';
      return (isSale || isRental || machine.type === 'both') && machine.available !== false;
    })
    .sort((a, b) => {
      const getTime = (t: any) => {
        if (!t) return 0;
        if (typeof t === 'number') return t;
        if (typeof t?.toMillis === 'function') return t.toMillis();
        if (t?.seconds) return t.seconds * 1000;
        return 0;
      };
      const timeA = getTime(a.createdAt);
      const timeB = getTime(b.createdAt);
      
      // If both have timestamps, sort by timestamp
      if (timeA > 0 && timeB > 0 && timeA !== timeB) return timeB - timeA;
      
      // If one has timestamp and other doesn't, prioritize the one with timestamp
      if (timeA > 0 && timeB === 0) return -1;
      if (timeA === 0 && timeB > 0) return 1;
      
      // Fallback to ID if valid number (for mock data)
      const idA = Number(a.id);
      const idB = Number(b.id);
      if (!isNaN(idA) && !isNaN(idB)) return idB - idA;
      
      // Final fallback to string comparison of IDs to ensure stability
      return String(b.id).localeCompare(String(a.id));
    })
    .slice(0, 8); // Increased from 4 to 8

  // If filteredMachines is empty, show nothing instead of crashing or showing empty space
  // or handle it gracefully


  return (
    <div className="pt-20">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-slate-950">
        <div className="absolute inset-0 z-0">
          <motion.img
            initial={{ scale: 1.05, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.6 }}
            transition={{ duration: 2, ease: "easeOut" }}
            src="/images/mulettiserie.jpg"
            className="w-full h-full object-cover"
            alt="Hero Muletti Serie"
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
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 min-h-[300px]"
          >
            {filteredMachines.length > 0 ? (
              filteredMachines.map((machine) => (
                <motion.div key={machine.id} variants={fadeInUp}>
                  <MachineCard machine={machine} />
                </motion.div>
              ))
            ) : (
              <div className="col-span-1 md:col-span-2 lg:col-span-4 flex flex-col items-center justify-center py-12 text-center bg-slate-50 rounded-[32px] border border-slate-100">
                <ShieldCheck size={48} className="text-slate-300 mb-4" />
                <h3 className="text-xl font-black text-slate-400 uppercase tracking-tight">Nessuna Macchina Disponibile</h3>
                <p className="text-slate-400 text-sm font-medium mt-2">Al momento non ci sono mezzi in questa categoria.</p>
              </div>
            )}
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
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-24 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInLeft}
              className="lg:col-span-2 space-y-12"
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
              className="relative lg:col-span-3"
            >
              <div className="relative z-10 border-[20px] border-white shadow-2xl">
                <img src="/images/percheconte.jpg" className="w-full transition-all duration-700 hover:scale-[1.02]" alt="Service Team" />
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

      {/* NEW: HOME SERVICES SECTION */}
      {services.filter(s => s.showInHome).length > 0 && (
        <section className="py-32 bg-white relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInLeft}
              className="mb-16"
            >
              <span className="text-orange-600 font-bold text-xs uppercase tracking-[0.3em] mb-4 block">Cosa Facciamo</span>
              <h2 className="text-4xl md:text-6xl font-black uppercase leading-tight tracking-tighter text-slate-900 italic">
                I NOSTRI <span className="text-orange-600">SERVIZI</span>
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.filter(s => s.showInHome).map((service, idx) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="group relative bg-slate-50 rounded-[32px] overflow-hidden border border-slate-100 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500"
                >
                  <div className="aspect-[16/10] overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  <div className="p-8">
                    <h3 className="text-2xl font-black text-slate-900 uppercase italic mb-4 group-hover:text-orange-600 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-slate-500 text-sm font-medium line-clamp-3 mb-6">
                      {service.description}
                    </p>
                    <Link
                      to="/servizi"
                      className="inline-flex items-center gap-2 text-slate-900 font-black text-xs uppercase tracking-widest hover:text-orange-600 transition-colors group/btn"
                    >
                      Dettagli Servizio
                      <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}



      {/* NEW: GALLERY CAROUSEL SECTION */}
      {featuredGalleries.length > 0 && (
        <section className="py-32 bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInLeft}
              className="mb-16"
            >
              <span className="text-orange-600 font-bold text-xs uppercase tracking-[0.3em] mb-4 block">Esperienza sul campo</span>
              <h2 className="text-4xl md:text-6xl font-black uppercase leading-tight tracking-tighter text-slate-900 italic">
                I NOSTRI <span className="text-orange-600">PROGETTI</span>
              </h2>
            </motion.div>

            <div className="space-y-24">
              {featuredGalleries.map((gallery) => (
                <div key={gallery.id} className="space-y-8">
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-l-4 border-orange-600 pl-8">
                    <div className="max-w-xl">
                      <h3 className="text-2xl font-black text-slate-900 uppercase italic mb-2">{gallery.title}</h3>
                      <p className="text-slate-500 font-medium text-sm leading-relaxed">{gallery.description}</p>
                    </div>
                    <Link to="/galleria" className="flex items-center gap-2 text-orange-600 font-black text-xs uppercase tracking-widest hover:translate-x-2 transition-transform whitespace-nowrap group">
                      Guarda tutta la galleria
                      <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                    </Link>
                  </div>

                  {/* Horizontal Scroll Carousel */}
                  <div className="relative group">
                    <motion.div
                      className="flex gap-4 overflow-x-auto pb-8 scrollbar-hide snap-x snap-mandatory px-4 md:px-0"
                      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                      {gallery.images?.map((img, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, scale: 0.9 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: idx * 0.1 }}
                          whileHover={{ y: -10 }}
                          className="flex-shrink-0 w-[300px] md:w-[450px] aspect-[16/10] bg-slate-100 rounded-[32px] overflow-hidden cursor-pointer shadow-xl shadow-slate-200/50 snap-center relative"
                          onClick={() => openGallery(gallery, idx)}
                        >
                          <img
                            src={img}
                            alt={`${gallery.title} ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                            <div className="bg-white/10 backdrop-blur-md rounded-full p-3 border border-white/20">
                              <Maximize2 className="text-white" size={20} />
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>

                    {/* Decorative Carousel Hint */}
                    <div className="flex items-center justify-center gap-2 text-slate-300 pointer-events-none mt-4">
                      <div className="h-[2px] w-12 bg-slate-100"></div>
                      <span className="text-[10px] font-black uppercase tracking-[0.2em]">Sfoglia Foto</span>
                      <div className="h-[2px] w-12 bg-slate-100"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {selectedGallery && (
        <GalleryModal
          images={selectedGallery.images}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          initialIndex={initialIndex}
        />
      )}

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
              <span className="text-orange-600 font-bold text-xs uppercase tracking-[0.4em] mb-8 block">Contattaci Subito</span>
              <h2 className="text-4xl md:text-7xl font-black text-white uppercase italic leading-[0.9] mb-10 tracking-tighter">
                TROVIAMO IL MEZZO ADATTO <br />
                <span className="text-orange-600">AL TUO LAVORO</span>
              </h2>
              <p className="text-xl text-slate-400 font-medium mb-12 max-w-2xl mx-auto border-y border-white/10 py-8">
                Devi acquistare o noleggiare un macchinario? Ti aiutiamo a scegliere la soluzione migliore per la tua attività, con preventivi chiari e veloci.
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

export default Home;
