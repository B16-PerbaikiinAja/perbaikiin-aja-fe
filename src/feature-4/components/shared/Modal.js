import React from 'react'; 

const Modal = ({ isOpen, onClose, onConfirm, title, children, confirmText = "Confirm", cancelText = "Cancel", confirmButtonClass = "bg-red-600 hover:bg-red-700 focus:ring-red-500" }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md transform transition-all">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">{title}</h3>
        <div className="text-gray-700 mb-6">{children}</div>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-medium text-white ${confirmButtonClass} rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;