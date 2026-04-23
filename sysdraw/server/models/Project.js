/**
 * SysDraw - Project Model (MVC: Model Layer)
 * Handles project & diagram data persistence using JSON file storage
 */
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const DATA_FILE = path.join(__dirname, '../data/projects.json');

const ensureFile = () => {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([]));
  }
};

const readProjects = () => {
  ensureFile();
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
};

const writeProjects = (projects) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(projects, null, 2));
};

const ProjectModel = {
  findAll: () => readProjects(),

  findByUserId: (userId) =>
    readProjects().filter((p) => p.ownerId === userId || (p.assignedTo || []).includes(userId)),

  findById: (id) => readProjects().find((p) => p.id === id) || null,

  create: (data) => {
    const projects = readProjects();
    const newProject = {
      id: uuidv4(),
      ...data,
      pages: [
        {
          id: uuidv4(),
          name: 'Page-1',
          elements: [],
          history: [], // undo/redo state history
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    projects.push(newProject);
    writeProjects(projects);
    return newProject;
  },

  update: (id, updates) => {
    const projects = readProjects();
    const index = projects.findIndex((p) => p.id === id);
    if (index === -1) return null;
    projects[index] = {
      ...projects[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    writeProjects(projects);
    return projects[index];
  },

  saveDiagram: (projectId, pageId, elements) => {
    const projects = readProjects();
    const project = projects.find((p) => p.id === projectId);
    if (!project) return null;

    const page = project.pages.find((pg) => pg.id === pageId);
    if (!page) return null;

    // Push to history before updating (version control)
    if (page.history.length >= 50) page.history.shift(); // max 50 states
    page.history.push({ elements: page.elements, savedAt: new Date().toISOString() });
    page.elements = elements;

    writeProjects(projects);
    return project;
  },

  delete: (id) => {
    const projects = readProjects();
    const filtered = projects.filter((p) => p.id !== id);
    writeProjects(filtered);
    return true;
  },
};

module.exports = ProjectModel;
