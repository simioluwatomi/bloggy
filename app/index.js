const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const rotatingFileStream = require('../config/logger')
require('dotenv').config();

// route declaration
const postsRouter = require('./routes/posts');
const authRouter = require('./routes/auth');

const app = express();

app.use(logger('combined', { stream: rotatingFileStream }))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(postsRouter);
app.use(authRouter);

module.exports = app;
