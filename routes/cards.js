const routerCard = require('express').Router();
const {
  getAllCards, createCard, likeCard, dislikeCard, deleteCard,
} = require('../controllers/cards');

routerCard.get('/cards', getAllCards);
routerCard.post('/cards', createCard);
routerCard.put('/cards/:cardId/likes', likeCard);
routerCard.delete('/cards/:cardId/likes', dislikeCard);
routerCard.delete('/cards/:cardId', deleteCard);

module.exports = routerCard;
