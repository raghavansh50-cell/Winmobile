
import React, { useState, useEffect, useCallback } from 'react';
import Taskbar from './components/Taskbar';
import DesktopIcon from './components/DesktopIcon';
import Window from './components/Window';
import Calculator from './components/Calculator';
import TaskMaster from './components/TaskMaster';
import FocusTimer from './components/FocusTimer';
import SnakeGame from './components/SnakeGame';
import OrientationOverlay from './components/OrientationOverlay';
import { AppID, WindowState } from './types';

const INITIAL_WINDOWS: Record<AppID, Partial<WindowState>> = {
  calculator: { id: 'calculator', title: 'Calculator' },
  taskmaster: { id: 'taskmaster', title: 'Task Master' },
  timer: { id: 'timer', title: 'Focus Timer' },
  snake: { id: 'snake', title: 'Game Center' },
  start: { id: 'start', title: 'Start' }
};

const App: React.FC = () => {
  const [isLandscape, setIsLandscape] = useState(true);
  const [openWindows, setOpenWindows] = useState<WindowState[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<AppID | null>(null);
  const [maxZIndex, setMaxZIndex] = useState(10);
  const [isStartOpen, setIsStartOpen] = useState(false);

  const checkOrientation = useCallback(() => {
    setIsLandscape(window.innerWidth > window.innerHeight);
  }, []);

  useEffect(() => {
    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    return () => window.removeEventListener('resize', checkOrientation);
  }, [checkOrientation]);

  const toggleWindow = (id: AppID) => {
    const existing = openWindows.find(w => w.id === id);
    if (existing) {
      if (existing.isMinimized) {
        focusWindow(id);
      } else {
        closeWindow(id);
      }
    } else {
      const newWin: WindowState = {
        id,
        title: INITIAL_WINDOWS[id].title || id,
        isOpen: true,
        isMinimized: false,
        zIndex: maxZIndex + 1,
        position: { x: 50 + openWindows.length * 30, y: 50 + openWindows.length * 30 }
      };
      setOpenWindows([...openWindows, newWin]);
      setMaxZIndex(prev => prev + 1);
      setActiveWindowId(id);
    }
  };

  const focusWindow = (id: AppID) => {
    setOpenWindows(prev => prev.map(w => 
      w.id === id ? { ...w, zIndex: maxZIndex + 1, isMinimized: false } : w
    ));
    setMaxZIndex(prev => prev + 1);
    setActiveWindowId(id);
  };

  const closeWindow = (id: AppID) => {
    setOpenWindows(prev => prev.filter(w => w.id !== id));
    if (activeWindowId === id) setActiveWindowId(null);
  };

  const updatePosition = (id: AppID, pos: { x: number; y: number }) => {
    setOpenWindows(prev => prev.map(w => w.id === id ? { ...w, position: pos } : w));
  };

  const renderWindowContent = (id: AppID) => {
    switch (id) {
      case 'calculator': return <Calculator />;
      case 'taskmaster': return <TaskMaster />;
      case 'timer': return <FocusTimer />;
      case 'snake': return <SnakeGame />;
      default: return null;
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-cover bg-center transition-all duration-500"
         style={{ backgroundImage: `url('https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1974&auto=format&fit=crop')` }}>
      
      <OrientationOverlay isLandscape={isLandscape} />

      {/* Desktop Icons */}
      <div className="p-6 grid grid-flow-col grid-rows-4 gap-4 w-fit h-fit">
        <DesktopIcon icon="fa-calculator" label="Calculator" color="bg-blue-500" onClick={() => toggleWindow('calculator')} />
        <DesktopIcon icon="fa-list-check" label="Task Master" color="bg-emerald-500" onClick={() => toggleWindow('taskmaster')} />
        <DesktopIcon icon="fa-stopwatch" label="Focus Timer" color="bg-orange-500" onClick={() => toggleWindow('timer')} />
        <DesktopIcon icon="fa-gamepad" label="Snake Game" color="bg-purple-500" onClick={() => toggleWindow('snake')} />
      </div>

      {/* Windows Layer */}
      {openWindows.map(win => (
        <Window
          key={win.id}
          window={win}
          isActive={activeWindowId === win.id}
          onFocus={() => focusWindow(win.id)}
          onClose={() => closeWindow(win.id)}
          onMove={(pos) => updatePosition(win.id, pos)}
        >
          {renderWindowContent(win.id)}
        </Window>
      ))}

      {/* Start Menu Placeholder */}
      {isStartOpen && (
        <div className="absolute bottom-14 left-1/2 -translate-x-1/2 w-[400px] h-[500px] glass-dark rounded-xl z-[9999] p-6 text-white animate-in slide-in-from-bottom-4 duration-300">
          <div className="flex justify-between items-center mb-6">
             <h2 className="text-xl font-semibold">Pinned</h2>
             <button className="text-xs bg-white/10 px-2 py-1 rounded hover:bg-white/20 transition">All apps &gt;</button>
          </div>
          <div className="grid grid-cols-3 gap-4">
             {['Calculator', 'Snake', 'Timer', 'Tasks', 'Settings', 'Files'].map(app => (
               <div key={app} className="flex flex-col items-center gap-2 p-2 hover:bg-white/5 rounded-lg transition cursor-pointer">
                  <div className="w-10 h-10 rounded bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                    <i className="fa-solid fa-rocket text-lg"></i>
                  </div>
                  <span className="text-xs">{app}</span>
               </div>
             ))}
          </div>
          <div className="absolute bottom-0 left-0 w-full p-4 border-t border-white/10 flex justify-between items-center bg-black/20 rounded-b-xl">
             <div className="flex items-center gap-3">
                <img src="https://picsum.photos/id/64/32/32" className="rounded-full" alt="User" />
                <span className="text-sm font-medium">User Account</span>
             </div>
             <i className="fa-solid fa-power-off opacity-80 hover:opacity-100 cursor-pointer"></i>
          </div>
        </div>
      )}

      {/* Taskbar */}
      <Taskbar 
        openWindows={openWindows} 
        activeWindowId={activeWindowId}
        onToggleStart={() => setIsStartOpen(!isStartOpen)}
        onAppClick={(id) => focusWindow(id)}
      />
    </div>
  );
};

export default App;
