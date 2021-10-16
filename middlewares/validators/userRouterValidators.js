const {check} = require('express-validator');
const path = require('path');

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
        check('avatar').custom((value, { req }) => {
            const avatar = req.files?.avatar?.name;
            if(!avatar){
                return true;
            }
            var extension = (path.extname(avatar)).toLowerCase();
            if(extension === '.jpg'
                || extension === '.jpeg'
                || extension === '.png'
                || extension === '.gif'){
                return true;
            }else{
                return false;
            }
        }).withMessage('Avatar should be image'),
    ];
};

const editUserValidators = () => {
    return [
        check('avatar').custom((value, { req }) => {
            const avatar = req.files?.avatar?.name;
            if(!avatar){
                return true;
            }
            var extension = (path.extname(avatar)).toLowerCase();
            if(extension === '.jpg'
                || extension === '.jpeg'
                || extension === '.png'
                || extension === '.gif'){
                return true;
            }else{
                return false;
            }
        }).withMessage('Avatar should be image'),
    ];
}

module.exports = {
    loginValidators,
    registrationValidators,
    editUserValidators
}