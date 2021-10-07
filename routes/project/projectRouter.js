const Router = require('express');
const {createProjectValidators, editProjectValidators, addUserToProjectValidators} = require('../../middlewares/validators/projectRouterValidators');
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

router.post('/:projectId/users',
    checkRoleMiddleware('ADMIN'),
    ...addUserToProjectValidators(),
    ProjectController.addUserToProject)

module.exports = router;