const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/dashboardController');
const { verifyToken, requireRole } = require('../middleware/authHandler');

router.use(verifyToken);
router.use(requireRole('admin'));

router.get('/stats', getDashboardStats);

module.exports = router;
