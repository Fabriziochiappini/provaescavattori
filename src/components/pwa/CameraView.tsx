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
    const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
    const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
    const [showRotateMessage, setShowRotateMessage] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [zoomLevel, setZoomLevel] = useState(1);
    const [zoomCapabilities, setZoomCapabilities] = useState<{ min: number; max: number; step: number } | null>(null);
    const [isCapturing, setIsCapturing] = useState(false);
    const [isConfirming, setIsConfirming] = useState(false);

    const navigate = useNavigate();

    // Detect iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;

    // Orientation Handling
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

    // Fullscreen/Rotation Logic
    useEffect(() => {
        // iOS doesn't support orientation lock or fullscreen API
        if (isIOS) {
            console.log('[Camera] iOS detected - skipping fullscreen/orientation lock');
            return;
        }

        const forceLandscape = async () => {
            try {
                const orientationApi = screen.orientation as any;

                if (orientationApi?.lock) {
                    try {
                        await orientationApi.lock('landscape');
                        setIsFullscreen(true);
                    } catch (e) {
                        console.log('Orientation lock not supported, trying fullscreen');
                    }
                }

                const elem = containerRef.current || document.documentElement;
                if (elem.requestFullscreen && !document.fullscreenElement) {
                    try {
                        await elem.requestFullscreen();
                        if (orientationApi?.lock) {
                            await orientationApi.lock('landscape');
                        }
                        setIsFullscreen(true);
                    } catch (e) {
                        console.log('Fullscreen not available');
                    }
                }
            } catch (err) {
                console.log('Auto landscape not supported');
            }
        };

        const timer = setTimeout(forceLandscape, 300);

        return () => {
            clearTimeout(timer);
            const orientationApi = screen.orientation as any;
            if (orientationApi?.unlock) {
                try {
                    orientationApi.unlock();
                } catch (e) { }
            }
            if (document.fullscreenElement) {
                document.exitFullscreen?.().catch(() => { });
            }
        };
    }, [isIOS]);

    // Show rotate message
    useEffect(() => {
        if (orientation === 'portrait') {
            setShowRotateMessage(true);
            const hideDelay = isIOS ? 8000 : 4000;
            const timer = setTimeout(() => setShowRotateMessage(false), hideDelay);
            return () => clearTimeout(timer);
        }
    }, [orientation, isIOS]);


    const startCamera = useCallback(async () => {
        console.log('[Camera] Starting camera...');
        setIsLoading(true);
        setError(null);
        setZoomCapabilities(null);
        setZoomLevel(1);

        if (streamRef.current) {
            console.log('[Camera] Stopping existing stream');
            streamRef.current.getTracks().forEach((track) => track.stop());
        }

        try {
            console.log('[Camera] Requesting media stream...');
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: facingMode,
                    width: { ideal: 4032 },
                    height: { ideal: 3024 },
                    aspectRatio: { ideal: 4 / 3 }
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
                    setZoomLevel(capabilities.zoom.min || 1);
                }
            }
            setIsLoading(false);
            console.log('[Camera] Camera started successfully');
        } catch (err) {
            console.error('[Camera] Camera error:', err);
            setError('Impossibile accedere alla fotocamera. Verifica i permessi.');
            setIsLoading(false);
        }
    }, [facingMode]);

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
        if (!videoRef.current || !canvasRef.current || isCapturing) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        if (!context) return;

        const videoWidth = video.videoWidth;
        const videoHeight = video.videoHeight;

        if (videoWidth === 0 || videoHeight === 0) return;

        // Calculate square crop (like AutoGenPro)
        const squareSize = Math.min(videoWidth, videoHeight);
        const sourceX = (videoWidth - squareSize) / 2;
        const sourceY = (videoHeight - squareSize) / 2;

        const maxDimension = 1536;
        const outputSize = Math.min(squareSize, maxDimension);

        canvas.width = outputSize;
        canvas.height = outputSize;

        // Draw cropped square
        context.drawImage(
            video,
            sourceX, sourceY, squareSize, squareSize,
            0, 0, outputSize, outputSize
        );

        // Visual feedback
        setIsCapturing(true);
        setShowFlash(true);
        setTimeout(() => setShowFlash(false), 150);

        // Haptic feedback
        if ('vibrate' in navigator) navigator.vibrate(50);

        canvas.toBlob(
            async (blob) => {
                if (blob) {
                    const id = crypto.randomUUID();
                    const url = URL.createObjectURL(blob);

                    try {
                        await savePhoto(id, blob);
                        setCapturedPhotos((prev) => [...prev, { id, blob, url }]);
                    } catch (error) {
                        console.error('[Camera] Error saving photo:', error);
                    }
                }
                setIsCapturing(false);
            },
            'image/jpeg',
            0.92
        );

        // Safety timeout
        setTimeout(() => setIsCapturing(false), 3000);

    }, [isCapturing]);

    const discardPhoto = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent triggering parent clicks
        await deletePhoto(id);
        setCapturedPhotos((prev) => {
            const filtered = prev.filter((p) => p.id !== id);
            const photo = prev.find((p) => p.id === id);
            if (photo) URL.revokeObjectURL(photo.url);
            return filtered;
        });
    };

    const handleFinish = () => {
        if (isConfirming) return;
        setIsConfirming(true);
        stopCamera();
        // Cleanup URLs handled by page unmount usually, but good practice
        // Navigate with just orderedIds, SimpleDetailsForm will load from DB if needed? 
        // Actually SimpleDetailsForm loads photos? No, it uploads them.
        // It needs orderedIds.
        const orderedIds = capturedPhotos.map(p => p.id);
        navigate('/admin/pwa/details', { state: { orderedIds } }); // Was navigating to /details in old flow? Let's check. 
        // Previous code: navigate('/admin/pwa/gallery') -> then gallery -> details.
        // AutoGenPro flow was distinct.
        // Let's stick to the previous flow if possible or shortcut.
        // The user asked for "Elimina instead of Int/Est".
        // If we have delete here, we might not need the gallery management page?
        // But the previous code went to '/admin/pwa/gallery'.
        // Let's go to '/admin/pwa/gallery' to be safe and consistent with existing app flow.
        navigate('/admin/pwa/gallery');
    };

    const switchCamera = useCallback(() => {
        setFacingMode(prev => prev === 'environment' ? 'user' : 'environment');
    }, []);

    const toggleFullscreenLandscape = useCallback(async () => {
        try {
            if (!document.fullscreenElement) {
                await containerRef.current?.requestFullscreen();
                setIsFullscreen(true);
            } else {
                await document.exitFullscreen();
                setIsFullscreen(false);
            }
        } catch (err) {
            console.log('Fullscreen error', err);
        }
    }, []);


    const isLandscape = orientation === 'landscape';

    return (
        <div ref={containerRef} className="fixed inset-0 z-[99999] bg-black flex flex-col font-sans overflow-hidden">
            <canvas ref={canvasRef} className="hidden" />

            {/* Rotate Message Overlay */}
            {showRotateMessage && orientation === 'portrait' && (
                <div
                    className="absolute inset-0 z-[99999] bg-black/80 flex flex-col items-center justify-center animate-in fade-in duration-300 pointer-events-none"
                >
                    <Smartphone className="h-24 w-24 text-amber-500 animate-pulse mb-6" style={{ transform: 'rotate(90deg)' }} />
                    <p className="text-white text-2xl font-black uppercase tracking-tight text-center px-8">
                        Gira il telefono
                    </p>
                    <p className="text-zinc-400 text-sm mt-2 text-center px-8">
                        Modalità orizzontale consigliata
                    </p>
                </div>
            )}

            {/* Screen Rotate Button */}
            <button
                onClick={toggleFullscreenLandscape}
                className={`absolute z-50 p-3 rounded-full bg-black/50 text-white/70 hover:text-white backdrop-blur-md border border-white/10 active:scale-95 transition-all ${isLandscape
                    ? "bottom-4 right-4"
                    : "top-24 left-4"
                    }`}
            >
                <Smartphone className={`h-6 w-6 transition-transform ${isFullscreen ? "" : "rotate-90"}`} />
            </button>

            {/* Zoom Controls */}
            {zoomCapabilities && zoomCapabilities.max > 1 && (
                <div className={`absolute z-50 flex items-center gap-2 ${isLandscape
                    ? "top-4 left-1/2 -translate-x-1/2 flex-row"
                    : "right-4 top-1/2 -translate-y-1/2 flex-col"
                    }`}>
                    <button
                        onClick={() => handleZoomChange(zoomLevel - zoomCapabilities.step * 2)}
                        disabled={zoomLevel <= zoomCapabilities.min}
                        className="p-3 rounded-full bg-black/50 text-white backdrop-blur-md border border-white/10 active:scale-90"
                    >
                        <ZoomOut className="h-5 w-5" />
                    </button>

                    <div className={`bg-black/50 px-3 py-1 rounded-full text-xs font-black text-amber-500 border border-white/10 backdrop-blur-md ${isLandscape ? '' : 'rotate-90'}`}>
                        {zoomLevel.toFixed(1)}x
                    </div>

                    <button
                        onClick={() => handleZoomChange(zoomLevel + zoomCapabilities.step * 2)}
                        disabled={zoomLevel >= zoomCapabilities.max}
                        className="p-3 rounded-full bg-black/50 text-white backdrop-blur-md border border-white/10 active:scale-90"
                    >
                        <ZoomIn className="h-5 w-5" />
                    </button>
                </div>
            )}

            {/* Flash Effect */}
            {showFlash && <div className="absolute inset-0 bg-white z-50 pointer-events-none animate-in fade-in fade-out duration-150" />}

            {/* Header / Sidebar */}
            <div className={`absolute z-40 flex items-center justify-between ${isLandscape
                ? "top-0 bottom-0 left-0 w-24 flex-col py-6 bg-gradient-to-r from-black/80 to-transparent"
                : "top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 to-transparent"
                }`}>
                <button
                    onClick={() => { stopCamera(); navigate('/admin/pwa'); }}
                    className="p-3 bg-white/10 rounded-full text-white backdrop-blur-md border border-white/10 active:scale-90 transition-all"
                >
                    <X className="h-6 w-6" />
                </button>

                <div className={`flex items-center gap-2 bg-amber-500/90 text-black px-4 py-2 rounded-full shadow-lg ${isLandscape ? "flex-col px-2 py-4 gap-1" : ""
                    }`}>
                    <Camera className="h-5 w-5" />
                    <span className="font-black text-sm">
                        {capturedPhotos.length}
                    </span>
                </div>

                <button
                    onClick={switchCamera}
                    className="p-3 bg-white/10 rounded-full text-white backdrop-blur-md border border-white/10 active:scale-90 transition-all"
                >
                    <RotateCcw className="h-6 w-6" />
                </button>
            </div>


            {/* Main Video Area */}
            <div className="flex-1 relative bg-black flex items-center justify-center overflow-hidden">
                {isLoading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-500 gap-4">
                        <Camera className="w-12 h-12 animate-pulse" />
                        <p className="text-sm font-bold uppercase tracking-widest">Avvio Fotocamera...</p>
                    </div>
                )}
                {error && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-red-500 p-8 text-center gap-4 bg-black/90 z-50">
                        <X className="w-12 h-12" />
                        <p className="font-bold">{error}</p>
                        <button onClick={startCamera} className="px-6 py-2 bg-white/10 rounded-full text-white text-xs font-bold uppercase border border-white/20">Riprova</button>
                    </div>
                )}
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Gallery Strip (Always visible, distinct from controls) */}
            {capturedPhotos.length > 0 && (
                <div className={`absolute z-30 transition-all duration-300 ${isLandscape
                    ? "top-0 bottom-0 right-32 w-24 flex flex-col justify-center pointer-events-none" // Right side, next to controls
                    : "bottom-32 left-0 right-0 pointer-events-none" // Bottom, above controls
                    }`}>
                    <div className={`flex gap-3 p-4 overflow-auto pointer-events-auto scrollbar-none ${isLandscape ? "flex-col max-h-[70vh] items-center" : "flex-row px-6"
                        }`}>
                        {capturedPhotos.map((photo, index) => (
                            <div
                                key={photo.id}
                                className="relative w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden border-2 border-white/20 shadow-2xl group bg-black"
                            >
                                <img
                                    src={photo.url}
                                    alt={`Foto ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />
                                {/* Delete Overlay */}
                                <button
                                    onClick={(e) => discardPhoto(photo.id, e)}
                                    className="absolute inset-0 bg-red-600/80 opacity-0 group-active:opacity-100 flex items-center justify-center text-white transition-opacity"
                                >
                                    <Trash2 className="w-6 h-6" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Controls Bar */}
            <div className={`absolute z-40 bg-gradient-to-t from-black via-black/80 to-transparent ${isLandscape
                ? "top-0 bottom-0 right-0 w-32 flex flex-col justify-center items-center bg-gradient-to-l border-l border-white/5"
                : "bottom-0 left-0 right-0 pb-10 pt-12"
                }`}>
                <div className={`flex items-center justify-center gap-8 ${isLandscape ? "flex-col-reverse gap-12" : ""
                    }`}>

                    <div className={isLandscape ? "h-12 w-12" : "w-16"} /> {/* Spacer or secondary action placeholder */}

                    <button
                        onClick={takePhoto}
                        disabled={isLoading || !!error}
                        className={`rounded-full bg-white/10 border-4 border-white shadow-2xl 
                       flex items-center justify-center active:scale-95 transition-transform
                       disabled:opacity-50 disabled:cursor-not-allowed ${isLandscape ? "w-20 h-20" : "w-24 h-24"
                            }`}
                    >
                        <div className={`rounded-full bg-white transition-all ${isCapturing ? "w-16 h-16 bg-amber-500 rounded-xl" : "w-20 h-20"}`} />
                    </button>

                    {capturedPhotos.length > 0 ? (
                        <button
                            onClick={handleFinish}
                            className={`flex items-center justify-center rounded-2xl font-black gap-2 bg-amber-500 text-black shadow-lg shadow-amber-500/20 active:scale-95 transition-all ${isLandscape ? "w-16 h-16 rounded-2xl flex-col text-[10px]" : "h-14 px-6 text-sm uppercase tracking-tight"
                                }`}
                        >
                            <Check className="h-6 w-6" />
                            {!isLandscape && "CONFERMA"}
                        </button>
                    ) : (
                        <div className={isLandscape ? "h-16 w-16" : "h-14 w-24"} /> // Spacer to keep layout balanced
                    )}
                </div>
            </div>
        </div>
    );
};
