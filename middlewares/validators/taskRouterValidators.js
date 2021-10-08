const {check} = require('express-validator');

const getTasksValidators = () => {
    return [
        check('projectId').isNumeric().withMessage('Must be a number'),
    ];  
};

const createTaskValidators = () => {
    return [
        check('projectId').isNumeric().withMessage('Must be a number'),
        check('title').notEmpty().withMessage('Title is required'),
        check('description').notEmpty().withMessage('Description is required'),
        check('typeId').isNumeric().withMessage('Type id is required'),
        check('statusId').isNumeric().withMessage('Status id is required'),
        check('userId').isNumeric().withMessage('User id is required'),
        check('timeTracked').optional().isNumeric().withMessage('Must be a number'),
        check('timeAllotted').optional().isNumeric().withMessage('Must be a number')
    ];  
};

const editTaskValidators = () => {
    return [
        check('projectId').isNumeric().withMessage('Must be a number'),
        check('taskId').isNumeric().withMessage('Must be a number'),
        check('typeId').optional().isNumeric().withMessage('Type id is required'),
        check('statusId').optional().isNumeric().withMessage('Status id is required'),
        check('userId').optional().isNumeric().withMessage('User id is required'),
        check('timeTracked').optional().isNumeric().withMessage('Must be a number'),
        check('timeAllotted').optional().isNumeric().withMessage('Must be a number')
    ];  
};

const deleteTaskValidators = () => {
    return [
        check('projectId').isNumeric().withMessage('Must be a number'),
        check('taskId').isNumeric().withMessage('Must be a number')
    ];  
};

module.exports = {
    getTasksValidators,
    createTaskValidators,
    editTaskValidators,
    deleteTaskValidators
}