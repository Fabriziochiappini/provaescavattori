import React from 'react';

const PrivacyPolicy = () => {
    return (
        <div className="pt-40 pb-24 max-w-4xl mx-auto px-6">
            <h1 className="text-5xl md:text-7xl font-black uppercase italic mb-12">PRIVACY <span className="text-orange-600">POLICY</span></h1>
            <div className="prose prose-zinc prose-invert max-w-none space-y-8 text-zinc-400">
                <section>
                    <h2 className="text-2xl font-bold text-white uppercase italic">1. Informazioni Generali</h2>
                    <p>La presente Privacy Policy descrive le modalità di gestione del sito in riferimento al trattamento dei dati personali degli utenti che lo consultano. Venus SRL (Conte Group), con sede in Pietravairano (CE), si impegna a proteggere la privacy dei propri utenti.</p>
                </section>
                <section>
                    <h2 className="text-2xl font-bold text-white uppercase italic">2. Titolare del Trattamento</h2>
                    <p>Il titolare del trattamento è Venus SRL, con sede legale in Pietravairano. Per qualsiasi interazione relativa ai propri dati, è possibile scrivere a info@contegroup.com.</p>
                </section>
                <section>
                    <h2 className="text-2xl font-bold text-white uppercase italic">3. Tipi di Dati Trattati</h2>
                    <p>Dati di navigazione: i sistemi informatici e le procedure software preposte al funzionamento di questo sito acquisiscono, nel corso del loro normale esercizio, alcuni dati personali la cui trasmissione è implicita nell'uso dei protocolli di comunicazione di Internet.</p>
                </section>
                <section>
                    <h2 className="text-2xl font-bold text-white uppercase italic">4. Finalità del Trattamento</h2>
                    <p>I dati sono trattati per finalità connesse all'erogazione dei servizi richiesti dall'utente (es. assistenza, vendita, noleggio) e per finalità statistiche aggregate.</p>
                </section>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
