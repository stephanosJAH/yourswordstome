import React from 'react';

const InspirationalStyle = ({ personalizedText, reference }) => {
  return (
    <div className="w-[540px] h-[540px] bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-12 flex flex-col justify-center items-center relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-12 left-12 text-white/20 text-8xl font-dancing">"</div>
      <div className="absolute bottom-12 right-12 text-white/20 text-8xl font-dancing">"</div>

      {/* Content */}
      <div className="text-center z-10">
        <p className="font-dancing text-3xl md:text-4xl text-white leading-relaxed mb-6 px-6">
          {personalizedText}
        </p>
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="h-px w-12 bg-white/60"></div>
          <div className="w-2 h-2 bg-white rounded-full"></div>
          <div className="h-px w-12 bg-white/60"></div>
        </div>
        <p className="font-lato text-lg text-white/90 font-medium">
          {reference}
        </p>
      </div>

      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
    </div>
  );
};

export default InspirationalStyle;
