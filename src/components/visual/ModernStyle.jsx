import React from 'react';

const ModernStyle = ({ personalizedText, reference }) => {
  return (
    <div 
      className="w-[540px] h-[540px] relative flex flex-col justify-center items-center p-12"
      style={{
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.6)), url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1080&h=1080&fit=crop)',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* Content */}
      <div className="text-center z-10">
        <p className="font-montserrat text-3xl md:text-4xl font-bold text-white leading-tight mb-8 px-6">
          {personalizedText}
        </p>
        <div className="h-1 w-24 bg-white mx-auto mb-6"></div>
        <p className="font-montserrat text-xl text-white/90">
          {reference}
        </p>
      </div>
    </div>
  );
};

export default ModernStyle;
