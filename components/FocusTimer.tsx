
import React, { useState, useEffect, useCallback } from 'react';

const FocusTimer: React.FC = () => {
  const [seconds, setSeconds] = useState(1500); // 25 mins
  const [totalSeconds, setTotalSeconds] = useState(1500);
  const [isActive, setIsActive] = useState(false);

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    let interval: any = null;
    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds(s => s - 1);
      }, 1000);
    } else if (seconds === 0) {
      setIsActive(false);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  const reset = (val: number = 1500) => {
    setIsActive(false);
    setSeconds(val);
    setTotalSeconds(val);
  };

  const progress = ((totalSeconds - seconds) / totalSeconds) * 100;

  return (
    <div className="h-full flex flex-col items-center justify-center p-8 bg-zinc-900 text-white">
      <div className="text-6xl font-bold mb-8 font-mono tracking-tighter">
        {formatTime(seconds)}
      </div>
      
      {/* Progress Bar Container */}
      <div className="w-full bg-white/10 h-3 rounded-full mb-10 relative overflow-hidden">
        <div 
          className="absolute top-0 left-0 h-full bg-orange-500 transition-all duration-1000 ease-linear rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex gap-4 mb-10">
        <button 
          onClick={() => setIsActive(!isActive)}
          className={`w-14 h-14 rounded-full flex items-center justify-center transition shadow-lg ${
            isActive ? 'bg-zinc-700' : 'bg-orange-600 hover:bg-orange-500'
          }`}
        >
          <i className={`fa-solid ${isActive ? 'fa-pause' : 'fa-play'} text-xl`}></i>
        </button>
        <button 
          onClick={() => reset(totalSeconds)}
          className="w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
        >
          <i className="fa-solid fa-rotate-left text-xl"></i>
        </button>
      </div>

      <div className="flex gap-2">
        <TimerPreset label="25m" onClick={() => reset(1500)} />
        <TimerPreset label="15m" onClick={() => reset(900)} />
        <TimerPreset label="5m" onClick={() => reset(300)} />
        <TimerPreset label="1m" onClick={() => reset(60)} />
      </div>
    </div>
  );
};

const TimerPreset: React.FC<{ label: string; onClick: () => void }> = ({ label, onClick }) => (
  <button 
    onClick={onClick}
    className="px-3 py-1 bg-white/5 hover:bg-white/15 rounded-md text-xs transition border border-white/5"
  >
    {label}
  </button>
);

export default FocusTimer;
