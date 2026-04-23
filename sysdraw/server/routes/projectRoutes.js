const express = require('express');
const router = express.Router();
const ProjectController = require('../controllers/projectController');
const authMiddleware = require('../middleware/auth');

// All project routes require authentication
router.use(authMiddleware);

router.get('/', ProjectController.list);
router.get('/:id', ProjectController.get);
router.post('/', ProjectController.create);
router.put('/:id', ProjectController.update);
router.delete('/:id', ProjectController.delete);
router.post('/:id/comments', ProjectController.addComment);

module.exports = router;
