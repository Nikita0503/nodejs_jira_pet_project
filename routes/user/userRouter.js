const Router = require('express');
const {loginValidators, 
    registrationValidators,
    editUserValidators} = require('../../middlewares/validators/userRouterValidators');
const authMiddleware = require('../../middlewares/authMiddleware');
const checkRoleMiddleware = require('../../middlewares/checkRoleMiddleware');
const UserController = require('../../controllers/userController');

const router = new Router();
router.get('/',
    authMiddleware,
    UserController.getAllUsers);

router.post('/login',
    ...loginValidators(),  
    UserController.login);

router.post('/registration', 
    ...registrationValidators(),
    UserController.registration);

router.put('/',
    authMiddleware,
    ...editUserValidators(),
    UserController.editUser);

router.delete('/avatar', 
    authMiddleware,
    UserController.deleteAvatar);

router.post('/me', 
    authMiddleware,
    UserController.getCurrentUser);

module.exports = router;