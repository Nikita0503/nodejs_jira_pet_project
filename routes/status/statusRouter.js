const {Router} = require('express');
const {statusValidators,
    deleteStatusValidators,
    editStatusValidators} = require('../../middlewares/validators/statusRouterValidators');
const authMiddleware = require('../../middlewares/authMiddleware');
const checkRoleMiddleware = require('../../middlewares/checkRoleMiddleware');
const StatusController = require('../../controllers/StatusController');

const router = new Router({mergeParams: true});

router.get('/',
    authMiddleware,
    StatusController.getAllStatuses);

router.post('/',
    checkRoleMiddleware('ADMIN'),
    ...statusValidators(),
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