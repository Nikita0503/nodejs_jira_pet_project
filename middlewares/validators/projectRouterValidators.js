const {check} = require('express-validator');

const createProjectValidators = () => {
    return [
        check('title').notEmpty().withMessage('Name is required'),
    ];  
};

const editProjectValidators = () => {
    return [
        check('title').notEmpty().withMessage('Name is required'),
    ]
}

module.exports = {
    createProjectValidators,
    editProjectValidators
}