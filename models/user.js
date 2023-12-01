const mongoose = require('mongoose');
const { isURL } = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: [2, 'Минимальная длина поля "name" - 2'],
    maxLength: [30, 'Максимальная длина поля "name" - 30'],
    required: [true, 'Поле "name" должно быть заполнено'],
  },
  about: {
    type: String,
    minLength: [2, 'Минимальная длина поля "about" - 2'],
    maxLength: [30, 'Максимальная длина поля "about" - 30'],
    required: [true, 'Поле "about" должно быть заполнено'],
  },
  avatar: {
    type: String,
    required: [true, 'Поле "avatar" должно быть заполнено'],
    validate: {
      validator: (v) => isURL(v),
      message: 'Некорректный URL',
    },
  },
}, { versionKey: false });

module.exports = mongoose.model('user', userSchema);
