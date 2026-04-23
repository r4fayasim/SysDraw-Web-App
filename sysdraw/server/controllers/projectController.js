/**
 * SysDraw - Project Controller (MVC: Controller Layer)
 * Handles CRUD operations for projects
 */
const ProjectModel = require('../models/Project');

const ProjectController = {
  /** GET /api/projects - List all projects for the logged-in user */
  list: (req, res) => {
    const projects = ProjectModel.findByUserId(req.user.id);
    res.json(projects);
  },

  /** GET /api/projects/:id - Get a single project by ID */
  get: (req, res) => {
    const project = ProjectModel.findById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found.' });
    res.json(project);
  },

  /** POST /api/projects - Create a new project */
  create: (req, res) => {
    const { name, description, diagramType, dueDate, assignedTo } = req.body;

    if (!name) return res.status(400).json({ error: 'Project name is required.' });

    const project = ProjectModel.create({
      name,
      description: description || '',
      diagramType: diagramType || 'class',
      dueDate: dueDate || null,
      assignedTo: assignedTo || [],
      ownerId: req.user.id,
      comments: [],
      attachments: [],
    });

    res.status(201).json(project);
  },

  /** PUT /api/projects/:id - Update project metadata */
  update: (req, res) => {
    const project = ProjectModel.findById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found.' });

    const updated = ProjectModel.update(req.params.id, req.body);
    res.json(updated);
  },

  /** DELETE /api/projects/:id - Delete a project */
  delete: (req, res) => {
    const project = ProjectModel.findById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found.' });

    ProjectModel.delete(req.params.id);
    res.json({ message: 'Project deleted successfully.' });
  },

  /** POST /api/projects/:id/comments - Add a comment to a project */
  addComment: (req, res) => {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'Comment text is required.' });

    const project = ProjectModel.findById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found.' });

    const comment = {
      id: Date.now().toString(),
      text,
      author: req.user.username,
      createdAt: new Date().toISOString(),
    };

    const comments = [...(project.comments || []), comment];
    const updated = ProjectModel.update(req.params.id, { comments });
    res.status(201).json(updated);
  },
};

module.exports = ProjectController;
