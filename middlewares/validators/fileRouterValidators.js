const {check, oneOf} = require('express-validator');

const attachFileValidators = () => {
    return [
        check('file').custom((value, { req }) => {
            return req.files.file
        }).withMessage('File is required'),
        oneOf([
            check('taskId').isNumeric().withMessage('Must be a number'),
            check('commentId').isNumeric().withMessage('Must be a number'),
        ]),
    ];  
};

const detachFileValidators = () => {
    return [
        check('fileId').isNumeric().withMessage('Must be a number'),
    ];
};

module.exports = {
    attachFileValidators,
    detachFileValidators
}