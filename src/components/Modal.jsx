import { useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';

function Modal({ isOpen, onClose, children }) {
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-phantom/80 flex justify-center items-center z-50 transition-opacity duration-300"
      aria-modal="true"
      role="dialog"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-arsenic rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col transition-transform duration-300 scale-95 opacity-0 animate-fade-scale-in"
      >
        <div className="flex justify-end p-2">
          <button onClick={onClose} className="text-space hover:text-cloud p-2 rounded-full transition-colors">
            <FaTimes size={20} />
          </button>
        </div>
        <div className="overflow-y-auto h-full">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Modal;