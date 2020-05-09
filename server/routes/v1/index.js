const { Router } = require('express');
const router = Router();

router.use('/auth', require('./auth'));
router.use('/bubbles', require('./bubble'));
router.use('/users', require('./users'));
router.use('/plans', require('./plan'));

module.exports = router;
