const User = require('../models/user');

const {
  NOT_FOUND,
  SERVER_ERROR,
  BAD_REQUEST,
} = require('../errors/errors');

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(201).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы неккоректные данные' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'Произошла ошибка на сервере' });
      }
    });
};

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(SERVER_ERROR).send({ message: 'Произошла ошибка на сервере' }));
};

const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.message === 'NotFound') {
        res.status(NOT_FOUND).send({ message: 'Пользователь по данному id не найден' });
        return;
      }
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Введены неккоректные данные' });
        return;
      }
      res.status(SERVER_ERROR).send({ message: 'Произошла ошибка на сервере' });
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  const userId = req.user._id;

  if (userId) {
    User.findByIdAndUpdate(userId, { name, about }, {
      new: true,
      runValidators: true,
    })
      .then((user) => res.send({ data: user }))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          res.status(BAD_REQUEST).send({ message: 'Введены неккоректные данные' });
        }

        if (err.message === 'NotFound') {
          res.status(NOT_FOUND).send({ message: `Пользователь по id: ${userId} не найден` });
        }

        res.status(SERVER_ERROR).send({ message: 'Прозошла ошибка на сервере' });
      });
  }
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  const userId = req.user._id;

  if (userId) {
    User.findByIdAndUpdate(userId, { avatar }, {
      new: true,
      runValidators: true,
    })
      .then((user) => res.send({ data: user }))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          res.status(BAD_REQUEST).send({ message: 'Введены неккоректные данные' });
        }

        if (err.message === 'NotFound') {
          res.status(NOT_FOUND).send({ message: `Пользователь по id: ${userId} не найден` });
        }

        res.status(SERVER_ERROR).send({ message: 'Прозошла ошибка на сервере' });
      });
  }
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
};
