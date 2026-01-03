import React, { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const toastTypes = {
  success: {
    icon: <CheckCircle size={20} />,
    color: '#4CAF50',
    bgColor: '#E8F5E9',
    borderColor: '#C8E6C9'
  },
  error: {
    icon: <AlertCircle size={20} />,
    color: '#F44336',
    bgColor: '#FFEBEE',
    borderColor: '#FFCDD2'
  },
  info: {
    icon: <Info size={20} />,
    color: '#2196F3',
    bgColor: '#E3F2FD',
    borderColor: '#BBDEFB'
  }
};

const Toast = ({ message, type = 'info', onClose, duration = 3000 }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Small delay to allow enter animation
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Wait for exit animation
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const styleConfig = toastTypes[type] || toastTypes.info;

  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 9999,
        background: 'white',
        borderLeft: `4px solid ${styleConfig.color}`,
        borderRadius: '8px',
        padding: '16px 20px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        minWidth: '300px',
        maxWidth: '90vw',
        transform: isVisible ? 'translateX(0)' : 'translateX(120%)',
        opacity: isVisible ? 1 : 0,
        transition: 'all 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55)',
      }}
    >
      <div style={{ color: styleConfig.color, display: 'flex' }}>
        {styleConfig.icon}
      </div>
      <p style={{ margin: 0, flex: 1, fontSize: '0.95rem', color: '#333', fontWeight: 500 }}>
        {message}
      </p>
      <button
        onClick={() => {
          setIsVisible(false);
          setTimeout(onClose, 300);
        }}
        style={{
          background: 'none',
          border: 'none',
          color: '#999',
          cursor: 'pointer',
          padding: '4px',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default Toast;
