const routerCard = require('express').Router();

const { celebrate, Joi } = require('celebrate');

const {
  getAllCards, createCard, likeCard, dislikeCard, deleteCard,
} = require('../controllers/cards');

routerCard.get('/cards', getAllCards);

routerCard.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().pattern(/^(https?:\/\/)?[-\w.]+@([A-z0-9][-A-z0-9]+\.)+[A-z]{2,4}$/).required().min(2),
  }),
}), createCard);

routerCard.put('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).required().hex(),
  }),
}), likeCard);

routerCard.delete('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).required().hex(),
  }),
}), dislikeCard);

routerCard.delete('/cards/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).required().hex(),
  }),
}), deleteCard);

module.exports = routerCard;
