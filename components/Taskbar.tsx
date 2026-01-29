
import React, { useState, useEffect } from 'react';
import { AppID, WindowState } from '../types';

interface Props {
  openWindows: WindowState[];
  activeWindowId: AppID | null;
  onToggleStart: () => void;
  onAppClick: (id: AppID) => void;
}

const Taskbar: React.FC<Props> = ({ openWindows, activeWindowId, onToggleStart, onAppClick }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute bottom-0 left-0 w-full h-12 glass-dark z-[10000] flex items-center justify-between px-2">
      {/* Left Section: Start Button */}
      <div className="flex items-center">
        <button 
          onClick={onToggleStart}
          className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-md transition-colors group"
        >
          <img src="https://upload.wikimedia.org/wikipedia/commons/8/87/Windows_logo_-_2021.svg" 
               className="w-5 h-5 group-hover:scale-110 transition-transform" 
               alt="Start" />
        </button>
      </div>

      {/* Middle Section: Running Apps */}
      <div className="flex gap-1 absolute left-1/2 -translate-x-1/2">
        {openWindows.map(win => (
          <button
            key={win.id}
            onClick={() => onAppClick(win.id)}
            className={`w-10 h-10 flex flex-col items-center justify-center rounded-md transition-all relative ${
              activeWindowId === win.id ? 'bg-white/15' : 'hover:bg-white/10'
            }`}
          >
            <AppIcon id={win.id} className="text-xl" />
            {/* Active Indicator */}
            <div className={`absolute bottom-1 h-0.5 rounded-full transition-all bg-blue-400 ${
              activeWindowId === win.id ? 'w-4' : 'w-1 opacity-50'
            }`} />
          </button>
        ))}
      </div>

      {/* Right Section: Tray */}
      <div className="flex items-center gap-3 pr-2">
        <div className="hidden md:flex items-center gap-2 text-white/80 text-xs px-2 hover:bg-white/10 rounded-md h-8 transition">
          <i className="fa-solid fa-wifi"></i>
          <i className="fa-solid fa-volume-high"></i>
          <div className="flex items-center gap-1">
            <i className="fa-solid fa-battery-three-quarters text-emerald-400"></i>
            <span>82%</span>
          </div>
        </div>
        
        <div className="text-right text-white/90 px-2 hover:bg-white/10 rounded-md h-10 flex flex-col justify-center transition cursor-default">
          <div className="text-[11px] leading-tight font-medium">
            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
          <div className="text-[10px] leading-tight opacity-70">
            {time.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
        </div>
        
        {/* Desktop Show Button (far right line) */}
        <div className="w-1.5 h-full border-l border-white/10 opacity-50 ml-1"></div>
      </div>
    </div>
  );
};

const AppIcon: React.FC<{ id: AppID; className?: string }> = ({ id, className }) => {
  switch (id) {
    case 'calculator': return <i className={`fa-solid fa-calculator text-blue-400 ${className}`} />;
    case 'taskmaster': return <i className={`fa-solid fa-list-check text-emerald-400 ${className}`} />;
    case 'timer': return <i className={`fa-solid fa-stopwatch text-orange-400 ${className}`} />;
    case 'snake': return <i className={`fa-solid fa-gamepad text-purple-400 ${className}`} />;
    default: return null;
  }
};

export default Taskbar;
