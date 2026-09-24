import React from 'react';

export const AmbientBackground: React.FC = () => {
  return (
    <>
      {/* Zero-blur Hardware-Accelerated Ambient Auroras */}
      <div
        className="fixed inset-0 z-0 overflow-hidden pointer-events-none"
        style={{ contain: 'strict' }}
        aria-hidden="true"
      >
        <div className="themed-aurora-1 absolute -top-1/4 -left-1/4 w-[500px] h-[500px] sm:w-[700px] sm:h-[700px] rounded-full animate-aurora-1" />
        <div className="themed-aurora-2 absolute top-1/3 -right-1/4 w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] rounded-full animate-aurora-2" />
        <div className="themed-aurora-3 absolute -bottom-1/4 left-1/3 w-[450px] h-[450px] sm:w-[650px] sm:h-[650px] rounded-full animate-aurora-3" />
      </div>

      {/* Procedural 40px Grid Pattern */}
      <div
        className="themed-grid-bg fixed inset-0 z-0 pointer-events-none opacity-40"
        aria-hidden="true"
      />
    </>
  );
};
