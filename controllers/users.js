/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable indent */
/* eslint-disable no-useless-return */
/* eslint-disable consistent-return */
/* eslint-disable camelcase */
// eslint-disable-next-line import/newline-after-import
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const user = require('../models/user');
const { CREATED_SUCCESS } = require('../utils/constants');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');

// const getAnswer = (res, data) => res.status(200).send(data);

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
  .then((hash) => user.create({
 name, about, avatar, email, password: hash,
})).then((userData) => {
    res.status(CREATED_SUCCESS).send({ data: userData });
  }).catch((err) => {
    if (err.name === 'BadRequestError') {
      return next(new BadRequestError('Введены некорректные данные'));
    } if (err.code === 11000) {
      return next(new ConflictError('Указанный email уже существует'));
    }
    return next(err);
  });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  user.findUserByCredentials(email, password)
  .then((userData) => {
    const token = jwt.sign({ _id: userData._id }, 'super-strong-secret', { expiresIn: '7d' });
    res.send({ token });
  })
  .catch(next);
};

const getMyProfile = (req, res, next) => {
  user.findById(req.user._id).then((userData) => {
    if (!userData) {
      throw new NotFoundError('Запрашиваемый пользователь не найден');
    }
    res.send({ data: userData });
  })
  .catch(next);
};

module.exports.getUserId = (req, res, next) => {
  const { _id } = req.user;
  user.findById(_id).then((userData) => {
    if (!userData) {
      throw new NotFoundError('Запрашиваемый пользователь не найден');
    }
    res.send({ data: userData });
  })
  .catch((err) => {
    if (err.name === 'UserError') {
      return next(new BadRequestError('Введены некорректные данные'));
    }
    return next(err);
  });
};

module.exports.getUsers = (res, next) => {
  user.find({}).then((usersData) => res.send({ data: usersData }))
    .catch(next);
};

module.exports.updateUserData = (req, res, next) => {
  const { name, about } = req.body;
  user
    .findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((userData) => {
      if (!userData) {
        throw new NotFoundError('Запрашиваемый пользователь не найден');
      }
      res.send({ data: userData });
    })
    .catch((err) => {
      if (err.name === 'BadRequestError') {
        return next(new BadRequestError('Введены некорректные данные'));
      }
      return next(err);
    });
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  user
    .findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .then((userData) => {
      if (!userData) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.send({ data: userData });
    })
    .catch(next);
};

module.exports = {
  login,
  getMyProfile,
};
