const { Router } = require('express');
const router = Router();

router.use('/auth', require('./auth'));
router.use('/bubbles', require('./bubble'));

module.exports = router;
