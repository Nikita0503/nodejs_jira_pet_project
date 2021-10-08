const Router = require('express');
const taskRouter = require('../task/taskRouter');

const {createProjectValidators, 
    editProjectValidators, 
    addUserToProjectValidators,
    getProjectMembersValidators, 
    deleteUserFromProjectValidators} = require('../../middlewares/validators/projectRouterValidators');
const authMiddleware = require('../../middlewares/authMiddleware');
const checkRoleMiddleware = require('../../middlewares/checkRoleMiddleware');
const ProjectController = require('../../controllers/ProjectController');

const router = new Router();

router.use('/:projectId/tasks', taskRouter); //TODO: protect: for only project members

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

router.get('/:projectId/users',
    authMiddleware,
    ...getProjectMembersValidators(),
    ProjectController.getProjectMembers);

router.post('/:projectId/users',
    checkRoleMiddleware('ADMIN'),
    ...addUserToProjectValidators(),
    ProjectController.addUserToProject);

router.delete('/:projectId/users',
    checkRoleMiddleware('ADMIN'),
    ...deleteUserFromProjectValidators(),
    ProjectController.deleteUserFromProject);

module.exports = router;