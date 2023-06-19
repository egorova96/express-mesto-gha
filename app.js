const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

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

app.use(express.json());
app.use((req, res, next) => {
  req.user = {
    _id: '648eca0264b49a1ae943fe2f',
  };
  next();
});

/* app.get('/', (req, res) => {
  res.send('hello world');
});
app.listen(3002, () => {
  console.log('server is running on port 3002');
  console.log(process.env);
}); */
