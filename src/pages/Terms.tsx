import React from 'react';

const Terms = () => {
    return (
        <div className="pt-40 pb-24 max-w-4xl mx-auto px-6">
            <h1 className="text-5xl md:text-7xl font-black uppercase italic mb-12">TERMINI E <span className="text-orange-600">CONDIZIONI</span></h1>
            <div className="prose prose-zinc max-w-none space-y-8 text-zinc-600">
                <section>
                    <h2 className="text-2xl font-bold text-secondary uppercase italic">1. Accettazione dei Termini</h2>
                    <p>L'accesso e l'utilizzo del sito web di Conte Group sono soggetti ai seguenti Termini e Condizioni. Utilizzando il sito, l'utente accetta integralmente tali termini.</p>
                </section>
                <section>
                    <h2 className="text-2xl font-bold text-secondary uppercase italic">2. Utilizzo del Sito</h2>
                    <p>I contenuti del sito sono protetti da copyright e sono di proprietà di Venus SRL. È vietata la riproduzione non autorizzata di testi e immagini.</p>
                </section>
                <section>
                    <h2 className="text-2xl font-bold text-secondary uppercase italic">3. Responsabilità</h2>
                    <p>Conte Group non si assume alcuna responsabilità per eventuali danni derivanti dall'utilizzo del sito o dei contenuti in esso presenti.</p>
                </section>
            </div>
        </div>
    );
};

export default Terms;
