const express = require('express');
const router = express.Router({
	mergeParams: true,
});
const fetchTeam = require('../../middlewares/fetch/fetchTeam');
const allowMemberRoles = require('../../middlewares/access/allowMemberRoles');
const {
	create,
	getAll,
	update,
	getOne,
	remove,
} = require('../../controllers/v1/team');

// Checking if exists and fetching team
router.use('/:team', fetchTeam);

router.get('/', getAll);
router.get('/:team', getOne);

router.use('/:team/tasks', require('./tasks'));

router.use(allowMemberRoles('creator', 'leader'));
router.post('/', create);
router.put('/:team', update);
router.delete('/:team', remove);

module.exports = router;
