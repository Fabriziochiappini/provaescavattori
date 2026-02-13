import React, { useState, useEffect } from 'react';
import { motion, useDragControls } from 'framer-motion';
import { LayoutDashboard, Settings, Phone, Image as ImageIcon, Briefcase, ChevronRight, GripHorizontal } from 'lucide-react';

interface FloatingAdminNavProps {
    activeTab: string;
    onTabChange: (tab: any) => void;
    tabs: { id: string; label: string; icon: any }[];
}

const FloatingAdminNav: React.FC<FloatingAdminNavProps> = ({ activeTab, onTabChange, tabs }) => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isLoaded, setIsLoaded] = useState(false);

    // Load position from localStorage on mount
    useEffect(() => {
        const savedPosition = localStorage.getItem('admin-nav-position');
        if (savedPosition) {
            try {
                setPosition(JSON.parse(savedPosition));
            } catch (e) {
                console.error('Failed to parse saved position', e);
            }
        }
        setIsLoaded(true);
    }, []);

    const handleDragEnd = (_: any, info: { offset: { x: number; y: number } }) => {
        const newPos = {
            x: position.x + info.offset.x,
            y: position.y + info.offset.y
        };
        setPosition(newPos);
        localStorage.setItem('admin-nav-position', JSON.stringify(newPos));
    };

    if (!isLoaded) return null;

    return (
        <motion.div
            drag
            dragMomentum={false}
            onDragEnd={handleDragEnd}
            initial={position}
            animate={position}
            className="fixed bottom-10 right-10 z-[100] hidden sm:flex flex-col gap-2 pointer-events-auto"
            style={{ touchAction: 'none' }}
        >
            <div className="bg-white/80 backdrop-blur-xl shadow-2xl rounded-[32px] p-4 border border-gray-200/50 flex flex-col gap-1 w-64 select-none">

                {/* Drag Handle */}
                <div className="flex items-center justify-between px-3 mb-4 cursor-grab active:cursor-grabbing text-gray-400">
                    <p className="text-[10px] uppercase font-black tracking-widest">
                        Navigazione Admin
                    </p>
                    <GripHorizontal size={16} />
                </div>

                {/* Tab Buttons */}
                <div className="flex flex-col gap-1">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;

                        return (
                            <button
                                key={tab.id}
                                onClick={() => onTabChange(tab.id)}
                                className={`w-full group flex items-center justify-between px-4 py-3.5 rounded-[20px] text-sm font-bold transition-all duration-300 ${isActive
                                        ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30'
                                        : 'text-slate-600 hover:bg-gray-100/80 active:scale-95'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <Icon size={18} className={isActive ? 'text-white' : 'text-gray-400 group-hover:text-amber-500 transition-colors'} />
                                    <span>{tab.label}</span>
                                </div>
                                {isActive && (
                                    <motion.div
                                        layoutId="active-indicator"
                                        className="w-1.5 h-1.5 bg-white rounded-full"
                                    />
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Footer Info */}
                <div className="mt-4 pt-4 border-t border-gray-100/50 px-3 flex items-center justify-between">
                    <div className="flex -space-x-1">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="w-5 h-5 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-[8px] font-bold text-gray-400">
                                {i}
                            </div>
                        ))}
                    </div>
                    <span className="text-[9px] font-black text-gray-300 uppercase tracking-tighter">
                        ConteGroup v2.0
                    </span>
                </div>
            </div>
        </motion.div>
    );
};

export default FloatingAdminNav;
