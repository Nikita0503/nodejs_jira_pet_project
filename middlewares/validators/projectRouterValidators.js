const {check} = require('express-validator');

const createProjectValidators = () => {
    return [
        check('title').notEmpty().withMessage('Title is required'),
    ];  
};

const editProjectValidators = () => {
    return [
        check('title').notEmpty().withMessage('Title is required'),
    ]
}

module.exports = {
    createProjectValidators,
    editProjectValidators
}