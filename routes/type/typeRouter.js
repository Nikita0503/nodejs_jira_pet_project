const {Router} = require('express');
const {createTypeValidators, editTypeValidators, deleteTypeValidators} = require('../../middlewares/validators/typeRouterValidators');
const authMiddleware = require('../../middlewares/authMiddleware');
const checkRoleMiddleware = require('../../middlewares/checkRoleMiddleware');
const TypeController = require('../../controllers/TypeController');

const router = new Router();

router.get('/',
    authMiddleware,
    TypeController.getAllTypes);

router.post('/',
    checkRoleMiddleware('ADMIN'),
    ...createTypeValidators(),
    TypeController.createType);

router.put('/:typeId',
    checkRoleMiddleware('ADMIN'),
    ...editTypeValidators(),
    TypeController.editType);

router.delete('/:typeId',
    checkRoleMiddleware('ADMIN'),
    ...deleteTypeValidators(),
    TypeController.deleteType);

module.exports = router;