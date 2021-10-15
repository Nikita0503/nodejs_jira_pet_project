const {check} = require('express-validator');
//TODO: make validators
const getCommentsValidators = () => {
    return [
    ];  
};

const createCommentValidators = () => {
    return [
        
    ];  
};

const editCommentValidators = () => {
    return [
       
    ];  
};

const deleteCommentValidators = () => {
    return [
        
    ];  
};

module.exports = {
    getCommentsValidators,
    createCommentValidators,
    editCommentValidators,
    deleteCommentValidators
}