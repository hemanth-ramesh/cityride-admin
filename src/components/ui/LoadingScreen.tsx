import React from 'react';

interface LoadingScreenProps {
  message?: string;
  subtext?: string;
  fullScreen?: boolean;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = 'Loading',
  subtext = 'CityRide Operations Console',
  fullScreen = true,
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center select-none ${
        fullScreen
          ? 'fixed inset-0 z-50 bg-[#0a0a0c] text-white'
          : 'h-64 w-full rounded-2xl bg-[#0a0a0c] p-8 text-white'
      }`}
    >
      {/* Minimal Standard Black Smooth Spinner */}
      <div className="relative flex items-center justify-center">
        {/* Track Ring */}
        <div className="h-10 w-10 rounded-full border-[2.5px] border-white/10" />
        {/* Spinning Indicator */}
        <div className="absolute h-10 w-10 rounded-full border-[2.5px] border-transparent border-t-white animate-spin [animation-duration:0.85s]" />
      </div>

      {/* Clean Bottom Text */}
      <div className="mt-6 flex flex-col items-center space-y-1">
        <p className="text-xs font-semibold tracking-widest text-white/90 uppercase">
          {message}
        </p>
        {subtext && (
          <span className="text-[11px] font-medium tracking-wide text-white/40">
            {subtext}
          </span>
        )}
      </div>
    </div>
  );
};
