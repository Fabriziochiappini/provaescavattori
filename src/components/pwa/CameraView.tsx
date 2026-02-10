import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Camera, RotateCcw, Check, ZoomIn, ZoomOut, Smartphone, Trash2 } from 'lucide-react';
import { savePhoto, deletePhoto } from '../../services/pwaStorage';

interface CapturedPhoto {
    id: string;
    blob: Blob;
    url: string;
}

export const CameraView: React.FC = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const [capturedPhotos, setCapturedPhotos] = useState<CapturedPhoto[]>([]);
    const [showFlash, setShowFlash] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
    const [showRotateMessage, setShowRotateMessage] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [zoomLevel, setZoomLevel] = useState(1);
    const [zoomCapabilities, setZoomCapabilities] = useState<{ min: number; max: number; step: number } | null>(null);
    const [isCapturing, setIsCapturing] = useState(false);

    const navigate = useNavigate();

    // Detect iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;

    useEffect(() => {
        const updateOrientation = () => {
            const isLandscape = window.innerWidth > window.innerHeight;
            setOrientation(isLandscape ? 'landscape' : 'portrait');
            if (isLandscape) setShowRotateMessage(false);
        };

        updateOrientation();
        window.addEventListener('resize', updateOrientation);
        window.addEventListener('orientationchange', updateOrientation);

        return () => {
            window.removeEventListener('resize', updateOrientation);
            window.removeEventListener('orientationchange', updateOrientation);
        };
    }, []);

    useEffect(() => {
        if (orientation === 'portrait') {
            setShowRotateMessage(true);
            const timer = setTimeout(() => setShowRotateMessage(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [orientation]);

    const startCamera = useCallback(async () => {
        console.log('[Camera] Starting camera...');
        setIsLoading(true);
        setError(null);

        if (streamRef.current) {
            console.log('[Camera] Stopping existing stream');
            streamRef.current.getTracks().forEach((track) => track.stop());
        }

        try {
            console.log('[Camera] Requesting media stream...');
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: 'environment',
                    width: { ideal: 4032 },
                    height: { ideal: 3024 },
                },
                audio: false,
            });

            console.log('[Camera] Media stream obtained');
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                await videoRef.current.play();
                console.log('[Camera] Video element playing');
            }

            const videoTrack = stream.getVideoTracks()[0];
            if (videoTrack) {
                const capabilities = (videoTrack as any).getCapabilities?.();
                if (capabilities?.zoom) {
                    setZoomCapabilities({
                        min: capabilities.zoom.min || 1,
                        max: capabilities.zoom.max || 1,
                        step: capabilities.zoom.step || 0.1,
                    });
                    console.log('[Camera] Zoom capabilities:', capabilities.zoom);
                }
            }
            setIsLoading(false);
            console.log('[Camera] Camera started successfully');
        } catch (err) {
            console.error('[Camera] Camera error:', err);
            setError('Impossibile accedere alla fotocamera.');
            setIsLoading(false);
        }
    }, []);

    const stopCamera = useCallback(() => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
        }
    }, []);

    useEffect(() => {
        startCamera();
        return () => stopCamera();
    }, [startCamera, stopCamera]);

    const handleZoomChange = useCallback(async (newZoom: number) => {
        if (!streamRef.current || !zoomCapabilities) return;
        const videoTrack = streamRef.current.getVideoTracks()[0];
        if (!videoTrack) return;

        const clampedZoom = Math.max(zoomCapabilities.min, Math.min(zoomCapabilities.max, newZoom));
        try {
            await (videoTrack as any).applyConstraints({
                advanced: [{ zoom: clampedZoom }],
            });
            setZoomLevel(clampedZoom);
        } catch (err) {
            console.log('Zoom error', err);
        }
    }, [zoomCapabilities]);

    const takePhoto = useCallback(() => {
        if (!videoRef.current || !canvasRef.current || isCapturing) {
            console.log('[Camera] Cannot take photo:', {
                hasVideo: !!videoRef.current,
                hasCanvas: !!canvasRef.current,
                isCapturing
            });
            return;
        }

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        if (!context) {
            console.error('[Camera] Cannot get canvas context');
            return;
        }

        // Get video dimensions
        const videoWidth = video.videoWidth;
        const videoHeight = video.videoHeight;

        console.log('[Camera] Video dimensions:', { videoWidth, videoHeight });

        if (videoWidth === 0 || videoHeight === 0) {
            console.error('[Camera] Invalid video dimensions');
            return;
        }

        // Calculate output size with max dimension limit
        const maxDimension = 1536;
        let scale = 1;
        if (Math.max(videoWidth, videoHeight) > maxDimension) {
            scale = maxDimension / Math.max(videoWidth, videoHeight);
        }

        canvas.width = videoWidth * scale;
        canvas.height = videoHeight * scale;

        console.log('[Camera] Canvas size:', { width: canvas.width, height: canvas.height, scale });

        // Draw the current video frame to canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Visual feedback
        setIsCapturing(true);
        setShowFlash(true);
        setTimeout(() => setShowFlash(false), 150);

        // Haptic feedback
        if ('vibrate' in navigator) navigator.vibrate(50);

        console.log('[Camera] Converting canvas to blob...');

        // Convert canvas to blob
        canvas.toBlob(
            async (blob) => {
                if (blob) {
                    console.log('[Camera] Blob created successfully:', {
                        size: blob.size,
                        type: blob.type
                    });

                    const id = crypto.randomUUID();
                    const url = URL.createObjectURL(blob);

                    try {
                        await savePhoto(id, blob);
                        console.log('[Camera] Photo saved to IndexedDB:', id);
                        setCapturedPhotos((prev) => [...prev, { id, blob, url }]);
                    } catch (error) {
                        console.error('[Camera] Error saving photo:', error);
                    }
                } else {
                    console.error('[Camera] Failed to create blob from canvas');
                }
                setIsCapturing(false);
            },
            'image/jpeg',
            0.85
        );
    }, [isCapturing]);

    const discardPhoto = async (id: string) => {
        await deletePhoto(id);
        setCapturedPhotos((prev) => {
            const filtered = prev.filter((p) => p.id !== id);
            // Cleanup URL
            const photo = prev.find((p) => p.id === id);
            if (photo) URL.revokeObjectURL(photo.url);
            return filtered;
        });
    };

    const handleFinish = () => {
        stopCamera();
        // Cleanup all URLs before navigating
        capturedPhotos.forEach((p) => URL.revokeObjectURL(p.url));
        navigate('/admin/pwa/gallery');
    };

    const toggleFullscreen = async () => {
        if (!document.fullscreenElement) {
            await containerRef.current?.requestFullscreen();
            setIsFullscreen(true);
        } else {
            await document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    const isLandscape = orientation === 'landscape';

    return (
        <div ref={containerRef} className="fixed inset-0 bg-black flex flex-col z-50 overflow-hidden font-sans">
            <canvas ref={canvasRef} className="hidden" />

            {/* Orientation Message */}
            {showRotateMessage && !isLandscape && (
                <div className="absolute inset-0 z-[100] bg-black/90 flex flex-col items-center justify-center p-6 text-center">
                    <Smartphone className="w-24 h-24 text-amber-500 animate-bounce mb-6" style={{ transform: 'rotate(90deg)' }} />
                    <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-2">Gira il telefono</h2>
                    <p className="text-zinc-400">Per scattare foto migliori dei macchinari, usa la modalità orizzontale.</p>
                </div>
            )}

            {/* Top Bar / Side Bar Overlay (Landscape) */}
            <div className={`absolute z-40 flex items-center justify-between p-6 ${isLandscape ? 'top-0 bottom-0 left-0 w-24 flex-col bg-gradient-to-r from-black/60 to-transparent' : 'top-0 left-0 right-0 bg-gradient-to-b from-black/60 to-transparent'}`}>
                <button
                    onClick={() => { stopCamera(); navigate('/admin/pwa'); }}
                    className="p-3 bg-white/10 rounded-full text-white backdrop-blur-md border border-white/10 active:scale-90 transition-all"
                >
                    <X className="w-6 h-6" />
                </button>

                <div className={`flex items-center gap-3 bg-amber-500 px-4 py-2 rounded-full shadow-2xl animate-in zoom-in duration-300 ${isLandscape ? 'rotate-90' : ''}`}>
                    <Camera className="w-5 h-5 text-black" />
                    <span className="text-black font-black text-sm">{capturedPhotos.length}</span>
                </div>

                <button
                    onClick={toggleFullscreen}
                    className="p-3 bg-white/10 rounded-full text-white backdrop-blur-md border border-white/10 active:scale-90 transition-all"
                >
                    <Smartphone className={`w-6 h-6 ${isFullscreen ? '' : 'rotate-90'}`} />
                </button>
            </div>

            {/* Video Preview */}
            <div className="flex-1 relative bg-black flex items-center justify-center">
                {isLoading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-500 gap-4">
                        <Camera className="w-12 h-12 animate-pulse" />
                        <p className="text-sm font-bold uppercase tracking-widest">Avvio Optica...</p>
                    </div>
                )}
                {error && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-red-500 p-8 text-center gap-4">
                        <X className="w-12 h-12" />
                        <p className="font-bold">{error}</p>
                        <button onClick={startCamera} className="px-6 py-2 bg-white/10 rounded-full text-white text-xs font-bold uppercase">Riprova</button>
                    </div>
                )}
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                />
                {showFlash && <div className="absolute inset-0 bg-white z-20 animate-in fade-in fade-out duration-150" />}

                {/* Zoom Controls Overlay */}
                {zoomCapabilities && (
                    <div className={`absolute z-40 flex items-center gap-4 ${isLandscape ? 'bottom-8 left-1/2 -translate-x-1/2' : 'right-8 top-1/2 -translate-y-1/2 flex-col'}`}>
                        <button onClick={() => handleZoomChange(zoomLevel - 0.5)} className="w-10 h-10 rounded-full bg-black/40 text-white flex items-center justify-center backdrop-blur-md border border-white/10 active:scale-90"><ZoomOut className="w-5 h-5" /></button>
                        <div className={`bg-black/40 px-3 py-1 rounded-full text-[10px] font-black text-amber-500 border border-white/10 ${isLandscape ? '' : 'rotate-90'}`}>{zoomLevel.toFixed(1)}x</div>
                        <button onClick={() => handleZoomChange(zoomLevel + 0.5)} className="w-10 h-10 rounded-full bg-black/40 text-white flex items-center justify-center backdrop-blur-md border border-white/10 active:scale-90"><ZoomIn className="w-5 h-5" /></button>
                    </div>
                )}
            </div>

            {/* Bottom Controls / Right Controls (Landscape) */}
            <div className={`bg-zinc-950 flex items-center justify-between p-8 safe-area-bottom border-white/5 z-40 ${isLandscape ? 'absolute top-0 bottom-0 right-0 w-44 flex-col border-l' : 'h-40 border-t'}`}>
                {/* Captured Sidebar Preview */}
                <div className={`flex gap-3 p-2 scrollbar-none ${isLandscape ? 'flex-col overflow-y-auto max-h-[50vh] w-full items-center' : 'w-48 overflow-x-auto'}`}>
                    {capturedPhotos.map((photo) => (
                        <div key={photo.id} className="relative w-16 h-16 rounded-xl overflow-hidden shadow-2xl flex-shrink-0 group ring-2 ring-white/5">
                            <img src={photo.url} alt="" className="w-full h-full object-cover" />
                            <button
                                onClick={() => discardPhoto(photo.id)}
                                className="absolute inset-0 bg-red-600/60 opacity-0 group-active:opacity-100 flex items-center justify-center text-white transition-opacity"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    ))}
                    {capturedPhotos.length === 0 && (
                        <div className="w-16 h-16 rounded-xl border-2 border-dashed border-zinc-800 flex items-center justify-center text-zinc-800">
                            <Camera className="w-6 h-6" />
                        </div>
                    )}
                </div>

                <div className="relative flex items-center justify-center">
                    <div className={`absolute inset-0 rounded-full border-4 border-amber-500 scale-125 opacity-0 ${showFlash ? 'animate-ping opacity-100' : ''}`} />
                    <button
                        onClick={takePhoto}
                        disabled={isLoading || !!error || isCapturing}
                        className={`w-20 h-20 rounded-full border-4 border-white bg-white/10 active:scale-95 active:bg-white/30 transition-all shadow-2xl flex items-center justify-center ${isCapturing ? 'opacity-50' : ''}`}
                    >
                        <div className={`rounded-full bg-white shadow-inner transition-all ${isCapturing ? 'w-10 h-10' : 'w-16 h-16'}`} />
                    </button>
                </div>


                <button
                    onClick={handleFinish}
                    disabled={capturedPhotos.length === 0}
                    className="flex flex-col items-center gap-1 text-amber-500 font-bold disabled:opacity-20 bg-amber-500/10 px-6 py-3 rounded-2xl backdrop-blur-md border border-amber-500/20 active:scale-95 transition-all text-xs tracking-tighter"
                >
                    <Check className="w-6 h-6" />
                    PROCEDI
                </button>
            </div>
        </div>
    );
};
