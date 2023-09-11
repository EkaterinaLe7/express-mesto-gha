const express = require('express');

const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

const auth = require('./middlewares/auth');
const usersRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const errorHandler = require('./middlewares/errorHandler');

const NotFound = require('./errors/NotFound');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(bodyParser.json());

app.post('/signin', login);
app.post('/signup', createUser);

app.use(auth);

app.use(usersRouter);
app.use(cardRouter);

app.use('*', (req, res, next) => {
  next(new NotFound('Страница по указанному маршруту не найдена'));
});

app.use(errorHandler);

app.listen(PORT);
