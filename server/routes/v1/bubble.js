const express = require('express');
const router = express.Router();
const {
	getOne,
	getAll,
	create,
	update,
	remove,
} = require('../../controllers/v1/bubble');
const onlyAuthenticated = require('../../middlewares/onlyAuthenticated');
const allowMemberRoles = require('../../middlewares/allowMemberRoles');
const isMember = require('../../middlewares/isMember');
const fetchBubble = require('../../middlewares/fetchBubble');

// Checking if exists and fetching bubble
router.use('/:bubble', fetchBubble);

router.get('/', getAll);
router.get('/:bubble', getOne);

router.use(onlyAuthenticated);
router.post('/', create);

router.use(isMember);
router.use('/:bubble/members', require('./members'));
router.use('/:bubble/teams', require('./teams'));

router.use(allowMemberRoles('creator'));
router.put('/:bubble', update);
router.delete('/:bubble', remove);

module.exports = router;
