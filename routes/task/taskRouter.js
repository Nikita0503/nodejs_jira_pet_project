const Router = require('express');
const {createTaskValidators, editTaskValidators} = require('../../middlewares/validators/taskRouterValidators');
const authMiddleware = require('../../middlewares/authMiddleware');
const checkRoleMiddleware = require('../../middlewares/checkRoleMiddleware');
const TaskController = require('../../controllers/TaskController');

const router = new Router();

router.get('/:projectId',
    authMiddleware,
    TaskController.getTasks);

router.post('/:projectId',
    checkRoleMiddleware('ADMIN'),
    ...createTaskValidators(),
    TaskController.createTask);

router.put('/:id', 
    checkRoleMiddleware('ADMIN'),
    ...editTaskValidators(),
    TaskController.editTask);

router.delete('/:id',
    checkRoleMiddleware('ADMIN'),
    TaskController.deleteTask);

//TODO: get tasks of project

module.exports = router;