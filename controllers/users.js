const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequest = require('../errors/BadRequest');
const NotFound = require('../errors/NotFound');
const ConflictError = require('../errors/ConflictError');

const SALT_ROUNDS = 10;

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.status(200).send(users);
    })
    .catch(next);
};

const getUserById = (req, res, next) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        // res.status(NOT_FOUND).send({ message: 'Пользователь не найден' });
        throw new NotFound('Пользователь не найден');
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Переданы некорректные данные'));
        // res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
      } else {
        next(err);
        // res.status(DEFAULT_ERROR).send({ message: 'Произошла ошибка' });
      }
    });
};

const createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  if (!email || !password) {
    // return res.status(400).send({ message: 'Email и пароль должно быть заполнены' });
    return next(new BadRequest('Email и пароль должны быть заполнены'));
  }

  // bcrypt.hash(password, SALT_ROUNDS)
  //   .then((hash) => {
  //     User.create({
  //       name,
  //       about,
  //       avatar,
  //       email,
  //       password: hash,
  //     })
  //       .then((user) => {
  //         res.status(STATUS_CREATED).send(user);
  //       })
  //       .catch((err) => {
  //         if (err.name === 'ValidationError') {
  //           res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании пользователя' });
  //         } else if (err.code === 11000) {
  //           res.status(409).send({ message: 'Пользователь с таким email уже существует' });
  //         } else {
  //           res.status(DEFAULT_ERROR).send({ message: 'Произошла ошибка' });
  //         }
  //       });
  //   });

  bcrypt.hash(password, SALT_ROUNDS)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then(() => {
      res.status(201).send({
        name,
        about,
        avatar,
        email,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные при создании пользователя'));
        // res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании пользователя' });
      } else if (err.code === 11000) {
        next(new ConflictError('Пользователь с таким email уже существует'));
        // res.status(409).send({ message: 'Пользователь с таким email уже существует' });
      } else {
        next(err);
      }
    });
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(userId, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFound('Пользователь не найден');
        // res.status(NOT_FOUND).send({ message: 'Пользователь не найден' });
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequest('Переданы некорректные данные при обновлении профиля'));
        // res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      } else {
        next(err);
        // res.status(DEFAULT_ERROR).send({ message: 'Произошла ошибка' });
      }
    });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFound('Пользователь не найден');
        // res.status(NOT_FOUND).send({ message: 'Пользователь не найден' });
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequest('Переданы некорректные данные'));
        // res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
      } else {
        next(err);
        // res.status(DEFAULT_ERROR).send({ message: 'Произошла ошибка' });
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new BadRequest('Email и пароль должны быть заполнены'));
    // res.status(400).send({ message: 'Email и пароль должно быть заполнены' });
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        'secret-key',
        { expiresIn: '7d' },
      );
      res.status(200).send({ token });
    })
  // User.findOne({ email })
  //   .then((user) => {
  //     if (!user) {
  //       return res.status(403).send({ message: 'Такого пользователя не существует' });
  //     }

  //     return bcrypt.compare(password, user.password)
  //       .then((matched) => {
  //         if (!matched) {
  //           return res.status(401).send({ message: 'Неверный пароль' });
  //         }
  //         // return user;
  //         return res.status(STATUS_OK).send(user);
  //       });
  //   })
    .catch(next);
  // .catch(() => {
  //   res.status(DEFAULT_ERROR).send({ message: 'Произошла ошибка1' });
  // });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
  login,
};
