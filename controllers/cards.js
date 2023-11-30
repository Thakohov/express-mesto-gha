const Card = require('../models/card');

const {
  NOT_FOUND,
  SERVER_ERROR,
  BAD_REQUEST,
} = require('../errors/errors');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send({ data: cards }))
    .catch(() => res.status(SERVER_ERROR)).send({ message: 'Произошла ошибка на сервере' });
};

const createCard = (req, res) => {
  const { name, link, owner = req.user._id } = req.body;

  Card.create({ name, link, owner })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы неккоректные данные' });
        return;
      }
      res.status(SERVER_ERROR).send({ message: 'Произошла ошибка на сервере' });
    });
};

const deleteCard = (req, res) => {
  Card.findById(req.params.cardId).then((card) => {
    if (!card) {
      res.status(NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена' });
    }

    Card.findByIdAndDelete(req.params.cardId)
      .then(() => res.status(200).send({ message: 'Карточка удалена' }))
      .catch((err) => {
        if (err.name === 'CastError') {
          res.status(BAD_REQUEST).send({ message: 'Некорректный id карточки' });
        }
        res.status(SERVER_ERROR).send({ message: 'Произошла ошибка на сервере' });
      });
  });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.message === 'NotFound') {
        res.status(NOT_FOUND).send({ message: 'Передан несуществующий id' });
        return;
      }

      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Некорректный id карточки' });
        return;
      }
      res.status(SERVER_ERROR).send({ message: 'Произошла ошибка на сервере' });
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Некорректный id карточки' });
      }
      res.status(SERVER_ERROR).send({ message: 'Произошла ошибка на сервере' });
    });
};

module.exports = {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
};
