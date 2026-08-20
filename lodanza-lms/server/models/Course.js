const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  code: { type: String, required: true, unique: true, uppercase: true },
  description: { type: String, default: '' },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  credits: { type: Number, default: 3 },
  semester: { type: String, enum: ['Fall', 'Spring', 'Summer'], default: 'Fall' },
  year: { type: Number, default: new Date().getFullYear() },
  materials: [{
    title: String,
    fileUrl: String,
    fileType: String,
    uploadedAt: { type: Date, default: Date.now }
  }],
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);
