const Router = require('express');
const taskRouter = require('../task/taskRouter');

const {existsProjectValidators,
    createProjectValidators, 
    editProjectValidators, 
    deleteProjectValidators,
    addUserToProjectValidators,
    getProjectMembersValidators, 
    deleteUserFromProjectValidators} = require('../../middlewares/validators/projectRouterValidators');
const authMiddleware = require('../../middlewares/authMiddleware');
const checkRoleMiddleware = require('../../middlewares/checkRoleMiddleware');
const ProjectController = require('../../controllers/ProjectController');

const router = new Router();

router.use('/:projectId/tasks', taskRouter);

router.get('/',
    authMiddleware,
    ProjectController.getAllProjects);

router.post('/exists',
    authMiddleware,
    ...existsProjectValidators(),
    ProjectController.existsProject)

router.post('/',
    checkRoleMiddleware('ADMIN'),
    ...createProjectValidators(),
    ProjectController.createProject);

router.put('/:projectId', 
    checkRoleMiddleware('ADMIN'),
    ...editProjectValidators(),
    ProjectController.editProject);

router.delete('/:projectId',
    checkRoleMiddleware('ADMIN'),
    ...deleteProjectValidators(),
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