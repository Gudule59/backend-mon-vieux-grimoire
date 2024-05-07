const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  grade: { type: Number, required: true, min: 1, max: 5 }
});

module.exports = mongoose.model('Rating', ratingSchema);