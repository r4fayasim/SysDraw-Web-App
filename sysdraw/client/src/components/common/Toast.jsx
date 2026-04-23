/**
 * SysDraw - Toast Notification
 * Lightweight in-app notifications (success / error / info)
 */
import React, { useEffect } from 'react';
import './Toast.css';

const Toast = ({ message, type = 'info', onClose, duration = 3000 }) => {
  useEffect(() => {
    if (!duration) return;
    const t = setTimeout(onClose, duration);
    return () => clearTimeout(t);
  }, [duration, onClose]);

  const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
    warning: '⚠',
  };

  return (
    <div className={`toast toast--${type}`} role="alert">
      <span className="toast-icon">{icons[type] || 'ℹ'}</span>
      <span className="toast-message">{message}</span>
      <button className="toast-close" onClick={onClose} aria-label="Dismiss">✕</button>
    </div>
  );
};

export default Toast;
