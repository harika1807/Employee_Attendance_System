require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Attendance = require('../models/Attendance');

const seed = async () => {
  try {
    await connectDB(process.env.MONGO_URI || 'mongodb://localhost:27017/attendance_db');
    await User.deleteMany({});
    await Attendance.deleteMany({});

    const manager = await User.create({
      name: 'Manager One',
      email: 'manager@company.com',
      password: 'password123',
      role: 'manager',
      employeeId: 'MGR001',
      department: 'Management'
    });

    const emp1 = await User.create({
      name: 'Alice Employee',
      email: 'alice@company.com',
      password: 'password123',
      role: 'employee',
      employeeId: 'EMP001',
      department: 'Engineering'
    });

    const emp2 = await User.create({
      name: 'Bob Employee',
      email: 'bob@company.com',
      password: 'password123',
      role: 'employee',
      employeeId: 'EMP002',
      department: 'Design'
    });

    // create some attendance for last 10 days
    const days = 10;
    for (let i=0;i<days;i++){
      const d = new Date();
      d.setDate(d.getDate() - i);
      const date = d.toISOString().split('T')[0];
      await Attendance.create({
        userId: emp1._id,
        date,
        checkInTime: new Date(d.setHours(9,0,0)),
        checkOutTime: new Date(d.setHours(18,0,0)),
        status: 'present',
        totalHours: 9
      });
      await Attendance.create({
        userId: emp2._id,
        date,
        checkInTime: new Date(d.setHours(10,0,0)),
        checkOutTime: new Date(d.setHours(17,0,0)),
        status: 'late',
        totalHours: 7
      });
    }

    console.log('Seed done');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();
