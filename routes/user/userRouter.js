const Router = require('express');
const router = new Router();
const userController = require('../../controllers/userController');

const {body} = require('express-validator');

router.get('/login', userController.login);
router.post('/registration', 
    body('email').isEmail(),
    body('password').isLength({min: 6, max:32}),
    userController.registration);

module.exports = router;