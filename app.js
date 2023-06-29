/* eslint-disable no-useless-escape */
/* eslint-disable import/newline-after-import */
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;
const app = express();
mongoose.connect('mongodb://127.0.0.1:27017/mestodb');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// eslint-disable-next-line import/newline-after-import

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().min(8).required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/),
    email: Joi.string().required(),
    password: Joi.string().min(8).required(),
  }),
}), createUser);

const userRouters = require('./routes/users');
app.use(userRouters);
const cardRouters = require('./routes/cards');
app.use(cardRouters);
app.use(errors());
app.use((err, res) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'Неизвестная ошибка'
        : message,
    });
});
app.use(auth);
app.use(errors());
app.listen(PORT, () => {
  console.log(`Server ok ${PORT}`);
});

/* /^(https?:\/\/)?[-\w.]+@([A-z0-9][-A-z0-9]+\.)+[A-z]{2,4}$/ */
