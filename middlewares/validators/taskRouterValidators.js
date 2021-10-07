const {check} = require('express-validator');

const createTaskValidators = () => {
    return [
        check('title').notEmpty().withMessage('Title is required'),
        check('description').notEmpty().withMessage('Description is required'),
        check('typeId').notEmpty().withMessage('Type id is required'),
        check('statusId').notEmpty().withMessage('Status id is required'),
        check('userId').notEmpty().withMessage('User id is required'),
        check('timeTracked').optional().isNumeric().withMessage('Must be a number'),
        check('timeAllotted').optional().isNumeric().withMessage('Must be a number')
    ];  
};

const editTaskValidators = () => {
    return [
        check('timeTracked').optional().isNumeric().withMessage('Must be a number'),
        check('timeAllotted').optional().isNumeric().withMessage('Must be a number')
    ];  
};

module.exports = {
    createTaskValidators,
    editTaskValidators
}