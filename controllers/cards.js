/* eslint-disable camelcase */
/* eslint-disable consistent-return */
/* eslint-disable no-console */
const card = require('../models/card');

const ERROR_iNCORRECT_DATA = 400;
const ERROR_NOT_FOUND = 404;
const ERROR_CODE = 500;
const getAnswer = (res, data) => res.status(200).send(data);

module.exports.createCard = (req, res) => {
  console.log(req.user._id);
  const { name, link } = req.body;
  const { _id } = req.user;
  card.create({ name, link, owner: _id }).then((userData) => res.send({ data: userData }))
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_iNCORRECT_DATA).send({ message: 'Введены неверные данные' });
      }
      res.status(ERROR_CODE).send({ message: 'Неизвестная ошибка' });
    });
};

module.exports.getAllCards = (req, res) => {
  card.find({})
    .then((cardsData) => res.send({ data: cardsData })).catch(() => res.status(ERROR_CODE).send({ message: 'Неизвестная ошибка' }));
};

module.exports.deleteCard = (req, res) => {
  card.findByIdAndRemove(req.params.cardId)
    .then((cardData) => {
      if (!cardData) {
        return res.status(ERROR_NOT_FOUND).send({ message: 'Выбранного фото не существует' });
      }
      getAnswer(res, cardData);
    })
    .catch((err) => {
      if (err.name === 'CardError') {
        res.status(ERROR_iNCORRECT_DATA).send({ message: 'Неверный Id пользователя' });
      }
      res.status(ERROR_CODE).send({ message: 'Неизвестная ошибка' });
    });
};

module.exports.likeCard = (req, res) => {
  const cardId = req.params._id;
  const userId = req.user._id;
  card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: userId } },
    { new: true },
  )
    .then((cardData) => {
      if (!cardData) {
        res.status(ERROR_NOT_FOUND).send({ message: 'Выбранного фото не существует' });
        return;
      }
      getAnswer(res, cardData);
    })
    .catch((err) => {
      if (err.name === 'CardError') {
        res.status(ERROR_iNCORRECT_DATA).send({ message: 'Неверный Id пользователя' });
        return;
      }
      res.status(ERROR_CODE).send({ message: 'Неизвестная ошибка' });
    });
};

module.exports.dislikeCard = (req, res) => {
  const cardId = req.params._id;
  const userId = req.user._id;

  card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: userId } },
    { new: true },
  )
    .then((cardData) => {
      if (!cardData) {
        res.status(ERROR_NOT_FOUND).send({ message: 'Выбранного фото не существует' });
        return;
      }
      getAnswer(res, cardData);
    })
    .catch((err) => {
      if (err.name === 'CardError') {
        res.status(ERROR_iNCORRECT_DATA).send({ message: 'Неверный Id пользователя' });
        return;
      }
      res.status(ERROR_CODE).send({ message: 'Неизвестная ошибка' });
    });
};
