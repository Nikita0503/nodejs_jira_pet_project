const {check} = require('express-validator');
const path = require('path');

const getTasksValidators = () => {
    return [
        check('projectId').isNumeric().withMessage('Must be a number'),
    ];  
};

const getTaskValidators = () => {
    return [
        check('projectId').isNumeric().withMessage('Must be a number'),
        check('taskId').isNumeric().withMessage('Must be a number')
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
        check('timeAllotted').optional().isNumeric().withMessage('Must be a number'),
        check('file').custom((value, { req }) => {
            let files = req?.files?.file;
            if(!files){
                return true;
            }
            if(!files?.length && files?.name){
                files = [files]
            }
            for(let i = 0; i < files.length; i++){
                var extension = (path.extname(files[i].name)).toLowerCase();
                if(extension !== '.jpg'
                    && extension !== '.jpeg'
                    && extension !== '.png'
                    && extension !== '.gif'
                    && extension !== '.webp'){
                    return false;
                }
            }
            return true;
        }).withMessage('Files should be images'),
    ];  
};

const editTaskValidators = () => {
    return [
        check('projectId').isNumeric().withMessage('Must be a number'),
        check('taskId').isNumeric().withMessage('Must be a number'),
        check('typeId').optional().isNumeric().withMessage('Type id is required'),
        check('statusId').optional().isNumeric().withMessage('Status id is required'),
        check('userId').optional().isNumeric().withMessage('User id is required'),
        check('timeAllotted').optional().isNumeric().withMessage('Must be a number'),
        check('file').custom((value, { req }) => {
            let files = req?.files?.file;
            if(!files){
                return true;
            }
            if(!files?.length && files?.name){
                files = [files]
            }
            for(let i = 0; i < files.length; i++){
                var extension = (path.extname(files[i].name)).toLowerCase();
                if(extension !== '.jpg'
                    && extension !== '.jpeg'
                    && extension !== '.png'
                    && extension !== '.gif'
                    && extension !== '.webp'){
                    return false;
                }
            }
            return true;
        }).withMessage('Files should be images'),
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
    getTaskValidators,
    createTaskValidators,
    editTaskValidators,
    deleteTaskValidators
}