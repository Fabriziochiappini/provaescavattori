import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

export const InstallBanner: React.FC = () => {
    const { install, canInstall, isInstalled } = usePWAInstall();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Show banner if we can install and it's not already installed
        // And if the user hasn't dismissed it in this session (optional, let's keep it persistent if user wanted it "fissa")
        if (canInstall && !isInstalled) {
            const hasDismissed = sessionStorage.getItem('pwa-banner-dismissed');
            if (!hasDismissed) {
                const timer = setTimeout(() => setIsVisible(true), 2000);
                return () => clearTimeout(timer);
            }
        }
    }, [canInstall, isInstalled]);

    const handleDismiss = () => {
        setIsVisible(false);
        sessionStorage.setItem('pwa-banner-dismissed', 'true');
    };

    const handleInstall = async () => {
        const success = await install();
        if (success) {
            setIsVisible(false);
        }
    };

    if (!isVisible || isInstalled) return null;

    return (
        <div className="fixed bottom-6 left-4 right-4 z-[100] animate-in slide-in-from-bottom duration-500">
            <div className="bg-zinc-900 border border-white/10 rounded-3xl p-5 shadow-2xl flex items-center gap-4 backdrop-blur-xl bg-zinc-900/90">
                <div className="w-14 h-14 rounded-2xl bg-amber-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-amber-500/20">
                    <Download className="w-8 h-8 text-black" />
                </div>

                <div className="flex-1 min-w-0">
                    <h3 className="text-white font-black text-sm uppercase tracking-wider mb-0.5">App Conte Group</h3>
                    <p className="text-zinc-400 text-xs leading-tight">Installa l'app per caricare le macchine più velocemente!</p>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={handleInstall}
                        className="bg-amber-500 text-black px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-tighter active:scale-95 transition-all shadow-lg shadow-amber-500/10"
                    >
                        Installa
                    </button>
                    <button
                        onClick={handleDismiss}
                        className="p-2 text-zinc-500 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Visual Hint for iOS (Manual Install) */}
            {/iPhone|iPad|iPod/.test(navigator.userAgent) && (
                <div className="mt-2 text-center">
                    <p className="text-[10px] text-zinc-500 italic flex items-center justify-center gap-1">
                        Clicca <Smartphone className="w-3 h-3" /> Condividi e "Aggiungi a Home"
                    </p>
                </div>
            )}
        </div>
    );
};
