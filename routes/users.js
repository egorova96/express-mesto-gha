const routerUser = require('express').Router();

const { celebrate, Joi } = require('celebrate');

const {
  getUserId, getUsers, updateUserData, updateAvatar, getMyProfile,
} = require('../controllers/users');

routerUser.get('/users', getUsers);

routerUser.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().length(24).hex(),
  }),
}), getUserId);

routerUser.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
}), updateUserData);

routerUser.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(/^(https?:\/\/)?[-\w.]+@([A-z0-9][-A-z0-9]+\.)+[A-z]{2,4}$/).required(),
  }),
}), updateAvatar);
routerUser.get('/users/me', getMyProfile);

module.exports = routerUser;
