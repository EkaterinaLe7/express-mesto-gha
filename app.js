const express = require('express');

const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

const usersRouter = require('./routes/users');

const port = 3000;

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected bd');
});

app.use(bodyParser.json());

app.use(usersRouter);

app.use((req, res, next) => {
  req.user = {
    _id: '64e3bf68e15294d9bf2a0d60',
  };

  next();
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
