require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');

const port = Number(process.env.PORT ?? 3000);
const mongoUri =
  process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/location_tracker';

async function startServer() {
  await mongoose.connect(mongoUri);
  app.listen(port, () => {
    console.log(`Location API listening on port ${port}`);
  });
}

startServer().catch(error => {
  console.error('Could not start location API', error);
  process.exit(1);
});
