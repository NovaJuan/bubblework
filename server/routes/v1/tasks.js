const express = require('express');
const router = express.Router({
	mergeParams: true,
});
const {
	create,
	getAll,
	getOne,
	update,
	remove,
} = require('../../controllers/v1/task');
const allowMemberRoles = require('../../middlewares/access/allowMemberRoles');
const fetchTask = require('../../middlewares/fetch/fetchTask');

// Checking if exists and fetching task
router.use('/:task', fetchTask);

router.get('/', getAll);
router.get('/:task', getOne);

router.use(allowMemberRoles('creator', 'leader', 'manager'));
router.post('/', create);
router.put('/:task', update);
router.delete('/:task', remove);

module.exports = router;
