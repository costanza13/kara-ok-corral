const { Schema, model } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

const songSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    get: createdAtVal => dateFormat(createdAtVal)
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  artist: {
    type: String,
    required: true,
    trim: true
  },
  lyricsUrl: {
    type: String
  },
  videoUrl: {
    type: String
  },
  performance: {
    type: Schema.Types.ObjectId,
    ref: 'Performance'
  }
});

const Song = model('Song', songSchema);

module.exports = Song;
