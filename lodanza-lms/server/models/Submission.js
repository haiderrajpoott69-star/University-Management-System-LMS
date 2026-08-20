const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  assignment: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment', required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  fileUrl: { type: String, default: '' },
  text: { type: String, default: '' },
  marks: { type: Number, default: null },
  feedback: { type: String, default: '' },
  status: { type: String, enum: ['submitted', 'graded', 'late'], default: 'submitted' },
  submittedAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Submission', submissionSchema);
