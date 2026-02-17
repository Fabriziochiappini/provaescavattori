import React from 'react';
import { useData } from '../context/DataContext';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Services: React.FC = () => {
    const { services } = useData();

    return (
        <div className="min-h-screen pt-24 pb-20 bg-white">
            {/* Hero Section */}
            <section className="relative py-20 overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-amber-500/5 -skew-x-12 translate-x-1/2"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="max-w-3xl"
                    >
                        <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter uppercase italic leading-[0.9]">
                            I Nostri <span className="text-amber-500">Servizi</span>
                        </h1>
                        <p className="mt-6 text-xl text-slate-600 font-medium leading-relaxed">
                            Offriamo soluzioni complete per il mondo del movimento terra e dell'edilizia,
                            combinando tecnologia all'avanguardia con decenni di esperienza nel settore.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Services List */}
            <section className="space-y-32 md:space-y-48 pb-20">
                {services.map((service, index) => (
                    <div key={service.id} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className={`flex flex-col md:flex-row items-center gap-12 md:gap-24 ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                            {/* Image Part */}
                            <motion.div
                                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                className="flex-1 w-full"
                            >
                                <div className="relative group">
                                    <div className="absolute -inset-4 bg-amber-500/10 rounded-[40px] scale-95 group-hover:scale-100 transition-transform duration-700"></div>
                                    <div className="relative aspect-[4/3] overflow-hidden rounded-[32px] shadow-2xl">
                                        <img
                                            src={service.image}
                                            alt={service.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent"></div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Text Part */}
                            <motion.div
                                initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                className="flex-1 space-y-8"
                            >
                                <div>
                                    <span className="text-amber-500 font-black text-sm uppercase tracking-[0.3em] mb-4 block">
                                        Servizio {String(index + 1).padStart(2, '0')}
                                    </span>
                                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 uppercase italic tracking-tighter leading-none mb-6">
                                        {service.title}
                                    </h2>
                                    <p className="text-lg text-slate-600 leading-relaxed font-medium">
                                        {service.description}
                                    </p>
                                </div>

                                {service.bulletPoints && service.bulletPoints.length > 0 && (
                                    <ul className="grid sm:grid-cols-1 gap-4">
                                        {service.bulletPoints.map((point, i) => (
                                            <li key={i} className="flex items-start gap-3 group">
                                                <div className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-amber-500/10 flex items-center justify-center group-hover:bg-amber-500 transition-colors">
                                                    <CheckCircle2 size={14} className="text-amber-500 group-hover:text-white transition-colors" />
                                                </div>
                                                <span className="text-slate-700 font-bold uppercase text-sm tracking-tight">{point}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}

                                <div className="pt-4">
                                    <button className="flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-amber-500 transition-all group active:scale-95">
                                        Richiedi Maggiori Info <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                ))}
            </section>

            {/* CTA Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
                <div className="bg-amber-500 rounded-[48px] p-12 md:p-20 relative overflow-hidden text-center shadow-2xl shadow-amber-500/30">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                    <div className="relative z-10 max-w-3xl mx-auto space-y-8">
                        <h2 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter leading-tight">
                            Hai bisogno di un supporto personalizzato?
                        </h2>
                        <p className="text-white/90 text-xl font-bold uppercase tracking-wide">
                            Contatta il nostro team di esperti per una consulenza su misura.
                        </p>
                        <div className="pt-4">
                            <a
                                href="/contatti"
                                className="inline-block px-12 py-5 bg-white text-amber-500 rounded-3xl font-black uppercase tracking-[0.2em] text-sm hover:bg-slate-900 hover:text-white transition-all shadow-xl active:scale-95"
                            >
                                Parla con noi
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Services;
