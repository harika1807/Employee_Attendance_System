const asyncHandler = require('express-async-handler');
const Attendance = require('../models/Attendance');
const User = require('../models/User');

exports.employeeStats = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const today = new Date().toISOString().split('T')[0];
  const todayRec = await Attendance.findOne({ userId, date: today });
  // month counts
  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const monthEnd = new Date(new Date().getFullYear(), new Date().getMonth()+1, 1);
  const records = await Attendance.find({ userId, createdAt: { $gte: monthStart, $lt: monthEnd }});
  const summary = { present: 0, absent: 0, late: 0, totalHours: 0, recent: [] };
  records.forEach(r => {
    if(r.status === 'present') summary.present++;
    if(r.status === 'absent') summary.absent++;
    if(r.status === 'late') summary.late++;
    summary.totalHours += r.totalHours || 0;
  });
  const recent = await Attendance.find({ userId }).sort({ date: -1 }).limit(7);
  res.json({ today: todayRec, month: summary, recent });
});

exports.managerStats = asyncHandler(async (req, res) => {
  const totalEmployees = await User.countDocuments({ role: 'employee' });
  const today = new Date().toISOString().split('T')[0];
  const presentToday = await Attendance.find({ date: today }).count();
  const lateToday = await Attendance.find({ date: today, status: 'late' }).count();

  // weekly trend (last 7 days)
  const days = [];
  for(let i=6;i>=0;i--){
    const d = new Date();
    d.setDate(d.getDate() - i);
    const ds = d.toISOString().split('T')[0];
    const count = await Attendance.find({ date: ds }).count();
    days.push({ date: ds, count });
  }

  // department-wise counts (simple aggregation)
  const depAgg = await Attendance.aggregate([
    { $lookup: { from: 'users', localField: 'userId', foreignField: '_id', as: 'u' } },
    { $unwind: '$u' },
    { $group: { _id: '$u.department', count: { $sum: 1 } } }
  ]);

  const absentList = await Attendance.aggregate([
    { $match: { date: today, status: 'absent' } },
    { $lookup: { from: 'users', localField: 'userId', foreignField: '_id', as: 'u' } },
    { $unwind: '$u' },
    { $project: { 'u.name':1, 'u.employeeId':1, date:1 } }
  ]);

  res.json({
    totalEmployees,
    presentToday,
    lateToday,
    weeklyTrend: days,
    deptStats: depAgg,
    absentToday: absentList
  });
});
