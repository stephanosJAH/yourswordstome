import React from 'react';

const ModernStyle = ({ personalizedText, reference }) => {
  return (
    <div 
      className="w-[min(540px,100vw-2rem)] h-[min(540px,100vw-2rem)] relative flex flex-col justify-center items-center p-8 sm:p-12"
      style={{
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.6)), url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1080&h=1080&fit=crop)',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* Content */}
      <div className="text-center z-10 px-4">
        <p className="font-montserrat text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight mb-6 sm:mb-8">
          {personalizedText}
        </p>
        <div className="h-1 w-20 sm:w-24 bg-white mx-auto mb-4 sm:mb-6"></div>
        <p className="font-montserrat text-lg sm:text-xl text-white/90">
          {reference}
        </p>
      </div>
    </div>
  );
};

export default ModernStyle;
