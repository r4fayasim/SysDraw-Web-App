const express = require('express');
const router = express.Router();
const DiagramController = require('../controllers/diagramController');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.get('/:projectId/pages/:pageId', DiagramController.load);
router.post('/:projectId/pages/:pageId/save', DiagramController.save);
router.post('/:projectId/pages', DiagramController.addPage);
router.post('/:projectId/export', DiagramController.export);

module.exports = router;
