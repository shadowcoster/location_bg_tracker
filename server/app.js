const cors = require('cors');
const express = require('express');
const locationRoutes = require('./routes/locationRoutes');

const app = express();

app.disable('x-powered-by');
app.use(cors());
app.use(express.json({limit: '32kb'}));

app.get('/health', (_req, res) => {
  res.json({status: 'ok'});
});

app.use('/api/v1/location', locationRoutes);

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({message: 'Internal server error'});
});

module.exports = app;
