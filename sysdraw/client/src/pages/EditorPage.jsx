/**
 * SysDraw - Editor Page
 * Main application workspace: Navbar + Sidebar + Canvas + RightPanel
 * Handles project state, save/load, and diagram type switching
 */
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import RightPanel from '../components/layout/RightPanel';
import DiagramCanvas from '../components/canvas/DiagramCanvas';
import CreateProjectModal from '../components/modals/CreateProjectModal';
import DiagramTypeModal from '../components/modals/DiagramTypeModal';
import { projectAPI, diagramAPI } from '../services/api';
import './EditorPage.css';

const EditorPage = () => {
  const navigate = useNavigate();
  const { user, currentProject, currentPage, openProject } = useApp();
  const canvasRef = useRef(null);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDiagramTypeModal, setShowDiagramTypeModal] = useState(false);
  const [projects, setProjects] = useState([]);
  const [diagramType, setDiagramType] = useState('class');
  const [saveStatus, setSaveStatus] = useState('saved'); // 'saved' | 'saving' | 'unsaved'

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  // Load user projects
  useEffect(() => {
    if (!user) return;
    projectAPI.list()
      .then(({ data }) => {
        setProjects(data);
        // Auto-open first project if exists and none selected
        if (!currentProject && data.length > 0) {
          openProject(data[0]);
          setDiagramType(data[0].diagramType || 'class');
        }
      })
      .catch(console.error);
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync diagram type when project changes
  useEffect(() => {
    if (currentProject) setDiagramType(currentProject.diagramType || 'class');
  }, [currentProject]);

  // ── Save diagram to backend ──────────────────────────────────────────────────
  const handleSave = useCallback(async (newName) => {
    if (!currentProject || !currentPage) return;
    setSaveStatus('saving');
    try {
      const elements = canvasRef.current?.getElements() || [];
      await diagramAPI.save(currentProject.id, currentPage.id, elements);
      if (newName && newName !== currentProject.name) {
        await projectAPI.update(currentProject.id, { name: newName });
      }
      setSaveStatus('saved');
    } catch (err) {
      console.error('Save failed', err);
      setSaveStatus('unsaved');
    }
  }, [currentProject, currentPage]);

  // Auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (currentProject && saveStatus !== 'saving') handleSave();
    }, 30000);
    return () => clearInterval(interval);
  }, [currentProject, handleSave, saveStatus]);

  // ── Project created → open in editor ────────────────────────────────────────
  const handleProjectCreated = (project) => {
    setProjects((prev) => [...prev, project]);
    openProject(project);
    setDiagramType(project.diagramType || 'class');
    setShowDiagramTypeModal(false);
  };

  // ── Diagram type selected from modal ────────────────────────────────────────
  const handleTypeSelected = (type) => {
    setDiagramType(type);
    setShowDiagramTypeModal(false);
    setShowCreateModal(true);
  };

  return (
    <div className="editor-root">
      {/* ── Top Navbar ── */}
      <Navbar
        onSave={handleSave}
        canUndo={canvasRef.current?.canUndo?.() ?? false}
        canRedo={canvasRef.current?.canRedo?.() ?? false}
        onUndo={() => canvasRef.current?.undo()}
        onRedo={() => canvasRef.current?.redo()}
        currentElements={canvasRef.current?.getElements?.() || []}
      />

      {/* ── Save status strip ── */}
      {saveStatus === 'saving' && (
        <div className="editor-save-status saving">Saving…</div>
      )}

      {/* ── Main layout ── */}
      <div className="editor-body">
        {/* Left sidebar: shapes palette */}
        <Sidebar diagramType={diagramType} />

        {/* Center: canvas */}
        <DiagramCanvas
          ref={canvasRef}
          diagramType={diagramType}
          onElementsChange={() => setSaveStatus('unsaved')}
        />

        {/* Right: pages + icons */}
        <RightPanel
          onPageChange={(page) => {
            // Load diagram for selected page
            if (currentProject) {
              diagramAPI.load(currentProject.id, page.id)
                .then(({ data }) => {
                  canvasRef.current?.loadElements(data.elements || []);
                })
                .catch(console.error);
            }
          }}
        />
      </div>

      {/* ── Floating action button: new project ── */}
      {!currentProject && (
        <div className="editor-welcome">
          <div className="editor-welcome-card">
            <h2>Welcome to SysDraw</h2>
            <p>Create your first diagram project to get started.</p>
            <button
              className="editor-new-btn"
              onClick={() => setShowDiagramTypeModal(true)}
            >
              + New Project
            </button>
          </div>
        </div>
      )}

      {/* ── New project FAB (when project exists) ── */}
      {currentProject && (
        <button
          className="editor-fab"
          title="New project"
          onClick={() => setShowDiagramTypeModal(true)}
        >
          +
        </button>
      )}

      {/* ── Project list drawer (left edge) ── */}
      <div className="editor-project-bar">
        {projects.map((p) => (
          <button
            key={p.id}
            className={`editor-project-pill ${currentProject?.id === p.id ? 'active' : ''}`}
            onClick={() => {
              openProject(p);
              setDiagramType(p.diagramType || 'class');
            }}
            title={p.name}
          >
            {p.name[0].toUpperCase()}
          </button>
        ))}
        <button
          className="editor-project-pill editor-project-pill--add"
          title="New project"
          onClick={() => setShowDiagramTypeModal(true)}
        >
          +
        </button>
      </div>

      {/* ── Modals ── */}
      {showDiagramTypeModal && (
        <DiagramTypeModal
          onSelect={handleTypeSelected}
          onBack={() => setShowDiagramTypeModal(false)}
        />
      )}

      {showCreateModal && (
        <CreateProjectModal
          onClose={() => setShowCreateModal(false)}
          onCreated={handleProjectCreated}
        />
      )}
    </div>
  );
};

export default EditorPage;
