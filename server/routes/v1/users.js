const { Router } = require('express');
const {
	getOne,
	getAll,
	create,
	update,
	remove,
} = require('../../controllers/v1/user');
const allowUserRoles = require('../../middlewares/access/allowUserRoles');
const onlyAuthenticated = require('../../middlewares/access/onlyAuthenticated');
const fetchUser = require('../../middlewares/fetch/fetchUser');

const router = Router();

router.use('/:user', fetchUser);

router.get('/', getAll);
router.get('/:user', getOne);

router.use(onlyAuthenticated, allowUserRoles('admin'));
router.post('/', create);
router.put('/:user', update);
router.delete('/:user', remove);

module.exports = router;
