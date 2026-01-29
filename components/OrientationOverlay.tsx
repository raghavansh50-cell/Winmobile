
import React from 'react';

interface Props {
  isLandscape: boolean;
}

const OrientationOverlay: React.FC<Props> = ({ isLandscape }) => {
  if (isLandscape) return null;

  return (
    <div className="fixed inset-0 z-[10000] bg-zinc-900 flex flex-col items-center justify-center text-white p-10 text-center">
      <div className="relative mb-8">
        <i className="fa-solid fa-mobile-screen text-6xl opacity-30"></i>
        <i className="fa-solid fa-rotate text-4xl absolute -bottom-2 -right-2 text-blue-500 animate-spin"></i>
      </div>
      <h1 className="text-2xl font-bold mb-4">Landscape Only</h1>
      <p className="text-zinc-400 max-w-xs">
        Please rotate your device to landscape mode to experience the Windows Desktop interface.
      </p>
    </div>
  );
};

export default OrientationOverlay;
