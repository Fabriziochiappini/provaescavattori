import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';
import { Machine } from '../types';
import { Link } from 'react-router-dom';

interface MachineCardStackProps {
    machines: Machine[];
}

const MachineCardStack: React.FC<MachineCardStackProps> = ({ machines }) => {
    const [index, setIndex] = useState(0);

    const nextCard = () => {
        setIndex((prev) => (prev + 1) % machines.length);
    };

    const prevCard = () => {
        setIndex((prev) => (prev - 1 + machines.length) % machines.length);
    };

    // Only show the top 3 cards for the stack effect
    const visibleCards = [
        machines[index],
        machines[(index + 1) % machines.length],
        machines[(index + 2) % machines.length],
    ].reverse(); // Reverse so the active card is on top

    return (
        <div className="relative w-full max-w-sm aspect-[3/4] mx-auto lg:mx-0">
            <div className="relative w-full h-full">
                <AnimatePresence mode="popLayout">
                    {visibleCards.map((machine, i) => {
                        const isActive = i === visibleCards.length - 1;
                        const offset = (visibleCards.length - 1 - i) * 15;
                        const scale = 1 - (visibleCards.length - 1 - i) * 0.05;
                        const zIndex = i;

                        return (
                            <motion.div
                                key={`${machine.id}-${i}`}
                                style={{ zIndex }}
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{
                                    opacity: 1,
                                    scale,
                                    y: offset,
                                    x: isActive ? 0 : offset / 2,
                                    rotate: isActive ? 0 : (visibleCards.length - 1 - i) * 2,
                                }}
                                exit={{
                                    opacity: 0,
                                    x: 100,
                                    rotate: 20,
                                    transition: { duration: 0.3 }
                                }}
                                className={`absolute inset-0 bg-white rounded-2xl shadow-2xl overflow-hidden border border-zinc-200 ${isActive ? 'cursor-grab active:cursor-grabbing' : 'pointer-events-none'}`}
                                drag={isActive ? "x" : false}
                                dragConstraints={{ left: 0, right: 0 }}
                                onDragEnd={(_, info) => {
                                    if (info.offset.x > 100) nextCard();
                                    if (info.offset.x < -100) prevCard();
                                }}
                            >
                                {/* Image */}
                                <div className="h-2/3 w-full bg-zinc-100 overflow-hidden relative group">
                                    <img
                                        src={machine.imageUrl}
                                        alt={machine.name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                                        <span className="text-white font-bold flex items-center gap-1">
                                            VEDI DETTAGLI <ArrowUpRight size={18} />
                                        </span>
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="p-6 flex flex-col justify-between h-1/3">
                                    <div>
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-xs font-black uppercase tracking-widest text-orange-600 bg-orange-50 px-2 py-1 rounded">
                                                {machine.brand}
                                            </span>
                                            <span className="text-xs font-bold text-zinc-400">
                                                {machine.year}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-black text-black leading-tight uppercase italic line-clamp-1">
                                            {machine.name}
                                        </h3>
                                    </div>

                                    <div className="flex justify-between items-end">
                                        <div className="text-zinc-500 text-sm font-medium">
                                            {machine.category}
                                        </div>
                                        <Link
                                            to={`/macchina/${machine.id}`}
                                            className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors"
                                        >
                                            <ArrowUpRight size={20} />
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            {/* Navigation Buttons */}
            <div className="absolute -bottom-16 left-0 right-0 flex justify-center gap-4">
                <button
                    onClick={prevCard}
                    className="w-12 h-12 rounded-full border-2 border-white/20 text-white hover:bg-orange-600 hover:border-orange-600 transition-all flex items-center justify-center backdrop-blur-sm"
                >
                    <ChevronLeft size={24} />
                </button>
                <button
                    onClick={nextCard}
                    className="w-12 h-12 rounded-full border-2 border-white/20 text-white hover:bg-orange-600 hover:border-orange-600 transition-all flex items-center justify-center backdrop-blur-sm"
                >
                    <ChevronRight size={24} />
                </button>
            </div>

            {/* Counter */}
            <div className="absolute -top-12 right-0 text-white font-black text-4xl opacity-20 italic">
                {String(index + 1).padStart(2, '0')} / {String(machines.length).padStart(2, '0')}
            </div>
        </div>
    );
};

export default MachineCardStack;
