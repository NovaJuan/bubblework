const express = require('express');
const router = express.Router({
	mergeParams: true,
});
const { add, getAll, remove } = require('../../controllers/v1/member');
const isMember = require('../../middlewares/isMember');

router.use(isMember);

router.post('/', add);
router.get('/', getAll);
router.delete('/:member', remove);

module.exports = router;
