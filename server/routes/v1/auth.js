const { Router } = require('express');
const { register, login, info, update } = require('../../controllers/v1/auth');
const onlyAuthenticated = require('../../middlewares/onlyAuthenticated');

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/', onlyAuthenticated, info);
router.put('/', onlyAuthenticated, update);

module.exports = router;
