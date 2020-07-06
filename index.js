  
'use strict';

/**
 * will start the server
 * @module index
 */


// 3rd party lib
require('dotenv').config();
const mongoose = require('mongoose');
// internal modules
const server = require('./src/server.js');

const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 3000;


server.start(PORT);


const mongooseOptions = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
};

mongoose.connect(MONGODB_URI, mongooseOptions);