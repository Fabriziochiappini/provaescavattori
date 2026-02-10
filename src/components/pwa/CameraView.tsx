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

                // Reset capturing state
                setIsCapturing(false);
            },
            'image/jpeg',
            0.85
        );

        // Safety timeout to reset isCapturing if transition fails (3 seconds)
        setTimeout(() => setIsCapturing(false), 3000);
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

            {/* Orientation Message - Non-blocking overlay */}
            {showRotateMessage && !isLandscape && (
                <div className="absolute inset-0 z-[100] bg-black/60 flex flex-col items-center justify-center p-6 text-center pointer-events-none select-none animate-in fade-in duration-500">
                    <Smartphone className="w-24 h-24 text-amber-500 animate-bounce mb-6" style={{ transform: 'rotate(90deg)' }} />
                    <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-2">Gira il telefono</h2>
                    <p className="text-zinc-400">Usa la modalità orizzontale per scatti migliori.</p>
                </div>
            )}

            {/* Top Bar / Side Bar Overlay (Landscape) */}
            <div className={`absolute z-40 flex items-center justify-between p-6 ${isLandscape ? 'top-0 bottom-0 left-0 w-24 flex-col bg-gradient-to-r from-black/60 to-transparent' : 'top-0 left-0 right-0 bg-gradient-to-b from-black/60 to-transparent'}`}>
                <div className="flex flex-col gap-6 items-center">
                    <button
                        onClick={() => { stopCamera(); navigate('/admin/pwa'); }}
                        className="p-3 bg-white/10 rounded-full text-white backdrop-blur-md border border-white/10 active:scale-90 transition-all"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Independent Left Gallery (Always Visible) */}
                {capturedPhotos.length > 0 && (
                    <div className="absolute left-4 top-24 bottom-32 w-20 flex flex-col gap-4 py-4 overflow-y-auto scrollbar-none animate-in slide-in-from-left duration-300 z-40 pointer-events-auto">
                        {capturedPhotos.map((photo) => (
                            <div key={photo.id} className="relative w-16 h-16 rounded-xl overflow-hidden shadow-2xl flex-shrink-0 group ring-2 ring-white/20 bg-black">
                                <img src={photo.url} alt="" className="w-full h-full object-cover" />
                                <button
                                    onClick={() => discardPhoto(photo.id)}
                                    className="absolute inset-0 bg-red-600/80 opacity-0 group-active:opacity-100 flex items-center justify-center text-white transition-opacity"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <div className="relative flex items-center justify-center">
                    <div className={`absolute inset-0 rounded-full border-4 border-amber-500 scale-125 opacity-0 ${showFlash ? 'animate-ping opacity-100' : ''}`} />
                    <button
                        onClick={() => {
                            console.log('[Camera] Shutter button pressed');
                            takePhoto();
                        }}
                        disabled={isLoading || !!error}
                        className={`w-24 h-24 rounded-full border-4 border-white bg-white/10 active:scale-95 active:bg-white/30 transition-all shadow-2xl flex items-center justify-center z-50 cursor-pointer touch-manipulation ${isCapturing ? 'opacity-70' : ''} ${isLoading || error ? 'opacity-30 cursor-not-allowed' : ''}`}
                    >
                        <div className={`rounded-full shadow-inner transition-all duration-200 ${isCapturing ? 'w-10 h-10 bg-amber-500 rounded-lg' : 'w-18 h-18 bg-white'}`} />
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
