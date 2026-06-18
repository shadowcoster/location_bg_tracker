const express = require('express');
const Location = require('../models/Location');

const router = express.Router();

function validateLocation(body) {
  const errors = [];
  const latitude = body.latitude;
  const longitude = body.longitude;
  const timestamp = new Date(body.timestamp);

  if (typeof body.userId !== 'string' || body.userId.trim() === '') {
    errors.push('userId is required');
  }
  if (
    typeof latitude !== 'number' ||
    !Number.isFinite(latitude) ||
    latitude < -90 ||
    latitude > 90
  ) {
    errors.push('latitude must be between -90 and 90');
  }
  if (
    typeof longitude !== 'number' ||
    !Number.isFinite(longitude) ||
    longitude < -180 ||
    longitude > 180
  ) {
    errors.push('longitude must be between -180 and 180');
  }
  if (!['gps', 'joystick'].includes(body.source)) {
    errors.push('source must be gps or joystick');
  }
  if (
    typeof body.timestamp !== 'string' ||
    !body.timestamp ||
    Number.isNaN(timestamp.getTime())
  ) {
    errors.push('timestamp must be a valid ISO date');
  }
  if (
    body.accuracy !== undefined &&
    (typeof body.accuracy !== 'number' ||
      !Number.isFinite(body.accuracy) ||
      body.accuracy < 0)
  ) {
    errors.push('accuracy must be a non-negative number');
  }
  if (
    body.speed !== undefined &&
    (typeof body.speed !== 'number' || !Number.isFinite(body.speed))
  ) {
    errors.push('speed must be a number');
  }

  return errors;
}

// TODO: Add the application's authentication middleware before these handlers.
router.post('/', async (req, res, next) => {
  try {
    const errors = validateLocation(req.body);
    if (errors.length > 0) {
      return res.status(400).json({message: 'Invalid location', errors});
    }

    if (
      req.body.source === 'joystick' &&
      process.env.NODE_ENV === 'production' &&
      process.env.ENABLE_MOCK_LOCATION !== 'true'
    ) {
      return res
        .status(403)
        .json({message: 'Mock locations are disabled in production'});
    }

    const location = await Location.create({
      userId: req.body.userId.trim(),
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      accuracy: req.body.accuracy,
      speed: req.body.speed,
      source: req.body.source,
      timestamp: new Date(req.body.timestamp),
    });

    return res.status(201).json(location);
  } catch (error) {
    return next(error);
  }
});

router.get('/latest/:userId', async (req, res, next) => {
  try {
    const location = await Location.findOne({userId: req.params.userId})
      .sort({timestamp: -1})
      .lean();

    if (!location) {
      return res.status(404).json({message: 'No location found'});
    }

    return res.json(location);
  } catch (error) {
    return next(error);
  }
});

router.get('/history/:userId', async (req, res, next) => {
  try {
    const locations = await Location.find({userId: req.params.userId})
      .sort({timestamp: 1})
      .lean();
    return res.json(locations);
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
