const Router = require('express');
const {loginValidators, registrationValidators} = require('../../middlewares/validators/userRouterValidators');
const UserController = require('../../controllers/userController');

const router = new Router();
router.get('/', UserController.getAllUsers);

router.post('/login', 
    ...loginValidators(),  
    UserController.login);

router.post('/registration', 
    ...registrationValidators(),
    UserController.registration);


module.exports = router;