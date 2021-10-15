const {Router} = require('express');
const {createStatusValidators,
    deleteStatusValidators,
    editStatusValidators} = require('../../middlewares/validators/statusRouterValidators');
const authMiddleware = require('../../middlewares/authMiddleware');
const checkRoleMiddleware = require('../../middlewares/checkRoleMiddleware');
const StatusController = require('../../controllers/StatusController');

const router = new Router();

router.get('/',
    authMiddleware,
    StatusController.getAllStatuses);

router.post('/',
    checkRoleMiddleware('ADMIN'),
    ...createStatusValidators(),
    StatusController.createStatus);

router.put('/:statusId',
    checkRoleMiddleware('ADMIN'),
    ...editStatusValidators(),
    StatusController.editStatus);

router.delete('/:statusId',
    checkRoleMiddleware('ADMIN'),
    ...deleteStatusValidators(),
    StatusController.deleteStatus);

module.exports = router;