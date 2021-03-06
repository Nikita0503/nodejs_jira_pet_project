const {check} = require('express-validator');

const createTypeValidators = () => {
    return [
        check('title').notEmpty().withMessage('Title is required'),
        check('color').custom(value => {
            var pattern = new RegExp(/^#([0-9a-f]{3}){1,2}$/i);
            if(pattern.test(value)) {
                return true;
            } else {
                throw new Error('Color must be hex value like "#000000"');
            }
        }).withMessage('Color must be hex value like "#000000"'),
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
        check('color').optional().custom(value => {
            var pattern = new RegExp(/^#([0-9a-f]{3}){1,2}$/i);
            if(pattern.test(value)) {
                return true;
            } else {
                throw new Error('Color must be hex value like "#000000"');
            }
        }).withMessage('Color must be hex value like "#000000"'),
    ];  
}

module.exports = {
    createTypeValidators,
    deleteTypeValidators,
    editTypeValidators
}