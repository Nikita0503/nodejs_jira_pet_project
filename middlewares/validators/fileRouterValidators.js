const {check, oneOf} = require('express-validator');

const saveFileValidators = () => {
    return [
        oneOf([
            check('taskId').isNumeric().withMessage('Must be a number'),
            check('commentId').isNumeric().withMessage('Must be a number'),
        ])
    ];  
};

const deleteFileValidators = () => {
    return [
        check('fileId').isNumeric().withMessage('Must be a number'),
    ];
};

module.exports = {
    saveFileValidators,
    deleteFileValidators
}