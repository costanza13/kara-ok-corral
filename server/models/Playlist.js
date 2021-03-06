const { Schema, model } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

const playlistSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    get: timestamp => dateFormat(timestamp)
  },
  username: {
    type: String,
    required: true
  },
  members: [String],
  visibility: {
    type: String,
    enum: ['private', 'public', 'friends'],
    default: 'private'
  },
  songs: [{
    type: Schema.Types.ObjectId,
    ref: 'Song'
  }]
});

playlistSchema.virtual('songCount').get(function () {
  return this.songs.length;
});

const Playlist = model('Playlist', playlistSchema);

module.exports = Playlist;
