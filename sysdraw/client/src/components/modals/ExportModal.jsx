/**
 * SysDraw - Export Modal
 * Matches Image 9: EXPORT panel with SQL Schema, Java Code, Python options
 */
import React, { useState } from 'react';
import { diagramAPI } from '../../services/api';
import './Modal.css';

const EXPORT_OPTIONS = [
  {
    format: 'sql',
    label: 'Generate SQL Schema',
    color: '#2962ff',
    bg: '#e8f0fe',
    icon: (
      <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
        <rect width="40" height="40" rx="8" fill="#2962ff" />
        <text x="20" y="26" textAnchor="middle" fontSize="13" fontWeight="bold" fill="white" fontFamily="monospace">SQL</text>
      </svg>
    ),
  },
  {
    format: 'java',
    label: 'Export as Java Code',
    color: '#e76f00',
    bg: '#fff3e0',
    icon: (
      <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
        <rect width="40" height="40" rx="20" fill="#fff3e0" />
        <text x="20" y="27" textAnchor="middle" fontSize="20" fontFamily="serif">☕</text>
      </svg>
    ),
  },
  {
    format: 'python',
    label: 'Export as Python',
    color: '#3572A5',
    bg: '#e8f4fd',
    icon: (
      <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
        <rect width="40" height="40" rx="20" fill="#e8f4fd" />
        <text x="20" y="27" textAnchor="middle" fontSize="20" fontFamily="serif">🐍</text>
      </svg>
    ),
  },
];

const ExportModal = ({ onClose, currentElements = [], projectId }) => {
  const [loading, setLoading] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleExport = async (format) => {
    setLoading(format);
    setError('');
    setResult(null);
    try {
      const { data } = await diagramAPI.export(projectId, format, currentElements);
      setResult({ format, code: data.code });
    } catch (err) {
      setError(err.response?.data?.error || 'Export failed.');
    } finally {
      setLoading(null);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result.code);
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal modal--export fade-in">
        {/* Title */}
        <div className="export-title">EXPORT</div>

        {!result ? (
          /* Options list */
          <div className="export-options">
            {EXPORT_OPTIONS.map((opt) => (
              <button
                key={opt.format}
                className="export-option-btn"
                onClick={() => handleExport(opt.format)}
                disabled={!!loading}
                style={{ '--opt-bg': opt.bg }}
              >
                <span className="export-option-icon">{opt.icon}</span>
                <span className="export-option-label" style={{ color: opt.color }}>
                  {loading === opt.format ? 'Generating…' : opt.label}
                </span>
              </button>
            ))}
          </div>
        ) : (
          /* Result view */
          <div className="export-result">
            <div className="export-result-header">
              <span className="export-result-format">{result.format.toUpperCase()} Output</span>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="export-result-copy" onClick={copyToClipboard}>Copy</button>
                <button className="export-result-back" onClick={() => setResult(null)}>← Back</button>
              </div>
            </div>
            <pre className="export-code-block">{result.code}</pre>
          </div>
        )}

        {error && <div className="modal-error" style={{ margin: '0 20px 12px' }}>{error}</div>}

        <button className="export-close-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default ExportModal;
