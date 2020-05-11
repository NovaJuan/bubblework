const { Router } = require('express');
const { register, login, info, update } = require('../../controllers/v1/auth');
const onlyAuthenticated = require('../../middlewares/access/onlyAuthenticated');

const router = Router();

router.post('/register', register);
router.post('/login', login);

router.use(onlyAuthenticated);
router.get('/', info);
router.put('/', update);

router.use('/payment-methods', require('./paymentMethods'));

module.exports = router;
