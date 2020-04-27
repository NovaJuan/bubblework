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
const isMember = require('../../middlewares/isMember');
const onlyLeader = require('../../middlewares/onlyLeader');

router.use(isMember);

router.get('/', getAll);

router.use(onlyLeader);
router.post('/', add);
router.get('/:member', getOne);
router.delete('/:member', remove);
router.put('/:member', update);

module.exports = router;
