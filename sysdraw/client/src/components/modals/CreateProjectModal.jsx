/**
 * SysDraw - Create New Project Modal
 * Matches Image 3: project name, assignees, due date, description, attachments, comment
 */
import React, { useState } from 'react';
import { projectAPI } from '../../services/api';
import { useApp } from '../../context/AppContext';
import './Modal.css';

const DIAGRAM_TYPES = [
  { value: 'class', label: 'Class Diagram' },
  { value: 'usecase', label: 'Use Case Diagram' },
  { value: 'sequence', label: 'Sequence Diagram' },
  { value: 'activity', label: 'Activity Diagram' },
];

const CreateProjectModal = ({ onClose, onCreated }) => {
  const { user } = useApp();
  const [form, setForm] = useState({
    name: '',
    description: '',
    diagramType: 'class',
    dueDate: '',
  });
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return setError('Project name is required.');
    setLoading(true);
    setError('');
    try {
      const payload = {
        ...form,
        assignedTo: [user?.id].filter(Boolean),
        comments: comment.trim() ? [{ text: comment, author: user?.username }] : [],
      };
      const { data } = await projectAPI.create(payload);
      onCreated(data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create project.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal modal--project fade-in">
        {/* Header */}
        <div className="modal-header">
          <span className="modal-title-label">Create New Project</span>
          <button className="modal-close" onClick={onClose}>···</button>
        </div>

        <div className="modal-body">
          {/* Project name */}
          <div className="project-name-row">
            <div className="project-name-icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </div>
            <div>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="project-name-input"
                placeholder="Type new project's name"
                required
              />
              <div className="project-created-date">
                Created on {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
              </div>
            </div>
          </div>

          {/* Assigned to + Due date row */}
          <div className="project-meta-row">
            <div className="project-meta-col">
              <div className="project-meta-label">Assigned to</div>
              <div className="project-assignees">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="project-avatar" style={{ background: ['#7c6ef7','#f0a060','#5a56a8','#9b59b6'][i] }}>
                    {['A','B','C','D'][i]}
                  </div>
                ))}
                <button className="project-avatar project-avatar--add">+</button>
              </div>
            </div>
            <div className="project-meta-col">
              <div className="project-meta-label">Due to</div>
              <div className="project-due-row">
                <input
                  type="date"
                  name="dueDate"
                  value={form.dueDate}
                  onChange={handleChange}
                  className="project-due-input"
                />
                <select name="diagramType" value={form.diagramType} onChange={handleChange} className="project-type-badge">
                  {DIAGRAM_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <hr className="modal-divider" />

          {/* Description */}
          <div className="project-section">
            <div className="project-section-label">Description</div>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Write a short description about this project…"
              className="project-description"
              rows={3}
            />
          </div>

          <hr className="modal-divider" />

          {/* Attachments */}
          <div className="project-section">
            <div className="project-section-label">Attachments</div>
            <button className="project-upload-btn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="16 16 12 12 8 16" />
                <line x1="12" y1="12" x2="12" y2="21" />
                <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
              </svg>
              Upload your attachment
            </button>
          </div>
        </div>

        {/* Comment footer */}
        <div className="modal-footer">
          {error && <div className="modal-error">{error}</div>}
          <div className="project-comment-row">
            <input
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add your comment"
              className="project-comment-input"
            />
            <button className="modal-icon-btn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
              </svg>
            </button>
            <button className="modal-icon-btn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
            <button className="project-send-btn" onClick={handleCreate} disabled={loading}>
              {loading ? '…' : 'Create'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProjectModal;
