const express = require('express');

const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

const usersRouter = require('./routes/users');
const cardRouter = require('./routes/cards');

const { NOT_FOUND } = require('./errors/errors');

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

app.use(usersRouter);
app.use(cardRouter);

app.use('*', (req, res) => {
  res.status(NOT_FOUND).send({ message: 'Страница не найдена' });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
