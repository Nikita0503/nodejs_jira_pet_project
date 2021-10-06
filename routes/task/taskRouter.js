const Router = require('express');
const {createTaskValidators} = require('../../middlewares/validators/taskRouterValidators');
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

//TODO: task editing
/*router.put('/:id', 
    checkRoleMiddleware('ADMIN'),
    TaskController.editTask);*/

router.delete('/:id',
    checkRoleMiddleware('ADMIN'),
    TaskController.deleteTask);

module.exports = router;