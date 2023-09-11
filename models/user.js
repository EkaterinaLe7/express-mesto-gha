const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const UnauthorizedError = require('../errors/UnauthorizedError');

// const AuthError = require('../errors/AuthError');
// const UserError = require('../errors/UserError');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Неправильные почта или пароль');
        // return next(new UnauthorizedError('Неправильные почта или пароль'));
        // return res.status(401).send({ message: 'Неправильные почта или пароль' });
        // return Promise.reject(new UnauthorizedError('Неправильные почта или пароль'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new UnauthorizedError('Неправильные почта или пароль');
            // return next(new UnauthorizedError('Неправильные почта или пароль'));
            // return res.status(401).send({ message: 'Неправильные почта или пароль' });
            // return Promise.reject(new UnauthorizedError('Неправильные почта или пароль'));
          }

          // return user;
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
