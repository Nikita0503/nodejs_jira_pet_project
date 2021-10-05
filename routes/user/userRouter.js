const Router = require('express');
const {loginValidators, registrationValidators} = require('../../middlewares/validators/userRouterValidators');
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

module.exports = router;