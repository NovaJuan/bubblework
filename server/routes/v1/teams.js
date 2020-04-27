const express = require('express');
const router = express.Router({
	mergeParams: true,
});
const isMember = require('../../middlewares/isMember');
const onlyLeader = require('../../middlewares/onlyLeader');
const {
	create,
	getAll,
	update,
	getOne,
	remove,
} = require('../../controllers/v1/team');

router.use(isMember);

router.get('/', getAll);
router.get('/:team', getOne);

router.use(onlyLeader);
router.post('/', create);
router.put('/:team', update);
router.delete('/:team', remove);

module.exports = router;
