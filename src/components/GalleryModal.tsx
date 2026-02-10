import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface GalleryModalProps {
    images: string[];
    isOpen: boolean;
    onClose: () => void;
    initialIndex?: number;
}

const GalleryModal: React.FC<GalleryModalProps> = ({ images, isOpen, onClose, initialIndex = 0 }) => {
    const [index, setIndex] = useState(initialIndex);
    const [direction, setDirection] = useState(0);

    useEffect(() => {
        if (isOpen) {
            setIndex(initialIndex);
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, initialIndex]);

    const paginate = useCallback((newDirection: number) => {
        setDirection(newDirection);
        setIndex((prevIndex) => {
            let nextIndex = prevIndex + newDirection;
            if (nextIndex < 0) nextIndex = images.length - 1;
            if (nextIndex >= images.length) nextIndex = 0;
            return nextIndex;
        });
    }, [images.length]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;
            if (e.key === 'ArrowRight') paginate(1);
            if (e.key === 'ArrowLeft') paginate(-1);
            if (e.key === 'Escape') onClose();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, paginate, onClose]);

    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0,
            scale: 0.8
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
            scale: 1
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0,
            scale: 0.8
        })
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
                    onClick={onClose}
                >
                    {/* Close Button */}
                    <button
                        className="absolute top-4 right-4 z-50 p-2 text-white/70 hover:text-white transition-colors bg-white/10 hover:bg-white/20 rounded-full"
                        onClick={onClose}
                    >
                        <X size={32} />
                    </button>

                    {/* Navigation Buttons */}
                    {images.length > 1 && (
                        <>
                            <button
                                className="absolute left-4 z-50 p-2 text-white/70 hover:text-white transition-colors bg-white/10 hover:bg-white/20 rounded-full hidden md:block"
                                onClick={(e) => { e.stopPropagation(); paginate(-1); }}
                            >
                                <ChevronLeft size={40} />
                            </button>
                            <button
                                className="absolute right-4 z-50 p-2 text-white/70 hover:text-white transition-colors bg-white/10 hover:bg-white/20 rounded-full hidden md:block"
                                onClick={(e) => { e.stopPropagation(); paginate(1); }}
                            >
                                <ChevronRight size={40} />
                            </button>
                        </>
                    )}

                    {/* Image Container */}
                    <div
                        className="relative w-full h-full flex items-center justify-center p-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <AnimatePresence initial={false} custom={direction}>
                            <motion.img
                                key={index}
                                src={images[index]}
                                custom={direction}
                                variants={variants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{
                                    x: { type: "spring", stiffness: 300, damping: 30 },
                                    opacity: { duration: 0.2 }
                                }}
                                drag="x"
                                dragConstraints={{ left: 0, right: 0 }}
                                dragElastic={1}
                                onDragEnd={(e, { offset, velocity }) => {
                                    const swipe = Math.abs(offset.x) * velocity.x;
                                    if (swipe < -10000) {
                                        paginate(1);
                                    } else if (swipe > 10000) {
                                        paginate(-1);
                                    }
                                }}
                                className="absolute max-h-[90vh] max-w-[90vw] object-contain rounded-lg shadow-2xl"
                            />
                        </AnimatePresence>

                        {/* Counter */}
                        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-white/80 bg-black/50 px-4 py-1 rounded-full text-sm font-medium backdrop-blur-md">
                            {index + 1} / {images.length}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default GalleryModal;
