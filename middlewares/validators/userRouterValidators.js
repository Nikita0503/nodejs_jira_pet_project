const {check} = require('express-validator');

const loginValidators = () => {
    return [
        check('email').isEmail().withMessage('Not an email'),
        check('password').isLength({min: 6, max:32}).withMessage('Not suitable length')
    ];  
};

const registrationValidators = () => {
    return [
        check('email').isEmail().withMessage('Not an email'),
        check('password').isLength({min: 6, max:32}).withMessage('Not suitable length'),
        check('password').not().isNumeric().withMessage('Password should contain letters'),
        check('name').notEmpty().withMessage('Name is required'),
        check('role').isIn(['USER', 'ADMIN', null]).withMessage('role does not exist'),
    ];
};

module.exports = {
    loginValidators,
    registrationValidators
}