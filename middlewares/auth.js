/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');

const AuthorizationRequiredError = require('../errors/AuthorizationRequiredError');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new AuthorizationRequiredError('Войдите на сайт или зарегистрируйтесь');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'super-strong-secret');
  } catch (err) {
    return next(new AuthorizationRequiredError('Войдите на сайт или зарегистрируйтесь'));
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};
