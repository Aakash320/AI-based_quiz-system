const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    subject: {
      type: String,
      required: true,
      enum: ['DSA', 'DBMS', 'OS', 'CN', 'OOPS'],
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 50,
    },
    total: {
      type: Number,
      default: 50,
    },
    percentage: {
      type: Number,
      required: true,
    },
    answers: [
      {
        questionId: Number,
        selected: Number,
        correct: Number,
        isCorrect: Boolean,
      },
    ],
    timeSpent: { type: Number, default: 0 },
  },
  { timestamps: true }
);

resultSchema.index({ userId: 1, createdAt: -1 });
resultSchema.index({ userId: 1, subject: 1 });

module.exports = mongoose.model('Result', resultSchema);
