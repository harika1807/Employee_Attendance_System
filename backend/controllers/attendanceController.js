const asyncHandler = require('express-async-handler');
const Attendance = require('../models/Attendance');
const User = require('../models/User');
const { createObjectCsvStringifier } = require('csv-writer');

const formatDate = (d) => {
  const dt = new Date(d);
  return dt.toISOString().split('T')[0]; // YYYY-MM-DD
};

// Employee: checkin
exports.checkIn = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const today = formatDate(new Date());
  let record = await Attendance.findOne({ userId, date: today });
  const now = new Date();

  if(record) {
    if(record.checkInTime) return res.status(400).json({ message: 'Already checked in' });
    record.checkInTime = now;
    // determine late: assume 09:30 threshold
    const threshold = new Date();
    threshold.setHours(9,30,0,0);
    record.status = now > threshold ? 'late' : 'present';
    await record.save();
    return res.json(record);
  } else {
    const threshold = new Date();
    threshold.setHours(9,30,0,0);
    const status = now > threshold ? 'late' : 'present';
    record = await Attendance.create({ userId, date: today, checkInTime: now, status });
    return res.status(201).json(record);
  }
});

// Employee: checkout
exports.checkOut = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const today = formatDate(new Date());
  const record = await Attendance.findOne({ userId, date: today });
  if(!record || !record.checkInTime) return res.status(400).json({ message: 'Check-in missing' });
  if(record.checkOutTime) return res.status(400).json({ message: 'Already checked out' });

  const now = new Date();
  record.checkOutTime = now;
  record.totalHours = (new Date(record.checkOutTime) - new Date(record.checkInTime)) / (1000 * 60 * 60);
  await record.save();
  res.json(record);
});

// My history
exports.myHistory = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const records = await Attendance.find({ userId }).sort({ date: -1 }).limit(500);
  res.json(records);
});

// My summary (monthly)
exports.mySummary = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { month, year } = req.query; // month: 1-12
  const m = month || (new Date()).getMonth() + 1;
  const y = year || (new Date()).getFullYear();
  const start = new Date(y, m-1, 1);
  const end = new Date(y, m, 1);
  const records = await Attendance.find({
    userId,
    createdAt: { $gte: start, $lt: end }
  });

  const summary = { present: 0, absent: 0, late: 0, halfDay: 0, totalHours: 0 };
  records.forEach(r => {
    if(r.status === 'present') summary.present++;
    if(r.status === 'absent') summary.absent++;
    if(r.status === 'late') summary.late++;
    if(r.status === 'half-day') summary.halfDay++;
    summary.totalHours += r.totalHours || 0;
  });
  res.json(summary);
});

// Today's status
exports.todayStatus = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const today = formatDate(new Date());
  const record = await Attendance.findOne({ userId, date: today });
  res.json(record || { message: 'No record' });
});

// Manager: all
exports.getAll = asyncHandler(async (req, res) => {
  const { page = 1, limit = 50, employeeId, date, status } = req.query;
  const query = {};
  if(employeeId){
    const u = await User.findOne({ employeeId });
    if(u) query.userId = u._id;
    else return res.json([]);
  }
  if(date) query.date = date;
  if(status) query.status = status;
  const records = await Attendance.find(query).populate('userId','name email employeeId department').sort({ date: -1 })
    .skip((page-1)*limit).limit(Number(limit));
  res.json(records);
});

exports.getEmployee = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const records = await Attendance.find({ userId: id }).sort({ date: -1 });
  res.json(records);
});

exports.summary = asyncHandler(async (req, res) => {
  // team summary (counts, late etc.)
  const { start, end } = req.query;
  const q = {};
  if(start && end) q.date = { $gte: start, $lte: end };
  const agg = await Attendance.aggregate([
    { $match: q },
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ]);
  res.json(agg);
});

exports.todayStatusAll = asyncHandler(async (req, res) => {
  const today = formatDate(new Date());
  const present = await Attendance.find({ date: today }).populate('userId','name email employeeId department');
  res.json(present);
});

exports.exportCSV = asyncHandler(async (req, res) => {
  const { start, end } = req.query;
  const q = {};
  if(start && end) q.date = { $gte: start, $lte: end };
  const records = await Attendance.find(q).populate('userId','name email employeeId department');

  const csvStringifier = createObjectCsvStringifier({
    header: [
      {id: 'employeeId', title: 'EmployeeId'},
      {id: 'name', title: 'Name'},
      {id: 'date', title: 'Date'},
      {id: 'checkIn', title: 'CheckIn'},
      {id: 'checkOut', title: 'CheckOut'},
      {id: 'status', title: 'Status'},
      {id: 'totalHours', title: 'TotalHours'}
    ]
  });

  const recordsForCsv = records.map(r => ({
    employeeId: r.userId.employeeId,
    name: r.userId.name,
    date: r.date,
    checkIn: r.checkInTime ? new Date(r.checkInTime).toISOString() : '',
    checkOut: r.checkOutTime ? new Date(r.checkOutTime).toISOString() : '',
    status: r.status,
    totalHours: r.totalHours || 0
  }));

  const header = csvStringifier.getHeaderString();
  const csv = header + csvStringifier.stringifyRecords(recordsForCsv);
  res.setHeader('Content-disposition', `attachment; filename=attendance_${Date.now()}.csv`);
  res.set('Content-Type', 'text/csv');
  res.status(200).send(csv);
});
