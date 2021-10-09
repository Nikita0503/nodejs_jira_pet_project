const {Router} = require('express');
const {createStatusValidators} = require('../../middlewares/validators/statusRouterValidators');
const authMiddleware = require('../../middlewares/authMiddleware');
const checkRoleMiddleware = require('../../middlewares/checkRoleMiddleware');
const StatusController = require('../../controllers/StatusController');

const router = new Router({mergeParams: true});

router.get('/',
    authMiddleware,
    StatusController.getAllStatuses);

router.post('/',
    checkRoleMiddleware('ADMIN'),
    ...createStatusValidators(),
    StatusController.createStatus);

//TODO: add put (edit) and delele methods

module.exports = router;