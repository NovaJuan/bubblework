const express = require('express');
const router = express.Router({
	mergeParams: true,
});
const {
	add,
	getAll,
	getOne,
	remove,
	update,
} = require('../../controllers/v1/member');
const allowMemberRoles = require('../../middlewares/access/allowMemberRoles');
const fetchMember = require('../../middlewares/fetch/fetchMember');
const membersLimit = require('../../middlewares/access/membersLimit');

// Checking if exists and fetching member
router.use('/:member', fetchMember);

router.get('/', getAll);
router.get('/:member', getOne);

router.use(allowMemberRoles('leader', 'creator'));
router.post('/', membersLimit, add);
router.delete('/:member', remove);
router.put('/:member', update);

module.exports = router;
