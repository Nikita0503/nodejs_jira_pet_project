const Router = require('express');
const {check} = require('express-validator');
const router = new Router();
const UserController = require('../../controllers/userController');

router.get('/', UserController.getAllUsers);

router.post('/login', 
    check('email').isEmail().withMessage('Not an email'),
    check('password').isLength({min: 6, max:32}).withMessage('Not suitable length'),    
    UserController.login);

router.post('/registration', 
    check('email').isEmail().withMessage('Not an email'),
    check('password').isLength({min: 6, max:32}).withMessage('Not suitable length'),
    check('password').not().isNumeric().withMessage('Password should contain letters'),
    check('name').notEmpty().withMessage('Name is required'),
    check('role').isIn(['USER', 'ADMIN', null]).withMessage('role does not exist'),
    UserController.registration);


module.exports = router;