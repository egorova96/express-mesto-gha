const routerUser = require('express').Router();
const {
  getUserId, getUsers, createUser, updateUserData, updateAvatar,
} = require('../controllers/users');

routerUser.get('/users', getUsers);
routerUser.get('/users/:userId', getUserId);
routerUser.post('/users', createUser);
routerUser.patch('/users/me', updateUserData);
routerUser.patch('/users/me/avatar', updateAvatar);

module.exports = routerUser;
