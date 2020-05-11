const { Router } = require('express');
const {
	create,
	getAll,
	getOne,
	update,
	remove,
} = require('../../controllers/v1/plan');
const allowUserRoles = require('../../middlewares/access/allowUserRoles');
const onlyAuthenticated = require('../../middlewares/access/onlyAuthenticated');
const fetchPlan = require('../../middlewares/fetch/fetchPlan');

const router = Router();

router.use('/:plan', fetchPlan);

router.get('/', getAll);
router.get('/:plan', getOne);

router.use(onlyAuthenticated, allowUserRoles('admin'));
router.post('/', create);
router.put('/:plan', update);
router.delete('/:plan', remove);

module.exports = router;
