import React from 'react';

function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 transition-opacity duration-300"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-arsenic rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col"
      >
        <div className="flex justify-end p-2">
          <button onClick={onClose} className="text-space hover:text-cloud text-3xl">&times;</button>
        </div>
        <div className="overflow-y-auto h-full">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Modal;