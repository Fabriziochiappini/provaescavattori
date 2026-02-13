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
            className="fixed bottom-6 right-6 z-[100] hidden sm:flex flex-col gap-2 pointer-events-auto"
            style={{ touchAction: 'none' }}
        >
            <div className="bg-white/80 backdrop-blur-xl shadow-2xl rounded-[24px] p-3 border border-gray-200/50 flex flex-col gap-1 w-[200px] select-none">

                {/* Drag Handle */}
                <div className="flex items-center justify-between px-2 mb-2 cursor-grab active:cursor-grabbing text-gray-400">
                    <p className="text-[9px] uppercase font-black tracking-widest">
                        Navigazione Admin
                    </p>
                    <GripHorizontal size={14} />
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
                                className={`w-full group flex items-center justify-between px-3 py-2.5 rounded-[16px] text-xs font-bold transition-all duration-300 ${isActive
                                    ? 'bg-amber-500 text-white shadow-md shadow-amber-500/30'
                                    : 'text-slate-600 hover:bg-gray-100/80 active:scale-95'
                                    }`}
                            >
                                <div className="flex items-center gap-2.5">
                                    <Icon size={16} className={isActive ? 'text-white' : 'text-gray-400 group-hover:text-amber-500 transition-colors'} />
                                    <span>{tab.label}</span>
                                </div>
                                {isActive && (
                                    <motion.div
                                        layoutId="active-indicator"
                                        className="w-1 h-1 bg-white rounded-full"
                                    />
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Footer Info */}
                <div className="mt-2 pt-2 border-t border-gray-100/50 px-2 flex items-center justify-between">
                    <div className="flex -space-x-1">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="w-4 h-4 rounded-full bg-gray-100 border border-white flex items-center justify-center text-[7px] font-bold text-gray-400">
                                {i}
                            </div>
                        ))}
                    </div>
                    <span className="text-[8px] font-black text-gray-300 uppercase tracking-tighter">
                        ConteGroup v2.0
                    </span>
                </div>
            </div>
        </motion.div>
    );
};

export default FloatingAdminNav;
