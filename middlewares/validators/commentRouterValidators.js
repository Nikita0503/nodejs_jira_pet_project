const {check} = require('express-validator');
const path = require('path');

const getFullCommentValidators = () => {
    return [
        check('projectId').isNumeric().withMessage('Must be a number'),
        check('taskId').isNumeric().withMessage('Must be a number'),
        check('commentId').isNumeric().withMessage('Must be a number'),
    ];  
};

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
        check('file').custom((value, { req }) => {
            let files = req?.files?.file;
            if(!files){
                return true;
            }
            if(!files?.length && files?.name){
                files = [files]
            }
            console.log({files})
            for(let i = 0; i < files.length; i++){
                var extension = (path.extname(files[i].name)).toLowerCase();
                console.log({extension})
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

const editCommentValidators = () => {
    return [
        check('projectId').isNumeric().withMessage('Must be a number'),
        check('taskId').isNumeric().withMessage('Must be a number'),
        check('commentId').isNumeric().withMessage('Must be a number'),
        check('message').notEmpty().withMessage('Message is required'),
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

const deleteCommentValidators = () => {
    return [
        check('projectId').isNumeric().withMessage('Must be a number'),
        check('taskId').isNumeric().withMessage('Must be a number'),
        check('commentId').isNumeric().withMessage('Must be a number'),
    ];  
};

module.exports = {
    getFullCommentValidators,
    getCommentsValidators,
    createCommentValidators,
    editCommentValidators,
    deleteCommentValidators
}