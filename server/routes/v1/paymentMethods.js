const { Router } = require('express');
const {
	getAll,
	create,
	update,
	remove,
} = require('../../controllers/v1/paymentMethods');

const router = Router();

router.get('/', getAll);
router.post('/', create);
router.put('/:pm', update);
router.delete('/:pm', remove);

module.exports = router;
