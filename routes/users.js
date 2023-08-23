const router = require('express').Router();

const {
  getUsers,
  getUserBuId,
  createUser,
  updateUser,
} = require('../controllers/users');

router.get('/users', getUsers);

router.get('/users/:userId', getUserBuId);

router.post('/users', createUser);

router.patch('/users/me', updateUser);

module.exports = router;
