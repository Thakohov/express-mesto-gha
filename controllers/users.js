const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

const SECRET_KEY = 'zzzzzxxxxcccvvb';

const BadRequest = require('../errors/BadRequest');
const NotFound = require('../errors/NotFound');
const Conflict = require('../errors/Conflict');

const createUser = (req, res, next) => {
  const {
    email,
    password,
    name,
    about,
    avatar,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
      about,
      avatar,
    }))
    .then((user) => res.status(201).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Введены неккоректные данные'));
        return;
      }

      if (err.code === 11000) {
        next(new Conflict('Пользователь с таким email уже существует'));
        return;
      }
      next();
    });
};

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => {
      next();
    });
};

const getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.message === 'NotFound') {
        next(new NotFound('Пользователь по данному id не найден'));
        return;
      }
      if (err.name === 'CastError') {
        next(new BadRequest('Введены неккоректные данные'));
        return;
      }
      next();
    });
};

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.message === 'NotFound') {
        next(new NotFound('Пользователь по данному id не найден'));
        return;
      }
      if (err.name === 'CastError') {
        next(new BadRequest('Введены неккоректные данные'));
        return;
      }
      next();
    });
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(
    userId,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Введены неккоректные данные'));
        return;
      }

      if (err.message === 'NotFound') {
        next(new NotFound('Пользователь по данному id не найден'));
        return;
      }

      next();
    });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const userId = req.user._id;
  User.findByIdAndUpdate(
    userId,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Введены неккоректные данные'));
        return;
      }

      if (err.message === 'NotFound') {
        next(new NotFound('Пользователь по данному id не найден'));
        return;
      }

      next();
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, SECRET_KEY, { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(next);
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  getCurrentUser,
  updateUser,
  updateAvatar,
  login,
};
