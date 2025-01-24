const express = require('express');
const router = express.Router();
const { showStats } = require('../controllers/jobController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/stats', authMiddleware, showStats);

module.exports = router;
