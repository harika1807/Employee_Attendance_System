const express = require('express');
const router = express.Router();
const { employeeStats, managerStats } = require('../controllers/dashboardController');
const { protect, managerOnly } = require('../middleware/auth');

router.get('/employee', protect, employeeStats);
router.get('/manager', protect, managerOnly, managerStats);

module.exports = router;
