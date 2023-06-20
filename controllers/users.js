/* eslint-disable consistent-return */
/* eslint-disable camelcase */
// eslint-disable-next-line import/newline-after-import
const user = require('../models/user');
const ERROR_iNCORRECT_DATA = 400;
const ERROR_NOT_FOUND = 404;
const ERROR_CODE = 500;

/* const getAnswer = (res, data) => res.status(200).send(data); */

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  user.create({ name, about, avatar }).then((userData) => {
    res.send({ data: userData });
  }).catch((err) => {
    if (err.name === 'ValidationError') {
      res.status(ERROR_iNCORRECT_DATA).send({ message: 'Введены некорректные данные' });
    } else {
      res.status(ERROR_CODE).send({ message: 'Неизвестная ошибка' });
    }
  });
};

module.exports.getUserById = (req, res) => {
  user.findUserById(req.params._id).then((userData) => {
    if (!userData) {
      res.status(ERROR_NOT_FOUND).send({ message: 'Данного пользователя не существует' });
    }
    res.send({ data: userData });
  }).catch((err) => {
    if (err.name === 'UserError') {
      res.status(ERROR_iNCORRECT_DATA).send({ message: 'ID пользователя не найден' });
    } else {
      res.status(ERROR_CODE).send({ message: 'Неизвестная ошибка' });
    }
  });
};

module.exports.getUsers = (req, res) => {
  user.find({}).then((usersData) => res.send({ data: usersData }))
    .catch(() => res.status(ERROR_CODE).send({ message: 'Неизвестная ошибка' }));
};

module.exports.updateUserData = (req, res) => {
  const { name, about } = req.body;
  user
    .findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((userData) => {
      if (!userData) {
        return res.status(ERROR_NOT_FOUND).send({ message: 'Данного пользователя не существует' });
      }
      res.send({ data: userData });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_iNCORRECT_DATA).send({ message: 'Введены некорректные данные' });
      }
      res.status(ERROR_CODE).send({ message: 'Неизвестная ошибка' });
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  user
    .findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .then((userData) => {
      if (!userData) {
        return res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь не найден' });
      }
      res.send({ data: userData });
    })
    .catch(() => res.status(ERROR_CODE).send({ message: 'Неизвестная ошибка' }));
};
