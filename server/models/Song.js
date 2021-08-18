const { Schema, model } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

const performanceSchema = new Schema({
  // set custom id to avoid confusion with parent Song _id
  performanceId: {
    type: Schema.Types.ObjectId,
    default: () => new Schema.Types.ObjectId()
  },
  url: {
    type: String,
    required: true,
    trim: true
  },
  averageRating: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    get: createdAtVal => dateFormat(createdAtVal)
  }
},
{
  toJSON: {
    getters: true
  }
});

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
  performance: performanceSchema
});

const Song = model('Song', songSchema);

module.exports = Song;
