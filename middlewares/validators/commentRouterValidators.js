const {check} = require('express-validator');

const getCommentsValidators = () => {
    return [
        check('projectId').isNumeric().withMessage('Must be a number'),
        check('taskId').isNumeric().withMessage('Must be a number'),
    ];  
};

const createCommentValidators = () => {
    return [
        check('projectId').isNumeric().withMessage('Must be a number'),
        check('taskId').isNumeric().withMessage('Must be a number'),
        check('message').notEmpty().withMessage('Message is required'),
    ];  
};

const editCommentValidators = () => {
    return [
        check('projectId').isNumeric().withMessage('Must be a number'),
        check('taskId').isNumeric().withMessage('Must be a number'),
        check('commentId').isNumeric().withMessage('Must be a number'),
        check('message').notEmpty().withMessage('Must be a number'),
    ];  
};

const deleteCommentValidators = () => {
    return [
        check('projectId').isNumeric().withMessage('Must be a number'),
        check('taskId').isNumeric().withMessage('Must be a number'),
        check('commentId').isNumeric().withMessage('Must be a number'),
    ];  
};

module.exports = {
    getCommentsValidators,
    createCommentValidators,
    editCommentValidators,
    deleteCommentValidators
}