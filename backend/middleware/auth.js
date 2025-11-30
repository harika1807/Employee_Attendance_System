const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

const protect = asyncHandler(async (req, res, next) => {
  let token;
  if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
    token = req.headers.authorization.split(' ')[1];
  }
  if(!token) return res.status(401).json({ message: 'Not authorized' });
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decoded.id).select('-password');
  if(!req.user) return res.status(401).json({ message: 'User not found' });
  next();
});

const managerOnly = (req, res, next) => {
  if(!req.user || req.user.role !== 'manager') {
    return res.status(403).json({ message: 'Requires manager role' });
  }
  next();
};

module.exports = { protect, managerOnly };
