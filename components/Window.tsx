
import React, { useRef, useState, useEffect } from 'react';
import { WindowState } from '../types';

interface Props {
  window: WindowState;
  isActive: boolean;
  onFocus: () => void;
  onClose: () => void;
  onMove: (pos: { x: number; y: number }) => void;
  children: React.ReactNode;
}

const Window: React.FC<Props> = ({ window: win, isActive, onFocus, onClose, onMove, children }) => {
  const windowRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handlePointerDown = (e: React.PointerEvent) => {
    onFocus();
    // Only drag from header
    const target = e.target as HTMLElement;
    if (!target.closest('.window-header')) return;

    setIsDragging(true);
    setDragOffset({
      x: e.clientX - win.position.x,
      y: e.clientY - win.position.y
    });
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    
    // Bounds check
    const newX = Math.max(0, Math.min(e.clientX - dragOffset.x, window.innerWidth - 100));
    const newY = Math.max(0, Math.min(e.clientY - dragOffset.y, window.innerHeight - 100));
    
    onMove({ x: newX, y: newY });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  };

  return (
    <div
      ref={windowRef}
      className={`absolute glass rounded-xl overflow-hidden flex flex-col window-shadow transition-shadow duration-300 ${
        isActive ? 'ring-1 ring-white/30 z-50' : 'opacity-90 grayscale-[0.2]'
      }`}
      style={{
        left: win.position.x,
        top: win.position.y,
        zIndex: win.zIndex,
        width: win.id === 'snake' ? '600px' : '400px',
        height: win.id === 'snake' ? '450px' : '500px',
        maxHeight: 'calc(100vh - 80px)',
        maxWidth: 'calc(100vw - 40px)'
      }}
      onPointerDown={handlePointerDown}
    >
      {/* Header */}
      <div 
        className="window-header h-10 flex items-center justify-between px-3 bg-white/5 select-none touch-none"
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <div className="flex items-center gap-2">
          <i className={`fa-solid ${getIcon(win.id)} text-sm text-white/70`}></i>
          <span className="text-xs text-white/90 font-medium">{win.title}</span>
        </div>
        <div className="flex items-center gap-1">
          <button className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded transition">
            <i className="fa-solid fa-minus text-[10px] text-white"></i>
          </button>
          <button className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded transition">
            <i className="fa-regular fa-square text-[10px] text-white"></i>
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            className="w-8 h-8 flex items-center justify-center hover:bg-red-500 rounded transition"
          >
            <i className="fa-solid fa-xmark text-[11px] text-white"></i>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto bg-zinc-900/40 relative">
        {children}
      </div>
    </div>
  );
};

const getIcon = (id: string) => {
  switch (id) {
    case 'calculator': return 'fa-calculator';
    case 'taskmaster': return 'fa-list-check';
    case 'timer': return 'fa-stopwatch';
    case 'snake': return 'fa-gamepad';
    default: return 'fa-window-maximize';
  }
};

export default Window;
