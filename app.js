const express = require('express');

const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

const User = require('./models/user');

const port = 3000;

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected bd');
});

app.use(bodyParser.json());

app.use((req, res, next) => {
  req.user = {
    _id: '64e3bf68e15294d9bf2a0d60',
  };

  next();
});

app.get('/', (req, res) => {
  res.send('Hello World!iuhz');
});

app.get('/users', (req, res) => {
  User.find({})
    .then((users) => {
      res.status(200).send({ data: users });
    })
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
});

app.get('/users/:userId', (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'User not found' });
      }
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
});

app.post('/users', (req, res) => {
  User.create({ ...req.body })
    .then((user) => {
      res.status(201).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
