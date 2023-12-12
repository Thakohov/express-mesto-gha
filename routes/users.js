const router = require('express').Router();
const { validateUserId, validateUserAvatar, validateUserInfo } = require('../middlewares/validation');

const {
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
  getCurrentUser,
} = require('../controllers/users');

router.get('/', getUsers);

router.get('/me', getCurrentUser);

router.patch('/me', validateUserInfo, updateUser);

router.get('/:userId', validateUserId, getUserById);

router.patch('/me/avatar', validateUserAvatar, updateAvatar);

module.exports = router;
