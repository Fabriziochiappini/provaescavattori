
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, HelpCircle } from 'lucide-react';

const faqData = [
  {
    category: "Domande Generali",
    items: [
      { q: "Quali sono i principali servizi offerti da Conte Group?", a: "Conte Group (Venus S.r.l.) è specializzata in tre aree principali: vendita di macchine movimento terra e carrelli elevatori (nuovi e usati garantiti), noleggio a breve e lungo termine, e assistenza tecnica specializzata con officine mobili e un vasto magazzino ricambi." },
      { q: "Dove si trova la vostra sede?", a: "La nostra sede operativa e il nostro showroom si trovano in Via Campo di Santo, 38 - Pietravairano (CE). Siamo un punto di riferimento per tutta la Campania." },
      { q: "Quali sono i vostri orari di apertura?", a: "Siamo aperti dal Lunedì al Sabato, dalle 08:30 alle 18:30. Per emergenze e richieste di assistenza urgenti, è attivo un numero dedicato." },
      { q: "Quali marchi trattate?", a: "Siamo orgogliosi di trattare alcuni dei migliori marchi del settore per garantire affidabilità e performance, tra cui Linde, Cesab, Merlo, JLG, Genie e molti altri. Contattaci per verificare la disponibilità di un marchio o modello specifico." }
    ]
  },
  {
    category: "Noleggio",
    items: [
      { q: "Qual è la durata minima per il noleggio di una macchina?", a: "Offriamo la massima flessibilità. È possibile noleggiare le nostre macchine a partire da un solo giorno (noleggio a breve termine) fino a soluzioni pluriennali (noleggio a lungo termine) studiate su misura per le esigenze del tuo cantiere." },
      { q: "L'assistenza tecnica è inclusa nel costo del noleggio?", a: "Sì, tutte le nostre soluzioni di noleggio includono un servizio di assistenza tecnica completo. In caso di guasto o fermo macchina, le nostre officine mobili interverranno direttamente in cantiere per risolvere il problema nel minor tempo possibile." },
      { q: "Effettuate la consegna delle macchine direttamente in cantiere?", a: "Certamente. Offriamo un servizio di trasporto e consegna rapida in tutta la Campania. Concordiamo insieme a te giorno e ora per farti trovare la macchina pronta all'uso quando ne hai bisogno." },
      { q: "Cosa succede se la macchina che ho noleggiato si guasta?", a: "Non devi preoccuparti di nulla. Contatta il nostro numero dedicato all'assistenza e un nostro tecnico specializzato interverrà per riparare il guasto. Se la riparazione dovesse richiedere più tempo, valuteremo insieme la sostituzione temporanea del mezzo per non interrompere la tua operatività." }
    ]
  },
  {
    category: "Vendita",
    items: [
      { q: "Le macchine usate che vendete sono coperte da garanzia?", a: "Sì, ogni singola macchina usata nel nostro catalogo è sottoposta a un rigoroso processo di revisione e controllo da parte dei nostri tecnici. Tutti i nostri mezzi usati sono certificati e coperti da garanzia per darti la massima tranquillità." },
      { q: "È possibile permutare il mio vecchio macchinario?", a: "Sì, offriamo un servizio di valutazione e permuta del tuo usato. Contattaci per fissare un appuntamento e ricevere una valutazione senza impegno del tuo macchinario." },
      { q: "Offrite soluzioni di finanziamento per l'acquisto?", a: "Collaboriamo con diverse società finanziarie per offrire soluzioni di acquisto personalizzate, come leasing o finanziamenti. Il nostro team commerciale è a tua disposizione per trovare la formula più adatta alle tue esigenze." }
    ]
  },
  {
    category: "Assistenza Tecnica",
    items: [
      { q: "Offrite un servizio di assistenza direttamente presso la mia sede o il mio cantiere?", a: "Assolutamente sì. Il nostro punto di forza è il servizio di assistenza a domicilio. Disponiamo di officine mobili completamente attrezzate per effettuare diagnosi e riparazioni direttamente dove ti trovi, riducendo al minimo i costi e i tempi di fermo macchina." },
      { q: "In caso di emergenza, quali sono i vostri tempi di intervento?", a: "Sappiamo quanto sia importante la continuità del tuo lavoro. Per questo, abbiamo un numero di pronto intervento (+39 0823 982162) e garantiamo la massima rapidità nell'organizzare l'uscita di un nostro tecnico." },
      { q: "Vendete anche pezzi di ricambio?", a: "Sì, abbiamo un magazzino fornito con un'ampia gamma di ricambi originali e compatibili per la maggior parte dei marchi e modelli sul mercato. Se un pezzo non è immediatamente disponibile, siamo in grado di reperirlo in tempi molto brevi." }
    ]
  }
];

const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  const toggleFAQ = (categoryIndex: number, itemIndex: number) => {
    const key = `${categoryIndex}-${itemIndex}`;
    setOpenIndex(openIndex === key ? null : key);
  };

  return (
    <section className="py-24 bg-zinc-50 border-t border-zinc-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-orange-600 font-bold text-xs uppercase tracking-[0.3em] mb-4 block">Supporto</span>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 uppercase italic tracking-tighter mb-6">
            DOMANDE <span className="text-orange-600">FREQUENTI</span>
          </h2>
          <div className="w-24 h-2 bg-orange-600 mx-auto rounded-full"></div>
        </div>

        <div className="space-y-12">
          {faqData.map((section, catIdx) => (
            <div key={catIdx} className="space-y-6">
              <h3 className="text-2xl font-black text-slate-800 uppercase italic border-l-4 border-orange-600 pl-4">
                {section.category}
              </h3>
              <div className="space-y-4">
                {section.items.map((item, itemIdx) => {
                  const isOpen = openIndex === `${catIdx}-${itemIdx}`;
                  return (
                    <motion.div 
                      key={itemIdx} 
                      className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                      initial={false}
                    >
                      <button
                        onClick={() => toggleFAQ(catIdx, itemIdx)}
                        className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                      >
                        <span className={`font-bold text-lg ${isOpen ? 'text-orange-600' : 'text-slate-800'}`}>
                          {item.q}
                        </span>
                        <div className={`p-2 rounded-full transition-colors ${isOpen ? 'bg-orange-100 text-orange-600' : 'bg-slate-50 text-slate-400'}`}>
                          {isOpen ? <Minus size={20} /> : <Plus size={20} />}
                        </div>
                      </button>
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                          >
                            <div className="px-6 pb-6 text-slate-600 leading-relaxed font-medium">
                              {item.a}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
