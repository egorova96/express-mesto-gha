/* eslint-disable camelcase */
/* eslint-disable consistent-return */
/* eslint-disable no-console */
const card = require('../models/card');

const ERROR_iNCORRECT_DATA = 400;
const ERROR_NOT_FOUND = 404;
const ERROR_CODE = 500;

/* const getAnswer = (res, data) => res.status(200).send(data); */

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
<<<<<<< HEAD
  card.findByIdAndRemove(req.params.cardId)
=======
  const { cardId } = req.params;
  card.findByIdAndRemove(cardId)
>>>>>>> 7e9345da3ed4c80d1df94e43c28386ef3b488cd3
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
  const { cardId } = req.params;
  const { _id } = req.user;
  card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: _id } },
    { new: true },
  )
    .then((cardData) => {
      if (!cardData) {
        return res.status(ERROR_NOT_FOUND).send({ message: 'Выбранного фото не существует' });
      }
      getAnswer(res, cardData);
    })
    .catch((err) => {
      if (err.name === 'CardError') {
        return res.status(ERROR_iNCORRECT_DATA).send({ message: 'Неверный Id пользователя' });
      }
      res.status(ERROR_CODE).send({ message: 'Неизвестная ошибка' });
    });
};

module.exports.dislikeCard = (req, res) => {
  const { cardId } = req.params;
  const { _id } = req.user;

  card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: _id } },
    { new: true },
  )
    .then((cardData) => {
      if (!cardData) {
        return res.status(ERROR_NOT_FOUND).send({ message: 'Выбранного фото не существует' });
      }
      getAnswer(res, cardData);
    })
    .catch((err) => {
      if (err.name === 'CardError') {
        return res.status(ERROR_iNCORRECT_DATA).send({ message: 'Неверный Id пользователя' });
      }
      res.status(ERROR_CODE).send({ message: 'Неизвестная ошибка' });
    });
};
