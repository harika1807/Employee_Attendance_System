const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['employee','manager'], default: 'employee' },
  employeeId: { type: String, unique: true, sparse: true },
  department: { type: String },
  createdAt: { type: Date, default: Date.now }
});

// hash before save
userSchema.pre('save', async function(next){
  if(!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function(entered){
  const bcrypt = require('bcryptjs');
  return await bcrypt.compare(entered, this.password);
};

module.exports = mongoose.model('User', userSchema);
