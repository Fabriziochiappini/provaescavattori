import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { uploadMachine } from '../../services/pwaUpload';
import { clearPhotos } from '../../services/pwaStorage';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

export const SimpleDetailsForm: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const orderedIds = location.state?.orderedIds as string[] || [];

    const [formData, setFormData] = useState({
        model: '',
        brand: '',
        type: 'sale' as 'sale' | 'rental',
        price: '',
    });

    const [isUploading, setIsUploading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUploading(true);
        setError(null);

        try {
            await uploadMachine({
                ...formData,
                price: Number(formData.price),
            }, orderedIds);

            await clearPhotos();
            setIsSuccess(true);
            setTimeout(() => {
                navigate('/admin/pwa');
            }, 2000);
        } catch (err) {
            console.error(err);
            setError('Errore durante il caricamento. Riprova.');
            setIsUploading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-white p-4">
                <div className="bg-green-500 p-6 rounded-full shadow-2xl shadow-green-500/40 mb-8 animate-in zoom-in spin-in-12 duration-700">
                    <CheckCircle className="w-16 h-16 text-white" strokeWidth={3} />
                </div>
                <h2 className="text-3xl font-black text-zinc-900 mb-2 uppercase tracking-tight">Fatto!</h2>
                <p className="text-zinc-500 text-center font-medium">Macchina caricata con successo.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <div className="p-6 border-b bg-white/80 backdrop-blur-md safe-area-top sticky top-0 z-20 flex items-center gap-4">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-zinc-400">
                    <AlertCircle className="w-6 h-6 rotate-180" />
                </button>
                <h2 className="text-xl font-black text-zinc-900 uppercase tracking-tight">Dati Macchina</h2>
            </div>

            <div className="flex-1 p-4 pb-32"> {/* Padding bottom for fixed button */}
                {error && (
                    <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-6 flex items-center gap-3 border border-red-100">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <p>{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Marca</label>
                        <input
                            type="text"
                            required
                            className="w-full p-5 rounded-2xl border-2 border-zinc-100 bg-zinc-50 focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all text-lg font-medium placeholder:text-zinc-300 outline-none"
                            value={formData.brand}
                            onChange={e => setFormData({ ...formData, brand: e.target.value })}
                            placeholder="es. Caterpillar"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Modello</label>
                        <input
                            type="text"
                            required
                            className="w-full p-5 rounded-2xl border-2 border-zinc-100 bg-zinc-50 focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all text-lg font-medium placeholder:text-zinc-300 outline-none"
                            value={formData.model}
                            onChange={e => setFormData({ ...formData, model: e.target.value })}
                            placeholder="es. 320D"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Tipo</label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, type: 'sale' })}
                                className={`p-4 rounded-xl text-center font-bold transition-all ${formData.type === 'sale'
                                    ? 'bg-amber-500 text-white shadow-xl shadow-amber-500/30'
                                    : 'bg-zinc-100 text-zinc-400 outline-none'
                                    }`}
                            >
                                VENDITA
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, type: 'rental' })}
                                className={`p-5 rounded-2xl text-center font-black transition-all ${formData.type === 'rental'
                                    ? 'bg-zinc-900 text-white shadow-xl shadow-zinc-900/30'
                                    : 'bg-zinc-100 text-zinc-400 outline-none'
                                    }`}
                            >
                                NOLEGGIO
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Prezzo (€)</label>
                        <input
                            type="number"
                            required
                            className="w-full p-5 rounded-2xl border-2 border-zinc-100 bg-zinc-50 focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all text-lg font-medium placeholder:text-zinc-300 outline-none"
                            value={formData.price}
                            onChange={e => setFormData({ ...formData, price: e.target.value })}
                            placeholder="0.00"
                        />
                    </div>
                </form>
            </div>

            <div className="p-6 bg-white safe-area-bottom fixed bottom-0 left-0 right-0 shadow-[0_-8px_30px_rgb(0,0,0,0.04)] z-20">
                <button
                    onClick={handleSubmit}
                    disabled={isUploading}
                    className="w-full bg-amber-500 text-black py-5 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-amber-600 disabled:opacity-50 shadow-xl shadow-amber-500/20 active:scale-95 transition-all text-lg uppercase tracking-tight"
                >
                    {isUploading ? (
                        <>
                            <Loader2 className="w-6 h-6 animate-spin" />
                            CARICAMENTO...
                        </>
                    ) : (
                        <>
                            <CheckCircle className="w-6 h-6" />
                            PUBBLICA ORA
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};
