/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable indent */
/* eslint-disable camelcase */
/* eslint-disable consistent-return */
/* eslint-disable no-console */
const card = require('../models/card');
const { OK } = require('../utils/constants');
const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');

// const getAnswer = (res, data) => res.status(200).send(data);

module.exports.createCard = (req, res, next) => {
  console.log(req.user._id);
  const { name, link } = req.body;
  card.create({ name, link, owner: req.user._id })
  .then((cardData) => res.status(OK).send({ data: cardData }))
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.name === 'BadRequestError') {
        return next(new BadRequestError('Введены неверные данные'));
      }
      return next(err);
    });
};

module.exports.getAllCards = (req, res, next) => {
  card.find({})
    .then((cardsData) => res.send({ data: cardsData })).catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  card.findById(req.params.cardId)
    .then((cardData) => {
      if (!cardData) {
        throw new NotFoundError('Выбранного фото не существует');
      }
      if (cardData.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Недостаточно прав доступа');
      }
    card.findByIdAndRemove(req.params.cardId).then((user) =>
    res.status(OK).send({ data: user }))
    .catch((err) => {
      if (err.name === 'UserError') {
        return next(new BadRequestError('Неверный Id пользователя'));
      }
      return next(err);
    });
  })
  .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  card.findById(req.params.cardId).then((cardData) => {
    if (!cardData) {
      throw new NotFoundError('Выбранного фото не существует');
    }
  card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((newCardData) => {
        res.status(OK).send({ data: newCardData });
      })
      .catch((err) => {
      if (err.name === 'CardError') {
        return next(new BadRequestError('Неверный Id пользователя'));
      }
      return next(err);
    });
    })
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  card.findById(req.params.cardId).then((cardData) => {
    if (!cardData) {
      throw new NotFoundError('Выбранного фото не существует');
    } return card
    .findByIdAndUpdate(
      req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((newCardData) => {
        res.status(OK).send({ data: newCardData });
      })
    .catch((err) => {
      if (err.name === 'CardError') {
        return next(new BadRequestError('Неверный Id пользователя'));
      }
      return next(err);
    });
  })
    .catch(next);
};
