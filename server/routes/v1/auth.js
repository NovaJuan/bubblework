const { Router } = require('express');
const { register } = require('../../controllers/v1/auth');

const router = Router();

router.post('/register', register);

module.exports = router;
