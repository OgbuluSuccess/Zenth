import React, { useState, useEffect } from 'react';
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from 'react-icons/fi';

const Toast = ({ message, type = 'success', duration = 3000, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) setTimeout(onClose, 300); // Allow animation to complete before removing
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const handleClose = () => {
    setVisible(false);
    if (onClose) setTimeout(onClose, 300);
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FiCheckCircle className="h-5 w-5" />;
      case 'error':
        return <FiAlertCircle className="h-5 w-5" />;
      case 'info':
      default:
        return <FiInfo className="h-5 w-5" />;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      case 'info':
      default:
        return 'bg-blue-500';
    }
  };

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 transform transition-transform duration-300 ease-in-out ${visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
    >
      <div className={`${getBackgroundColor()} text-white px-4 py-3 rounded-lg shadow-lg flex items-center max-w-md`}>
        <div className="mr-3">{getIcon()}</div>
        <div className="flex-1">{message}</div>
        <button
          onClick={handleClose}
          className="ml-4 text-white hover:text-gray-200 focus:outline-none"
        >
          <FiX className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default Toast;
