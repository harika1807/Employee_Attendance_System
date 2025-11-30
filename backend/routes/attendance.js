const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const { protect, managerOnly } = require('../middleware/auth');

router.post('/checkin', protect, attendanceController.checkIn);
router.post('/checkout', protect, attendanceController.checkOut);
router.get('/my-history', protect, attendanceController.myHistory);
router.get('/my-summary', protect, attendanceController.mySummary);
router.get('/today', protect, attendanceController.todayStatus);

// manager routes
router.get('/all', protect, managerOnly, attendanceController.getAll);
router.get('/employee/:id', protect, managerOnly, attendanceController.getEmployee);
router.get('/summary', protect, managerOnly, attendanceController.summary);
router.get('/export', protect, managerOnly, attendanceController.exportCSV);
router.get('/today-status', protect, managerOnly, attendanceController.todayStatusAll);

module.exports = router;
