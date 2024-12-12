const {check} = require('express-validator');

const createStatusValidators = () => {
    return [
        check('title').notEmpty().withMessage('Title is required'),
    ];  
};

const deleteStatusValidators = () => {
    return [
        check('statusId').isNumeric().withMessage('Must be a number'),
    ];  
};

const editStatusValidators = () => {
    return [
        check('statusId').optional().isNumeric().withMessage('Must be a number'),
        check('title').optional().notEmpty().withMessage('Title is required'),
    ];  
}

module.exports = {
    createStatusValidators,
    deleteStatusValidators,
    editStatusValidators
}