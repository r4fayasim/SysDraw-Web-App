/**
 * SysDraw - Left Sidebar (Shape Palette)
 * Shows UML shape groups based on the active diagram type.
 * Users drag shapes onto the canvas.
 */
import React, { useState } from 'react';
import './Sidebar.css';

// ─── Shape Definitions per diagram type ────────────────────────────────────────
const SHAPE_GROUPS = {
  class: {
    label: 'Class',
    shapes: [
      { id: 'class-node', label: 'Class', icon: '▭', color: '#7c6ef7', shape: 'class' },
      { id: 'interface', label: 'Interface', icon: '⟨⟩', color: '#5a56a8', shape: 'interface' },
      { id: 'abstract', label: 'Abstract', icon: '⊘', color: '#9b59b6', shape: 'abstract' },
      { id: 'enum', label: 'Enum', icon: '≡', color: '#f0a060', shape: 'enum' },
      { id: 'package', label: 'Package', icon: '⊞', color: '#c0b0f0', shape: 'package' },
      { id: 'inheritance', label: 'Inherits', icon: '▷', color: '#5a56a8', shape: 'line-inherit' },
      { id: 'association', label: 'Assoc.', icon: '→', color: '#444', shape: 'line-assoc' },
      { id: 'dependency', label: 'Depend', icon: '⇢', color: '#888', shape: 'line-dep' },
      { id: 'aggregation', label: 'Aggreg.', icon: '◇→', color: '#555', shape: 'line-agg' },
      { id: 'composition', label: 'Compos.', icon: '◆→', color: '#333', shape: 'line-comp' },
      { id: 'realization', label: 'Realize', icon: '⇒', color: '#7c6ef7', shape: 'line-real' },
      { id: 'note', label: 'Note', icon: '🗒', color: '#f0e080', shape: 'note' },
    ],
  },
  usecase: {
    label: 'Use Case',
    shapes: [
      { id: 'actor', label: 'Actor', icon: '👤', color: '#555', shape: 'actor' },
      { id: 'usecase', label: 'Use Case', icon: '⬭', color: '#7c6ef7', shape: 'usecase' },
      { id: 'system', label: 'System', icon: '▭', color: '#b0b0d0', shape: 'system' },
      { id: 'association-uc', label: 'Assoc.', icon: '—', color: '#555', shape: 'line-assoc' },
      { id: 'include', label: 'Include', icon: '⇢', color: '#7c6ef7', shape: 'line-include' },
      { id: 'extend', label: 'Extend', icon: '⇠', color: '#9b59b6', shape: 'line-extend' },
      { id: 'generalize', label: 'Generalize', icon: '▷', color: '#5a56a8', shape: 'line-gen' },
      { id: 'subject', label: 'Subject', icon: '▣', color: '#c0b0f0', shape: 'subject' },
      { id: 'note-uc', label: 'Note', icon: '🗒', color: '#f0e080', shape: 'note' },
    ],
  },
  sequence: {
    label: 'Sequence',
    shapes: [
      { id: 'lifeline', label: 'Lifeline', icon: '⬛', color: '#2d2b6b', shape: 'lifeline' },
      { id: 'actor-seq', label: 'Actor', icon: '👤', color: '#555', shape: 'actor' },
      { id: 'boundary', label: 'Boundary', icon: '⊙', color: '#5a56a8', shape: 'boundary' },
      { id: 'control', label: 'Control', icon: '⊛', color: '#9b59b6', shape: 'control' },
      { id: 'entity-seq', label: 'Entity', icon: '⊗', color: '#7c6ef7', shape: 'entity' },
      { id: 'msg-sync', label: 'Sync Msg', icon: '→', color: '#2d2b6b', shape: 'msg-sync' },
      { id: 'msg-async', label: 'Async Msg', icon: '⇢', color: '#5a56a8', shape: 'msg-async' },
      { id: 'msg-return', label: 'Return', icon: '⇠', color: '#888', shape: 'msg-return' },
      { id: 'fragment', label: 'Fragment', icon: '▭', color: '#b0b0d0', shape: 'fragment' },
      { id: 'note-seq', label: 'Note', icon: '🗒', color: '#f0e080', shape: 'note' },
    ],
  },
  activity: {
    label: 'Activity',
    shapes: [
      { id: 'action', label: 'Action', icon: '▬', color: '#7c6ef7', shape: 'action' },
      { id: 'decision', label: 'Decision', icon: '◇', color: '#5a56a8', shape: 'decision' },
      { id: 'merge', label: 'Merge', icon: '◇', color: '#9b59b6', shape: 'merge' },
      { id: 'fork', label: 'Fork', icon: '═', color: '#2d2b6b', shape: 'fork' },
      { id: 'join', label: 'Join', icon: '═', color: '#2d2b6b', shape: 'join' },
      { id: 'initial', label: 'Initial', icon: '●', color: '#222', shape: 'initial' },
      { id: 'final', label: 'Final', icon: '◉', color: '#222', shape: 'final' },
      { id: 'flow-final', label: 'Flow End', icon: '⊗', color: '#f05252', shape: 'flow-final' },
      { id: 'swimlane', label: 'Swimlane', icon: '⊟', color: '#b0b0d0', shape: 'swimlane' },
      { id: 'object', label: 'Object', icon: '▭', color: '#7c6ef7', shape: 'object' },
      { id: 'send', label: 'Send', icon: '▷', color: '#5a56a8', shape: 'send' },
      { id: 'receive', label: 'Receive', icon: '◁', color: '#5a56a8', shape: 'receive' },
      { id: 'transition', label: 'Transition', icon: '→', color: '#555', shape: 'line-assoc' },
      { id: 'note-act', label: 'Note', icon: '🗒', color: '#f0e080', shape: 'note' },
    ],
  },
};

const Sidebar = ({ diagramType = 'class', onSearch }) => {
  const [query, setQuery] = useState('');

  const group = SHAPE_GROUPS[diagramType] || SHAPE_GROUPS.class;

  const filtered = query.trim()
    ? Object.values(SHAPE_GROUPS)
        .flatMap((g) => g.shapes)
        .filter((s) => s.label.toLowerCase().includes(query.toLowerCase()))
    : group.shapes;

  // ── Drag start: encode shape data into the drag event ──
  const handleDragStart = (e, shape) => {
    e.dataTransfer.setData('application/sysdraw-shape', JSON.stringify(shape));
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <aside className="sidebar">
      {/* Search */}
      <div className="sidebar-search">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9999b5" strokeWidth="2.5">
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          placeholder="Search"
          value={query}
          onChange={(e) => { setQuery(e.target.value); onSearch?.(e.target.value); }}
        />
        {query && (
          <button className="sidebar-search-clear" onClick={() => setQuery('')}>✕</button>
        )}
      </div>

      {/* Shapes grid */}
      <div className="sidebar-group-label">— {group.label}</div>

      <div className="sidebar-shapes">
        {filtered.map((shape) => (
          <div
            key={shape.id}
            className="sidebar-shape-item"
            draggable
            onDragStart={(e) => handleDragStart(e, shape)}
            title={shape.label}
          >
            <div className="sidebar-shape-icon" style={{ color: shape.color }}>
              {shape.icon}
            </div>
            <span className="sidebar-shape-label">{shape.label}</span>
          </div>
        ))}
      </div>

      {/* Bottom: shapes library link */}
      <div className="sidebar-footer">
        <button className="sidebar-shapes-btn">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Shapes…
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
