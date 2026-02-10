import React from 'react';
import { useData } from '../context/DataContext';
import { motion } from 'framer-motion';

const BrandsBanner: React.FC = () => {
    const { brandsBanner } = useData();

    if (!brandsBanner.active || brandsBanner.logos.length === 0) return null;

    const getSpeed = () => {
        switch (brandsBanner.speed) {
            case 'slow': return 40;
            case 'fast': return 15;
            default: return 25;
        }
    };

    // Duplicate logos for seamless infinite scroll
    const scrollingLogos = [...brandsBanner.logos, ...brandsBanner.logos, ...brandsBanner.logos];

    return (
        <section className={`py-12 bg-white dark:bg-zinc-950 overflow-hidden border-y border-zinc-100 dark:border-zinc-800`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
                <p className="text-center text-xs font-bold uppercase tracking-[0.3em] text-orange-600">I Nostri Partner & Marchi Trattati</p>
            </div>

            {brandsBanner.mode === 'dynamic' ? (
                <div className="flex relative items-center">
                    <motion.div
                        className="flex gap-16 items-center whitespace-nowrap"
                        animate={{
                            x: [0, -100 * brandsBanner.logos.length],
                        }}
                        transition={{
                            x: {
                                repeat: Infinity,
                                repeatType: "loop",
                                duration: getSpeed(),
                                ease: "linear",
                            },
                        }}
                    >
                        {scrollingLogos.map((logo, index) => (
                            <div key={`${logo.id}-${index}`} className="w-32 h-16 sm:w-40 sm:h-20 flex-shrink-0 flex items-center justify-center group">
                                <img
                                    src={logo.image}
                                    alt="Brand logo"
                                    className="max-w-full max-h-full object-contain filter grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                                />
                            </div>
                        ))}
                    </motion.div>
                </div>
            ) : (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center">
                        {brandsBanner.logos.map((logo) => (
                            <div key={logo.id} className="h-20 flex items-center justify-center group">
                                <img
                                    src={logo.image}
                                    alt="Brand logo"
                                    className="max-w-full max-h-full object-contain filter grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
};

export default BrandsBanner;
