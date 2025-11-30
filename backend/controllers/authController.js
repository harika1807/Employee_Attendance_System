const { validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.TOKEN_EXPIRES_IN || '7d' });
};

exports.register = asyncHandler(async (req, res) => {
  const { name, email, password, role, employeeId, department } = req.body;
  const existing = await User.findOne({ email });
  if(existing) return res.status(400).json({ message: 'Email already registered' });

  const user = await User.create({ name, email, password, role, employeeId, department });
  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    employeeId: user.employeeId,
    token: generateToken(user._id)
  });

  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({ message: errors.array().map(e=>e.msg).join(', ') });
  }
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if(user && (await user.matchPassword(password))) {
    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      employeeId: user.employeeId,
      token: generateToken(user._id)
    });
  }
  res.status(401).json({ message: 'Invalid credentials' });
});

exports.me = asyncHandler(async (req, res) => {
  const user = req.user;
  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    employeeId: user.employeeId,
    department: user.department
  });
});
