import React from 'react';
import { X, Check } from 'lucide-react';

const ModernImageModal = ({ isOpen, onClose, images, selectedImage, onSelect }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Seleccionar imagen</h2>
            <p className="text-xs text-gray-500 mt-0.5">Elige el fondo para el estilo Moderno</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Grid */}
        <div className="overflow-y-auto p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {images.map((img, i) => {
              const isSelected = selectedImage === img;
              return (
                <button
                  key={i}
                  onClick={() => { onSelect(img); onClose(); }}
                  className="relative aspect-square rounded-xl overflow-hidden group focus:outline-none"
                  style={{
                    boxShadow: isSelected
                      ? '0 0 0 3px #6366f1'
                      : '0 0 0 2px transparent',
                    transition: 'box-shadow 0.15s ease'
                  }}
                >
                  <img
                    src={img}
                    alt={`Fondo ${i + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

                  {/* Selected indicator */}
                  {isSelected && (
                    <div className="absolute inset-0 bg-indigo-500/20 flex items-center justify-center">
                      <div className="bg-indigo-500 rounded-full p-1.5 shadow-lg">
                        <Check size={14} className="text-white" />
                      </div>
                    </div>
                  )}

                  {/* Image number badge */}
                  {!isSelected && (
                    <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      {i + 1}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-semibold text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModernImageModal;
