const ApiError = require('../errors/ApiError');
const CommentService = require('../service/CommentService');
const {validationResult} = require('express-validator');

class CommentController {

    async getComments(req, res, next){//TODO: get files + get files in getTasks()
        try{
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return next(ApiError.badRequest("Invalid data", errors))
            }
            const {projectId, taskId} = req.params;
            const token = req.headers.authorization.split(' ')[1];
            const comments = await CommentService.getComments(projectId, taskId, token);
            return res.json({comments})
        } catch (e) {
            next(e);
        }
    }

    async createComment(req, res, next){
        try{
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return next(ApiError.badRequest("Invalid data", errors))
            }
            const {projectId, taskId} = req.params;
            const {message} = req.body;
            const token = req.headers.authorization.split(' ')[1];
            const comment = await CommentService.createComment(projectId, taskId, token, message);
            return res.json({comment})
        } catch (e) {
            next(e);
            console.log(e)

        }
    }

    async editComment(req, res, next){
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return next(ApiError.badRequest("Invalid data", errors))
            }
            const {projectId, taskId, commentId} = req.params;
            const {message} = req.body;
            const token = req.headers.authorization.split(' ')[1];
            const isDone = await CommentService.editComment(projectId, taskId, commentId, token, message);
            return res.json({updated: isDone})
        } catch (e) {
            next(e);
        }
    }

    async deleteComment(req, res, next){
        try{
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return next(ApiError.badRequest("Invalid data", errors))
            }
            const {projectId, taskId, commentId} = req.params;
            const token = req.headers.authorization.split(' ')[1];
            const isDone = await CommentService.deleteComment(projectId, taskId, commentId, token);
            return res.json({deleted: isDone})
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new CommentController();