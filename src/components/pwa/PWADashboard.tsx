import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';

export const PWADashboard: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 safe-area-inset">
            <h1 className="text-2xl font-bold mb-12 text-gray-800">Caricamento Rapido</h1>

            <button
                onClick={() => navigate('/admin/pwa/camera')}
                className="flex flex-col items-center justify-center w-64 h-64 bg-blue-600 rounded-full shadow-xl shadow-blue-600/30 active:scale-95 transition-all hover:bg-blue-700"
            >
                <Plus className="w-24 h-24 text-white mb-2" strokeWidth={1.5} />
                <span className="text-white text-xl font-bold tracking-wide">AGGIUNGI</span>
                <span className="text-white/80 text-sm font-medium">NUOVA MACCHINA</span>
            </button>

            <p className="mt-12 text-gray-400 text-center max-w-xs">
                Usa la fotocamera per caricare velocemente un nuovo mezzo dal piazzale.
            </p>
        </div>
    );
};
