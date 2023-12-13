const router = require('express').Router();
const userRouter = require('./users');
const cardRouter = require('./cards');
const auth = require('../middlewares/auth');
const { createUser, login } = require('../controllers/users');
const { validateCreateUser, validateLoginUser } = require('../middlewares/validation');
const NotFound = require('../errors/NotFound');

router.post('/signin', validateLoginUser, login);
router.post('/signup', validateCreateUser, createUser);

router.use(auth);

router.use('/users', userRouter);
router.use('/cards', cardRouter);

router.use('*', (next) => next(new NotFound('Ресурс не найден')));

module.exports = router;
