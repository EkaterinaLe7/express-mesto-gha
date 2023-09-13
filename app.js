const express = require('express');

const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');

const app = express();

const { errors } = require('celebrate');
const auth = require('./middlewares/auth');
const usersRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const errorHandler = require('./middlewares/errorHandler');

const NotFound = require('./errors/NotFound');

const { loginValidation, createUserValidation } = require('./middlewares/validation');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(bodyParser.json());

app.use(helmet());

app.post('/signin', loginValidation, login);
app.post('/signup', createUserValidation, createUser);

app.use(auth);

app.use(usersRouter);
app.use(cardRouter);

app.use('*', (req, res, next) => {
  next(new NotFound('Страница по указанному маршруту не найдена'));
});

app.use(errors());

app.use(errorHandler);

app.listen(PORT);
