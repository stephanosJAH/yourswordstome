import React, { useState } from 'react';
import { X, User } from 'lucide-react';

const CustomNameModal = ({ isOpen, onClose, onConfirm }) => {
  const [customName, setCustomName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (customName.trim()) {
      onConfirm(customName.trim());
      setCustomName('');
    }
  };

  const handleClose = () => {
    setCustomName('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={handleClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-4 sm:p-6 transform transition-all">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={20} className="sm:w-6 sm:h-6" />
        </button>

        {/* Header */}
        <div className="mb-4 sm:mb-6 pr-8">
          <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
            <div className="bg-accent/10 p-2 sm:p-3 rounded-full">
              <User className="text-accent" size={20} />
            </div>
            <h2 className="text-lg sm:text-2xl font-bold text-primary">
              Generar para otra persona
            </h2>
          </div>
          <p className="text-gray-600 text-xs sm:text-sm">
            Ingresa el nombre de la persona para quien deseas generar el versículo personalizado
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
              Nombre
            </label>
            <input
              type="text"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder="Ej: María, Juan, Pedro..."
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all text-sm sm:text-base"
              autoFocus
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="w-full sm:flex-1 px-4 py-2.5 sm:py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-sm sm:text-base"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!customName.trim()}
              className="w-full sm:flex-1 px-4 py-2.5 sm:py-3 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              Generar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomNameModal;
