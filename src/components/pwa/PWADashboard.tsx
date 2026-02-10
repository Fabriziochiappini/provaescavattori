import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Download, Smartphone } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { InstallBanner } from './InstallBanner';

export const PWADashboard: React.FC = () => {
    const navigate = useNavigate();
    const { install, canInstall, isInstalled } = usePWAInstall();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 p-6 safe-area-inset font-sans">
            <InstallBanner />

            <h1 className="text-3xl font-black mb-12 text-zinc-900 tracking-tighter uppercase">Operations</h1>

            <div className="flex flex-col items-center gap-8">
                <button
                    onClick={() => navigate('/admin/pwa/camera')}
                    className="group relative flex flex-col items-center justify-center w-64 h-64 bg-zinc-900 rounded-[3rem] shadow-2xl active:scale-95 transition-all"
                >
                    <div className="absolute inset-0 bg-amber-500 rounded-[3rem] opacity-0 group-hover:opacity-10 group-active:opacity-20 transition-opacity" />
                    <Plus className="w-24 h-24 text-amber-500 mb-2 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                    <span className="text-white text-xl font-black tracking-widest uppercase">Aggiungi</span>
                    <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-1">Nuova Macchina</span>
                </button>

                {/* Manual Install Button - "FISSO" if possible to install */}
                {canInstall && !isInstalled && (
                    <button
                        onClick={install}
                        className="flex items-center gap-3 bg-white border-2 border-amber-500 text-amber-600 px-8 py-4 rounded-3xl font-black text-sm uppercase tracking-widest shadow-xl shadow-amber-500/10 active:scale-95 transition-all animate-bounce mt-4"
                    >
                        <Download className="w-6 h-6" />
                        Installa App Pro
                    </button>
                )}

                {isInstalled && (
                    <div className="flex items-center gap-2 text-zinc-400 bg-white px-6 py-2 rounded-full border border-zinc-100 text-[10px] font-bold uppercase tracking-widest shadow-sm">
                        <Smartphone className="w-3 h-3 text-green-500" />
                        App Installata correttamente
                    </div>
                )}
            </div>

            <p className="mt-16 text-zinc-400 text-center max-w-xs text-xs font-medium uppercase tracking-widest leading-relaxed opacity-60">
                Client: Conte Group Admin<br />
                System: Fast Upload v2.0
            </p>
        </div>
    );
};
