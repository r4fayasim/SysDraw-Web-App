/**
 * SysDraw - Top Navbar (Toolbar)
 * Replicates the toolbar shown in images 3–9:
 * Logo | File name | File menu | dots | undo/redo | [canvas tools] | Export | eye | share | avatar
 */
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import ExportModal from '../modals/ExportModal';
import './Navbar.css';

const Navbar = ({ onSave, canUndo, canRedo, onUndo, onRedo, currentElements }) => {
  const { user, logout, currentProject } = useApp();
  const [showExport, setShowExport] = useState(false);
  const [showFileMenu, setShowFileMenu] = useState(false);
  const [fileName, setFileName] = useState(currentProject?.name || 'Untitled');

  return (
    <>
      <nav className="navbar">
        {/* ── Left: Logo + file name + menus ── */}
        <div className="navbar-left">
          {/* Logo */}
          <div className="navbar-logo">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"
                stroke="#fff" strokeWidth="2" strokeLinecap="round" />
              <path d="M14 2v6h6M8 13h8M8 17h5" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <span className="navbar-brand">SysDraw</span>

          {/* File name editable */}
          <input
            className="navbar-filename"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            onBlur={() => onSave && onSave(fileName)}
            spellCheck={false}
          />

          {/* Cloud save indicator */}
          <button className="navbar-icon-btn" title="Saved to cloud" onClick={onSave}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </button>

          {/* File dropdown */}
          <div className="navbar-menu-wrap">
            <button
              className="navbar-menu-btn"
              onClick={() => setShowFileMenu((v) => !v)}
            >
              File ▾
            </button>
            {showFileMenu && (
              <div className="navbar-dropdown" onMouseLeave={() => setShowFileMenu(false)}>
                {['New File', 'Open…', 'Save', 'Save As…', 'Export'].map((item) => (
                  <button
                    key={item}
                    className="navbar-dropdown-item"
                    onClick={() => {
                      if (item === 'Save') onSave?.();
                      if (item === 'Export') setShowExport(true);
                      setShowFileMenu(false);
                    }}
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Kebab menu */}
          <button className="navbar-icon-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="5" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="19" r="1.5" />
            </svg>
          </button>

          {/* Undo */}
          <button
            className="navbar-icon-btn"
            onClick={onUndo}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <polyline points="9 14 4 9 9 4" /><path d="M20 20v-7a4 4 0 0 0-4-4H4" />
            </svg>
          </button>

          {/* Redo */}
          <button
            className="navbar-icon-btn"
            onClick={onRedo}
            disabled={!canRedo}
            title="Redo (Ctrl+Y)"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <polyline points="15 14 20 9 15 4" /><path d="M4 20v-7a4 4 0 0 1 4-4h12" />
            </svg>
          </button>
        </div>

        {/* ── Right: Export + preview + share + avatar ── */}
        <div className="navbar-right">
          <button className="navbar-export-btn" onClick={() => setShowExport(true)}>
            Export ▾
          </button>

          <button className="navbar-icon-btn" title="Preview">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </button>

          <button className="navbar-icon-btn" title="Share">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
          </button>

          {/* User avatar */}
          <div className="navbar-avatar" title={user?.username || 'User'}>
            {(user?.fullName || user?.username || 'U')[0].toUpperCase()}
          </div>

          <button className="navbar-logout-btn" onClick={logout} title="Logout">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      </nav>

      {showExport && (
        <ExportModal
          onClose={() => setShowExport(false)}
          currentElements={currentElements}
          projectId={currentProject?.id}
        />
      )}
    </>
  );
};

export default Navbar;
