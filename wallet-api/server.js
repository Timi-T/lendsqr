/* eslint no-console: "off" */

// Main server for application

const express = require('express');
const cors = require('cors');
const router = require('./routes/index');

const app = express();

app.use(cors({
  origin: '*',
  credentials: true,
}));

// app.set('trust proxy', 1);
app.use(express.json());
app.use(router);
app.listen(5000, () => console.log('App listening on port 5000'));
