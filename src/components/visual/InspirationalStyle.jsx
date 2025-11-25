import React from 'react';

const InspirationalStyle = ({ personalizedText, reference }) => {
  return (
    <div className="w-[min(540px,100vw-2rem)] h-[min(540px,100vw-2rem)] bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-8 sm:p-12 flex flex-col justify-center items-center relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-6 left-6 sm:top-12 sm:left-12 text-white/20 text-6xl sm:text-8xl font-dancing">"</div>
      <div className="absolute bottom-6 right-6 sm:bottom-12 sm:right-12 text-white/20 text-6xl sm:text-8xl font-dancing">"</div>

      {/* Content */}
      <div className="text-center z-10 px-4">
        <p className="font-dancing text-2xl sm:text-3xl md:text-4xl text-white leading-relaxed mb-4 sm:mb-6">
          {personalizedText}
        </p>
        <div className="flex items-center justify-center space-x-3 mb-3 sm:mb-4">
          <div className="h-px w-10 sm:w-12 bg-white/60"></div>
          <div className="w-2 h-2 bg-white rounded-full"></div>
          <div className="h-px w-10 sm:w-12 bg-white/60"></div>
        </div>
        <p className="font-lato text-base sm:text-lg text-white/90 font-medium">
          {reference}
        </p>
      </div>

      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
    </div>
  );
};

export default InspirationalStyle;
