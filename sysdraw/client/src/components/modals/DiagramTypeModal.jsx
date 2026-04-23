/**
 * SysDraw - Diagram Type Selection Modal
 * Matches Image 4: DIAGRAM panel with search + list of diagram types
 */
import React, { useState } from 'react';
import './Modal.css';

const TYPES = [
  { value: 'class', label: 'Class Diagram', icon: '▭' },
  { value: 'usecase', label: 'Use Case Diagram', icon: '⬭' },
  { value: 'sequence', label: 'Sequence Diagram', icon: '⟶' },
  { value: 'activity', label: 'Activity Diagram', icon: '◇' },
];

const DiagramTypeModal = ({ onSelect, onBack }) => {
  const [query, setQuery] = useState('');

  const filtered = TYPES.filter((t) =>
    t.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="modal-overlay">
      <div className="modal modal--diagram fade-in">
        {/* Header */}
        <div className="diagram-type-header">
          <button className="diagram-type-back" onClick={onBack}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <span className="diagram-type-title">DIAGRAM</span>
        </div>

        {/* Search */}
        <div className="diagram-type-search">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9999b5" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            placeholder='Try "infographic" or "flowchart"'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {/* List */}
        <div className="diagram-type-list">
          {filtered.map((type) => (
            <button
              key={type.value}
              className="diagram-type-item"
              onClick={() => onSelect(type.value)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              <span className="diagram-type-icon-file">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="1.5">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
              </span>
              <span className="diagram-type-label">{type.label}</span>
            </button>
          ))}
          {!filtered.length && (
            <div className="diagram-type-empty">No diagram types found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiagramTypeModal;
