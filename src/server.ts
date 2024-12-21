/* eslint-disable no-console */
import { Server } from 'http';
import app from './app';
import mongoose from 'mongoose';
import config from './app/config';
let server: Server;
const main = () => {
  try {
    mongoose.connect(config.database_uri as string);
    app.listen(config.port, () => {
      console.log(`Blog app running on http://localhost:${config.port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

main();

process.on('unhandledRejection', () => {
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

process.on('uncaughtException', () => {
  process.exit(1);
});
