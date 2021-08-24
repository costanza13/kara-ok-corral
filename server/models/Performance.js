const { Schema, model } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

const reactionSchema = new Schema({
  username: {
    type: String,
    required: true,
    trim: true
  },
  reactionBody: {
    type: String,
    required: true
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

const performanceSchema = new Schema({
  username: {
    type: String,
    required: true,
    trim: true
  },
  url: {
    type: String,
    required: true,
    trim: true
  },
  visibility: {
    type: String,
    enum: ['private', 'public', 'friends'],
    default: 'private'
  },
  reactions: [reactionSchema],
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

performanceSchema.virtual('reactionCount').get(function () {
  return this.reactions.length;
});

const Performance = model('Performance', performanceSchema);

module.exports = Performance;
