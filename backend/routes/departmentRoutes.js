const express = require('express');
const router = express.Router();
const {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} = require('../controllers/departmentController');
const { verifyToken, requireRole } = require('../middleware/authHandler');

router.use(verifyToken);

router.get('/', getDepartments);
router.post('/', requireRole('admin'), createDepartment);
router.put('/:id', requireRole('admin'), updateDepartment);
router.delete('/:id', requireRole('admin'), deleteDepartment);

module.exports = router;
