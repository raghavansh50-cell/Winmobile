
import React from 'react';

interface Props {
  icon: string;
  label: string;
  color: string;
  onClick: () => void;
}

const DesktopIcon: React.FC<Props> = ({ icon, label, color, onClick }) => {
  return (
    <button 
      onClick={onClick}
      className="flex flex-col items-center gap-1 w-20 p-2 rounded hover:bg-white/10 active:scale-95 transition-all group select-none"
    >
      <div className={`w-12 h-12 ${color} rounded-xl shadow-lg flex items-center justify-center text-white text-2xl group-hover:scale-105 transition-transform`}>
        <i className={`fa-solid ${icon}`}></i>
      </div>
      <span className="text-[11px] text-white text-center font-medium drop-shadow-md break-words w-full">
        {label}
      </span>
    </button>
  );
};

export default DesktopIcon;
