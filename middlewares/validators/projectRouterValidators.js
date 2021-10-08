const {check} = require('express-validator');

const createProjectValidators = () => {
    return [
        check('title').notEmpty().withMessage('Title is required'),
    ];  
};

const editProjectValidators = () => {
    return [
        check('projectId').isNumeric().withMessage('Must be a number'),
    ]
}

const deleteProjectValidators = () => {
    return [
        check('projectId').isNumeric().withMessage('Must be a number'),
    ]
}

const getProjectMembersValidators = () => {
    return [
        check('projectId').isNumeric().withMessage('Must be a number'),
    ]
}

const addUserToProjectValidators = () => {
    return [
        check('projectId').isNumeric().withMessage('Must be a number'),
        check('userId').isNumeric().withMessage('Must be a number'),
    ];
};

const deleteUserFromProjectValidators = () => {
    return [
        check('projectId').isNumeric().withMessage('Must be a number'),
        check('userId').isNumeric().withMessage('Must be a number'),
    ];
};

module.exports = {
    createProjectValidators,
    editProjectValidators,
    deleteProjectValidators,
    addUserToProjectValidators,
    getProjectMembersValidators,
    deleteUserFromProjectValidators
}