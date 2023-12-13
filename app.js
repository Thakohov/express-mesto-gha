const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');
const handleError = require('./middlewares/HandleError');
const router = require('./routes');
const { PORT, DB_URL } = require('./config');

const app = express();

mongoose.connect(DB_URL).then(() => console.log('Mongoose connected'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

app.use(router);

app.use(errors());
app.use(handleError);

app.listen(PORT);
