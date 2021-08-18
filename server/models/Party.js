const { Schema, model } = require('mongoose');

const partySchema = new Schema({
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
  members: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  playist: {
    type: Schema.Types.ObjectId,
    ref: 'Playlist'
  },
});

const Party = model('Party', partySchema);

module.exports = Party;
