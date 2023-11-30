const User = require('../models/user');

const BAD_REQUEST = 400;
const SERVER_ERROR = 500;
const NOT_FOUND = 404;

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(201).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: err.message });
      } else {
        res.status(NOT_FOUND).send({ message: 'Запрашиваемый пользователь не найден' });
      }
      return res.status(SERVER_ERROR).send({ message: 'Произошла ошибка на сервере' });
    });
};

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch((err) => res.send({ message: err.message }));
};

const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => res.send({ message: err.message }));
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  const userId = req.user._id;

  if (userId) {
    User.findByIdAndUpdate(userId, { name, about }, {
      new: true,
    })
      .then((user) => res.send({ data: user }))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          res.status(BAD_REQUEST).send({ message: err.message });
        } else {
          res.status(NOT_FOUND).send({ message: `Пользователь по id: ${userId} не найден` });
        }
      });
  } else {
    res.status(SERVER_ERROR).send({ message: 'Прозошла ошибка на сервере' });
  }
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  const userId = req.user._id;

  if (userId) {
    User.findByIdAndUpdate(userId, { avatar }, {
      new: true,
    })
      .then((user) => res.send({ data: user }))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          res.status(BAD_REQUEST).send({ message: err.message });
        } else {
          res.status(NOT_FOUND).send({ message: `Пользователь по id: ${userId} не найден` });
        }
      });
  } else {
    res.status(SERVER_ERROR).send({ message: 'Прозошла ошибка на сервере' });
  }
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
};
