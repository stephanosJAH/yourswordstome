import React from 'react';

const ClassicStyle = ({ personalizedText, reference }) => {
  return (
    <div className="w-[540px] h-[540px] bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-100 p-12 flex flex-col justify-center items-center relative overflow-hidden">
      {/* Decorative corners */}
      <div className="absolute top-8 left-8 w-16 h-16 border-t-2 border-l-2 border-amber-400"></div>
      <div className="absolute top-8 right-8 w-16 h-16 border-t-2 border-r-2 border-amber-400"></div>
      <div className="absolute bottom-8 left-8 w-16 h-16 border-b-2 border-l-2 border-amber-400"></div>
      <div className="absolute bottom-8 right-8 w-16 h-16 border-b-2 border-r-2 border-amber-400"></div>

      {/* Content */}
      <div className="text-center z-10">
        <p className="font-playfair text-2xl md:text-3xl text-gray-800 leading-relaxed mb-8 px-4" 
           style={{ textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
          "{personalizedText}"
        </p>
        <p className="font-playfair text-lg text-gray-600 italic">
          — {reference}
        </p>
      </div>

      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-amber-600 rounded-full"></div>
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 border border-amber-600 rounded-full"></div>
      </div>
    </div>
  );
};

export default ClassicStyle;
