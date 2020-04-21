const { Router } = require('express');
const router = Router();

router.use('/auth', require('./auth'));

module.exports = router;
