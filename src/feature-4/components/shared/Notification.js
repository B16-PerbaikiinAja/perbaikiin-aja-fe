import React from 'react'; 
import { CheckCircle, AlertCircle, X } from 'lucide-react';

const Notification = ({ message, type, onClose }) => {
  if (!message) return null;

  const bgColor = type === 'success' ? 'bg-green-100 border-green-400 text-green-700' : 'bg-red-100 border-red-400 text-red-700';
  const Icon = type === 'success' ? CheckCircle : AlertCircle;
  const iconColor = type === 'success' ? 'text-green-500' : 'text-red-500';

  return (
    <div className={`fixed top-5 right-5 ${bgColor} border-l-4 p-4 rounded-md shadow-lg flex items-center z-50 max-w-sm animate-fadeIn`}>
      <Icon size={24} className={`${iconColor} mr-3 flex-shrink-0`} />
      <span className="flex-grow">{message}</span>
      <button onClick={onClose} className={`ml-4 text-gray-500 hover:text-gray-700`}>
        <X size={20} />
      </button>
    </div>
  );
};

export default Notification; // Export if in separate file