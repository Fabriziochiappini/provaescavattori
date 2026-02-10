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
            <div className="flex flex-col items-center justify-center h-screen bg-green-50 p-4">
                <div className="bg-white p-8 rounded-full shadow-lg mb-6">
                    <CheckCircle className="w-16 h-16 text-green-500" strokeWidth={3} />
                </div>
                <h2 className="text-2xl font-bold text-green-700 mb-2">Macchina Pubblicata!</h2>
                <p className="text-green-600 text-center">Il veicolo è stato aggiunto al catalogo correttamente.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <div className="p-4 border-b bg-white safe-area-top sticky top-0 z-10">
                <h2 className="text-xl font-bold text-gray-800">Dettagli Essenziali</h2>
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
                            className="w-full p-4 rounded-xl border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-lg bg-white"
                            value={formData.brand}
                            onChange={e => setFormData({ ...formData, brand: e.target.value })}
                            placeholder="Es. Caterpillar"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Modello</label>
                        <input
                            type="text"
                            required
                            className="w-full p-4 rounded-xl border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-lg bg-white"
                            value={formData.model}
                            onChange={e => setFormData({ ...formData, model: e.target.value })}
                            placeholder="Es. 320D"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Tipo</label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, type: 'sale' })}
                                className={`p-4 rounded-xl text-center font-bold transition-all ${formData.type === 'sale'
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                                    : 'bg-white text-gray-500 border border-gray-200'
                                    }`}
                            >
                                VENDITA
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, type: 'rental' })}
                                className={`p-4 rounded-xl text-center font-bold transition-all ${formData.type === 'rental'
                                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                                    : 'bg-white text-gray-500 border border-gray-200'
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
                            className="w-full p-4 rounded-xl border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-lg bg-white"
                            value={formData.price}
                            onChange={e => setFormData({ ...formData, price: e.target.value })}
                            placeholder="0"
                        />
                    </div>
                </form>
            </div>

            <div className="p-4 border-t bg-white safe-area-bottom fixed bottom-0 left-0 right-0">
                <button
                    onClick={handleSubmit} // Trigger form submit externally
                    disabled={isUploading}
                    className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 disabled:opacity-50 shadow-lg shadow-blue-600/20 active:scale-98 transition-all"
                >
                    {isUploading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            PUBBLICAZIONE IN CORSO...
                        </>
                    ) : (
                        'PUBBLICA MACCHINA'
                    )}
                </button>
            </div>
        </div>
    );
};
