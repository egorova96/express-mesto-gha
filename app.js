/* eslint-disable import/newline-after-import */
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const ERROR_NOT_FOUND = 404;
const { createUser, login } = require('./controllers/users');

const app = express();
mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

const { PORT = 3000 } = process.env;
app.listen(PORT, () => {
  console.log(`Server ok ${PORT}`);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// eslint-disable-next-line import/newline-after-import
const userRouters = require('./routes/users');
app.use(userRouters);
const cardRouters = require('./routes/cards');
app.use(cardRouters);

app.post('/signin', login);
app.post('/signup', createUser);

app.use('*', (req, res) => res.status(ERROR_NOT_FOUND).send({ message: 'Не найдено' }));

/* app.get('/', (req, res) => {
  res.send('hello world');
});
app.listen(3002, () => {
  console.log('server is running on port 3002');
  console.log(process.env);
}); */
