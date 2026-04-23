/**
 * SysDraw - Properties Panel
 * Appears in the right area when a canvas element is selected.
 * Allows editing element name, color, and attributes.
 */
import React, { useState, useEffect } from 'react';
import './PropertiesPanel.css';

const PropertiesPanel = ({ selectedObject, onUpdate, onClose }) => {
  const [label, setLabel] = useState('');
  const [fillColor, setFillColor] = useState('#f5f3ff');

  useEffect(() => {
    if (selectedObject) {
      setLabel(selectedObject.data?.name || selectedObject.text || '');
      setFillColor(selectedObject.fill || '#f5f3ff');
    }
  }, [selectedObject]);

  if (!selectedObject) return null;

  const handleApply = () => {
    onUpdate?.({ name: label, fill: fillColor });
  };

  const type = selectedObject.data?.type || selectedObject.type || 'Object';

  return (
    <div className="props-panel">
      <div className="props-header">
        <span className="props-title">Properties</span>
        <button className="props-close" onClick={onClose}>✕</button>
      </div>

      <div className="props-body">
        {/* Type badge */}
        <div className="props-type-badge">{type.toUpperCase()}</div>

        {/* Label */}
        <div className="props-field">
          <label>Label</label>
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Element name"
            className="props-input"
          />
        </div>

        {/* Fill color */}
        <div className="props-field">
          <label>Fill Color</label>
          <div className="props-color-row">
            <input
              type="color"
              value={fillColor}
              onChange={(e) => setFillColor(e.target.value)}
              className="props-color-swatch"
            />
            <input
              value={fillColor}
              onChange={(e) => setFillColor(e.target.value)}
              className="props-input"
              placeholder="#f5f3ff"
            />
          </div>
        </div>

        {/* Attributes section (for class/entity) */}
        {['class', 'interface', 'abstract', 'enum', 'entity'].includes(type) && (
          <div className="props-field">
            <label>Attributes</label>
            <div className="props-attr-list">
              {(selectedObject.data?.attributes || []).map((attr, i) => (
                <div key={i} className="props-attr-row">
                  <span className="props-attr-name">{attr.name}</span>
                  <span className="props-attr-type">{attr.type}</span>
                </div>
              ))}
              {!(selectedObject.data?.attributes?.length) && (
                <div className="props-attr-empty">No attributes defined</div>
              )}
            </div>
          </div>
        )}

        {/* Position info (read-only) */}
        <div className="props-field">
          <label>Position</label>
          <div className="props-pos-row">
            <div className="props-pos-item">
              <span>X</span>
              <span className="props-pos-val">{Math.round(selectedObject.left || 0)}</span>
            </div>
            <div className="props-pos-item">
              <span>Y</span>
              <span className="props-pos-val">{Math.round(selectedObject.top || 0)}</span>
            </div>
            <div className="props-pos-item">
              <span>W</span>
              <span className="props-pos-val">{Math.round((selectedObject.width || 0) * (selectedObject.scaleX || 1))}</span>
            </div>
            <div className="props-pos-item">
              <span>H</span>
              <span className="props-pos-val">{Math.round((selectedObject.height || 0) * (selectedObject.scaleY || 1))}</span>
            </div>
          </div>
        </div>

        <button className="props-apply-btn" onClick={handleApply}>Apply Changes</button>
      </div>
    </div>
  );
};

export default PropertiesPanel;
