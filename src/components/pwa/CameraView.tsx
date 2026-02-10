import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, X } from 'lucide-react';
import { savePhoto } from '../../services/pwaStorage';


export const CameraView: React.FC = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [photosTaken, setPhotosTaken] = useState<number>(0);
    const [showFlash, setShowFlash] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        startCamera();
        return () => stopCamera();
    }, []);

    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' },
                audio: false,
            });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        } catch (err) {
            console.error('Error accessing camera:', err);
            // Fallback or alert specific to permission denial
            // alert('Impossibile accedere alla fotocamera. Verifica i permessi.');
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach((track) => track.stop());
            setStream(null);
        }
    };

    const takePhoto = async () => {
        if (videoRef.current) {
            const canvas = document.createElement('canvas');
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(videoRef.current, 0, 0);

                canvas.toBlob(async (blob) => {
                    if (blob) {
                        // Visual feedback: Flash
                        setShowFlash(true);
                        setTimeout(() => setShowFlash(false), 150);

                        // Tactile feedback: Vibration
                        if ('vibrate' in navigator) {
                            navigator.vibrate(50);
                        }

                        const id = crypto.randomUUID();
                        await savePhoto(id, blob);
                        setPhotosTaken((prev) => prev + 1);
                    }
                }, 'image/jpeg', 0.8);
            }
        }
    };

    const handleFinish = () => {
        stopCamera();
        navigate('/admin/pwa/gallery');
    };

    return (
        <div className="fixed inset-0 bg-black flex flex-col z-50">
            <div className="relative flex-1 bg-black overflow-hidden">
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Flash Overlay */}
                {showFlash && (
                    <div className="absolute inset-0 bg-white z-20 animate-in fade-in fade-out duration-150" />
                )}

                <button
                    onClick={() => {
                        stopCamera();
                        navigate('/admin/pwa');
                    }}
                    className="absolute top-6 left-6 p-3 bg-black/40 rounded-full text-white z-10 backdrop-blur-md border border-white/10"
                >
                    <X className="w-6 h-6" />
                </button>

                <div className="absolute top-6 right-6 bg-amber-500 px-4 py-1.5 rounded-full text-black text-sm font-bold z-10 shadow-lg animate-in zoom-in duration-300">
                    {photosTaken} FOTO
                </div>
            </div>

            <div className="h-40 bg-zinc-900 flex items-center justify-between px-10 pb-8 safe-area-bottom border-t border-white/5">
                <div className="w-16" /> {/* Spacer matched to button size approx */}

                <div className="relative flex items-center justify-center">
                    {/* Ring animation on capture */}
                    <div className={`absolute inset-0 rounded-full border-4 border-amber-500 scale-110 opacity-0 ${showFlash ? 'animate-ping opacity-100' : ''}`} />
                    <button
                        onClick={takePhoto}
                        className="w-20 h-20 rounded-full border-4 border-white bg-white/10 active:scale-90 active:bg-white/30 transition-all shadow-2xl flex items-center justify-center"
                        aria-label="Scatta foto"
                    >
                        <div className="w-16 h-16 rounded-full bg-white shadow-inner" />
                    </button>
                </div>

                <button
                    onClick={handleFinish}
                    disabled={photosTaken === 0}
                    className="flex items-center gap-2 text-amber-500 font-bold disabled:opacity-30 disabled:grayscale bg-amber-500/10 px-6 py-3 rounded-2xl backdrop-blur-md border border-amber-500/20 active:scale-95 transition-all uppercase text-sm tracking-wider"
                >
                    FINE <ArrowRight className="w-5 h-5" />
                </button>
            </div>

        </div>
    );
};
