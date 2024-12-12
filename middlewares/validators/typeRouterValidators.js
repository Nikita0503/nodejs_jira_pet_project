const {check} = require('express-validator');

const createTypeValidators = () => {
    return [
        check('title').notEmpty().withMessage('Title is required'),
    ];  
};

const deleteTypeValidators = () => {
    return [
        check('typeId').isNumeric().withMessage('Must be a number'),
    ];  
};

const editTypeValidators = () => {
    return [
        check('typeId').optional().isNumeric().withMessage('Must be a number'),
        check('title').optional().notEmpty().withMessage('Title is required'),
    ];  
}

module.exports = {
    createTypeValidators,
    deleteTypeValidators,
    editTypeValidators
}