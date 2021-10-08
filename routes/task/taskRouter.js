const {Router} = require('express');
const {createTaskValidators, editTaskValidators} = require('../../middlewares/validators/taskRouterValidators');
const authMiddleware = require('../../middlewares/authMiddleware');
const checkRoleMiddleware = require('../../middlewares/checkRoleMiddleware');
const TaskController = require('../../controllers/TaskController');

const router = new Router({mergeParams: true});

router.get('/',
    authMiddleware,
    TaskController.getTasks);

router.post('/',
    checkRoleMiddleware('ADMIN'),
    ...createTaskValidators(),
    TaskController.createTask);

router.put('/:taskId', 
    checkRoleMiddleware('ADMIN'),
    ...editTaskValidators(),
    TaskController.editTask);

router.delete('/:taskId',
    checkRoleMiddleware('ADMIN'),
    TaskController.deleteTask);

module.exports = router;