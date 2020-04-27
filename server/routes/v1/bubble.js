const express = require('express');
const router = express.Router();
const { create, getOne } = require('../../controllers/v1/bubble');
const onlyAuthenticated = require('../../middlewares/onlyAuthenticated');

router.use(onlyAuthenticated);

router.use('/:bubble/members', require('./members'));
router.use('/:bubble/teams', require('./teams'));

router.get('/:bubble', getOne);
router.post('/', create);

module.exports = router;
