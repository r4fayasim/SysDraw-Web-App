/**
 * SysDraw - Right Panel
 * Shows vertical icon toolbar + Pages panel (matching images 5 & 9)
 */
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { diagramAPI } from '../../services/api';
import './RightPanel.css';

const RightPanel = ({ onPageChange }) => {
  const { currentProject, setCurrentProject, currentPage, setCurrentPage } = useApp();
  const [showPages, setShowPages] = useState(true);
  const pages = currentProject?.pages || [];

  const handleAddPage = async () => {
    if (!currentProject) return;
    try {
      const { data } = await diagramAPI.addPage(currentProject.id, `Page-${pages.length + 1}`);
      setCurrentProject(data);
    } catch (err) {
      console.error('Failed to add page', err);
    }
  };

  const handleSelectPage = (page) => {
    setCurrentPage(page);
    onPageChange?.(page);
  };

  return (
    <div className="right-panel">
      {/* ── Icon toolbar (vertical strip) ── */}
      <div className="right-icons">
        {[
          { icon: '☰', tip: 'Layers', onClick: () => {} },
          { icon: '▭', tip: 'Shapes', onClick: () => {} },
          { icon: '🔍+', tip: 'Zoom in', onClick: () => {} },
          { icon: '🕐', tip: 'History', onClick: () => {} },
          { icon: '✏️', tip: 'Edit', onClick: () => {} },
          { icon: '📋', tip: 'Pages', onClick: () => setShowPages((v) => !v) },
          { icon: '👁', tip: 'View', onClick: () => {} },
        ].map(({ icon, tip, onClick }) => (
          <button key={tip} className="right-icon-btn" title={tip} onClick={onClick}>
            {icon}
          </button>
        ))}
      </div>

      {/* ── Pages panel ── */}
      {showPages && (
        <div className="right-pages">
          <div className="right-pages-header">
            <span>Pages</span>
          </div>

          {/* Default group */}
          <div className="right-pages-group">
            <div className="right-pages-group-label">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 18l6-6-6-6" />
              </svg>
              Default
            </div>

            {/* Page thumbnails */}
            {pages.map((page, idx) => (
              <div
                key={page.id}
                className={`right-page-thumb ${currentPage?.id === page.id ? 'active' : ''}`}
                onClick={() => handleSelectPage(page)}
              >
                {/* Thumbnail preview box */}
                <div className="right-page-preview">
                  {currentPage?.id === page.id && (
                    <div className="right-page-preview-label">Current page</div>
                  )}
                  {/* Mini add icon */}
                  <div className="right-page-plus">+</div>
                </div>
                <span className="right-page-name">{page.name}</span>
              </div>
            ))}

            {/* Add page button */}
            <button className="right-add-page" onClick={handleAddPage}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RightPanel;
