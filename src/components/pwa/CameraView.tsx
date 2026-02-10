import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, X } from 'lucide-react';
import { savePhoto } from '../../services/pwaStorage';
import { v4 as uuidv4 } from 'uuid';

export const CameraView: React.FC = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [photosTaken, setPhotosTaken] = useState<number>(0);
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
                        const id = uuidv4();
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

                <button
                    onClick={() => {
                        stopCamera();
                        navigate('/admin/pwa');
                    }}
                    className="absolute top-4 left-4 p-2 bg-black/50 rounded-full text-white z-10 backdrop-blur-sm"
                >
                    <X className="w-6 h-6" />
                </button>

                <div className="absolute top-4 right-4 bg-black/50 px-3 py-1 rounded-full text-white text-sm font-medium z-10 backdrop-blur-sm">
                    {photosTaken} foto
                </div>
            </div>

            <div className="h-32 bg-black flex items-center justify-between px-8 pb-8 safe-area-bottom">
                <div className="w-12" /> {/* Spacer */}

                <button
                    onClick={takePhoto}
                    className="w-20 h-20 rounded-full border-4 border-white bg-white/20 active:scale-90 transition-transform shadow-lg"
                    aria-label="Scatta foto"
                />

                <button
                    onClick={handleFinish}
                    disabled={photosTaken === 0}
                    className="flex items-center gap-2 text-white font-medium disabled:opacity-30 disabled:cursor-not-allowed bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm"
                >
                    AVANTI <ArrowRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};
