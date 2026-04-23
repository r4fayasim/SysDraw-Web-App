/**
 * SysDraw - Diagram Controller (MVC: Controller Layer)
 * Handles diagram save/load, undo/redo history, and code export
 */
const ProjectModel = require('../models/Project');

const DiagramController = {
  /**
   * POST /api/diagrams/:projectId/pages/:pageId/save
   * Saves diagram elements for a page (also pushes to history for undo/redo)
   */
  save: (req, res) => {
    const { projectId, pageId } = req.params;
    const { elements } = req.body;

    if (!elements) return res.status(400).json({ error: 'Elements data required.' });

    const result = ProjectModel.saveDiagram(projectId, pageId, elements);
    if (!result) return res.status(404).json({ error: 'Project or page not found.' });

    res.json({ message: 'Diagram saved.', project: result });
  },

  /**
   * GET /api/diagrams/:projectId/pages/:pageId
   * Loads diagram elements for a page
   */
  load: (req, res) => {
    const { projectId, pageId } = req.params;
    const project = ProjectModel.findById(projectId);
    if (!project) return res.status(404).json({ error: 'Project not found.' });

    const page = project.pages.find((p) => p.id === pageId);
    if (!page) return res.status(404).json({ error: 'Page not found.' });

    res.json({ elements: page.elements, history: page.history });
  },

  /**
   * POST /api/diagrams/:projectId/pages
   * Adds a new page to a project
   */
  addPage: (req, res) => {
    const { projectId } = req.params;
    const { name } = req.body;

    const project = ProjectModel.findById(projectId);
    if (!project) return res.status(404).json({ error: 'Project not found.' });

    const { v4: uuidv4 } = require('uuid');
    const newPage = {
      id: uuidv4(),
      name: name || `Page-${project.pages.length + 1}`,
      elements: [],
      history: [],
    };

    const pages = [...project.pages, newPage];
    const updated = ProjectModel.update(projectId, { pages });
    res.status(201).json(updated);
  },

  /**
   * POST /api/diagrams/:projectId/export
   * Generates SQL schema, Java code, or Python code from class diagram elements
   */
  export: (req, res) => {
    const { projectId } = req.params;
    const { format, elements } = req.body; // format: 'sql' | 'java' | 'python'

    if (!format || !elements) {
      return res.status(400).json({ error: 'format and elements are required.' });
    }

    let output = '';

    try {
      // Extract class entities from elements
      const classes = elements.filter((el) => el.type === 'class' || el.type === 'entity');

      if (format === 'sql') {
        output = generateSQL(classes);
      } else if (format === 'java') {
        output = generateJava(classes);
      } else if (format === 'python') {
        output = generatePython(classes);
      } else {
        return res.status(400).json({ error: 'Unsupported format. Use sql, java, or python.' });
      }

      res.json({ format, code: output });
    } catch (err) {
      res.status(500).json({ error: 'Export failed: ' + err.message });
    }
  },
};

// ─── Code Generator Utilities ──────────────────────────────────────────────────

function generateSQL(classes) {
  if (!classes.length) return '-- No class/entity elements found on canvas';

  return classes
    .map((cls) => {
      const name = (cls.name || cls.label || 'UnnamedTable').replace(/\s/g, '_');
      const attrs = cls.attributes || [];
      const cols = attrs.length
        ? attrs.map((a) => `  ${a.name || 'col'} ${a.type || 'VARCHAR(255)'}`).join(',\n')
        : '  id INT PRIMARY KEY AUTO_INCREMENT,\n  created_at DATETIME DEFAULT NOW()';

      return `CREATE TABLE ${name} (\n${cols}\n);`;
    })
    .join('\n\n');
}

function generateJava(classes) {
  if (!classes.length) return '// No class elements found on canvas';

  return classes
    .map((cls) => {
      const name = cls.name || cls.label || 'UnnamedClass';
      const attrs = cls.attributes || [];
      const fields = attrs.map((a) => `    private ${a.type || 'String'} ${a.name || 'field'};`).join('\n');
      const getters = attrs
        .map(
          (a) =>
            `    public ${a.type || 'String'} get${capitalize(a.name || 'field')}() { return this.${a.name || 'field'}; }`
        )
        .join('\n');

      return `public class ${name} {\n${fields}\n\n${getters}\n}`;
    })
    .join('\n\n');
}

function generatePython(classes) {
  if (!classes.length) return '# No class elements found on canvas';

  return classes
    .map((cls) => {
      const name = cls.name || cls.label || 'UnnamedClass';
      const attrs = cls.attributes || [];
      const initBody = attrs.length
        ? attrs.map((a) => `        self.${a.name || 'attr'} = ${a.name || 'attr'}`).join('\n')
        : '        pass';
      const initParams = attrs.length ? ', ' + attrs.map((a) => a.name || 'attr').join(', ') : '';

      return `class ${name}:\n    def __init__(self${initParams}):\n${initBody}`;
    })
    .join('\n\n');
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

module.exports = DiagramController;
