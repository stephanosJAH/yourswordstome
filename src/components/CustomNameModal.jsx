import React, { useState, useEffect, useRef } from 'react';
import { X, User } from 'lucide-react';

const CustomNameModal = ({ isOpen, onClose, onConfirm }) => {
  const [customName, setCustomName] = useState('');
  const inputRef = useRef(null);
  const previousFocusRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement;
      setTimeout(() => inputRef.current?.focus(), 50);
    } else if (previousFocusRef.current) {
      previousFocusRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') handleClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
        aria-hidden="true"
      ></div>

      {/* Modal */}
      <div className="relative glass-card shadow-2xl max-w-md w-full p-4 sm:p-6 transform transition-all animate-scale-in">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-400 hover:text-gray-600 transition-colors touch-target"
          aria-label="Cerrar diálogo"
        >
          <X size={20} className="sm:w-6 sm:h-6" aria-hidden="true" />
        </button>

        {/* Header */}
        <div className="mb-4 sm:mb-6 pr-8">
          <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
            <div className="bg-primary/10 p-2 sm:p-3 rounded-xl">
              <User className="text-primary" size={20} aria-hidden="true" />
            </div>
            <h2 id="modal-title" className="text-lg sm:text-2xl font-bold text-light-text">
              Generar para otra persona
            </h2>
          </div>
          <p className="text-light-subtle text-xs sm:text-sm">
            Ingresa el nombre de la persona para quien deseas generar el versículo personalizado
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div>
            <label htmlFor="custom-name-input" className="block text-xs sm:text-sm font-semibold text-light-text mb-2">
              Nombre
            </label>
            <input
              id="custom-name-input"
              ref={inputRef}
              type="text"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder="Ej: María, Juan, Pedro..."
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm sm:text-base"
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="w-full sm:flex-1 px-4 py-2.5 sm:py-3 border border-gray-300 text-light-text rounded-xl hover:bg-gray-50 transition-colors font-semibold text-sm sm:text-base touch-target"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!customName.trim()}
              className="w-full sm:flex-1 px-4 py-2.5 sm:py-3 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base touch-target"
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
