const express = require('express');
const router = express.Router();
const {
	getOne,
	getAll,
	create,
	update,
	remove,
	changePlan,
	changePaymentMethod,
} = require('../../controllers/v1/bubble');
const onlyAuthenticated = require('../../middlewares/access/onlyAuthenticated');
const allowMemberRoles = require('../../middlewares/access/allowMemberRoles');
const isMember = require('../../middlewares/access/isMember');
const fetchBubble = require('../../middlewares/fetch/fetchBubble');
const isBubblePaid = require('../../middlewares/access/isBubblePaid');

// Checking if exists and fetching bubble
router.use('/:bubble', fetchBubble);

router.get('/', getAll);
router.get('/:bubble', getOne);

router.use(onlyAuthenticated);
router.post('/', create);

router.use(isMember);
router.use('/:bubble', isBubblePaid);
router.use('/:bubble/members', require('./members'));
router.use('/:bubble/teams', require('./teams'));

router.use(allowMemberRoles('creator'));
router.put('/:bubble', update);
router.put('/:bubble/change-plan', changePlan);
router.put('/:bubble/change-payment-method', changePaymentMethod);
router.delete('/:bubble', remove);

module.exports = router;
