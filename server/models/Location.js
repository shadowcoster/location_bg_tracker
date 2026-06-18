const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    latitude: {
      type: Number,
      required: true,
      min: -90,
      max: 90,
    },
    longitude: {
      type: Number,
      required: true,
      min: -180,
      max: 180,
    },
    accuracy: Number,
    speed: Number,
    source: {
      type: String,
      required: true,
      enum: ['gps', 'joystick'],
    },
    timestamp: {
      type: Date,
      required: true,
      index: true,
    },
  },
  {
    timestamps: {createdAt: true, updatedAt: false},
    versionKey: false,
  },
);

locationSchema.index({userId: 1, timestamp: -1});

module.exports = mongoose.model('Location', locationSchema);
