import React from 'react';

const ClassicStyle = ({ personalizedText, reference }) => {
  return (
    <div className="w-[min(540px,100vw-2rem)] h-[min(540px,100vw-2rem)] bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-100 p-8 sm:p-12 flex flex-col justify-center items-center relative overflow-hidden">
      {/* Decorative corners */}
      <div className="absolute top-4 left-4 sm:top-8 sm:left-8 w-12 h-12 sm:w-16 sm:h-16 border-t-2 border-l-2 border-amber-400"></div>
      <div className="absolute top-4 right-4 sm:top-8 sm:right-8 w-12 h-12 sm:w-16 sm:h-16 border-t-2 border-r-2 border-amber-400"></div>
      <div className="absolute bottom-4 left-4 sm:bottom-8 sm:left-8 w-12 h-12 sm:w-16 sm:h-16 border-b-2 border-l-2 border-amber-400"></div>
      <div className="absolute bottom-4 right-4 sm:bottom-8 sm:right-8 w-12 h-12 sm:w-16 sm:h-16 border-b-2 border-r-2 border-amber-400"></div>

      {/* Content */}
      <div className="text-center z-10 px-4">
        <p className="font-playfair text-xl sm:text-2xl md:text-3xl text-gray-800 leading-relaxed mb-6 sm:mb-8" 
           style={{ textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
          "{personalizedText}"
        </p>
        <p className="font-playfair text-base sm:text-lg text-gray-600 italic">
          — {reference}
        </p>
      </div>

      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/4 w-24 h-24 sm:w-32 sm:h-32 border border-amber-600 rounded-full"></div>
        <div className="absolute bottom-1/4 right-1/4 w-32 h-32 sm:w-40 sm:h-40 border border-amber-600 rounded-full"></div>
      </div>
    </div>
  );
};

export default ClassicStyle;
