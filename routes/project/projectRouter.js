const Router = require('express');
const {createProjectValidators, editProjectValidators} = require('../../middlewares/validators/projectRouterValidators');
const authMiddleware = require('../../middlewares/authMiddleware');
const checkRoleMiddleware = require('../../middlewares/checkRoleMiddleware');
const ProjectController = require('../../controllers/ProjectController');

const router = new Router();
router.get('/',
    authMiddleware,
    ProjectController.getAllProjects);

router.post('/',
    checkRoleMiddleware('ADMIN'),
    ...createProjectValidators(),
    ProjectController.createProject);

router.put('/:id', 
    checkRoleMiddleware('ADMIN'),
    ...editProjectValidators(),
    ProjectController.editProject);

router.delete('/:id',
    checkRoleMiddleware('ADMIN'),
    ProjectController.deleteProject);

module.exports = router;