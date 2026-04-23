/**
 * SysDraw - Context Menu
 * Appears on right-click on canvas objects.
 * Options: Edit Label, Duplicate, Delete, Bring to Front, Send to Back
 */
import React, { useEffect, useRef } from 'react';
import './ContextMenu.css';

const ITEMS = [
  { label: 'Edit Label', icon: '✏', action: 'edit' },
  { label: 'Duplicate', icon: '⧉', action: 'duplicate' },
  { label: 'Bring to Front', icon: '▲', action: 'front' },
  { label: 'Send to Back', icon: '▼', action: 'back' },
  { divider: true },
  { label: 'Delete', icon: '🗑', action: 'delete', danger: true },
];

const ContextMenu = ({ x, y, onAction, onClose }) => {
  const ref = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="ctx-menu"
      style={{ top: y, left: x }}
    >
      {ITEMS.map((item, i) =>
        item.divider ? (
          <div key={`div-${i}`} className="ctx-divider" />
        ) : (
          <button
            key={item.action}
            className={`ctx-item${item.danger ? ' ctx-item--danger' : ''}`}
            onClick={() => { onAction(item.action); onClose(); }}
          >
            <span className="ctx-icon">{item.icon}</span>
            {item.label}
          </button>
        )
      )}
    </div>
  );
};

export default ContextMenu;
