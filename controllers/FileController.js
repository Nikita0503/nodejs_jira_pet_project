const ApiError = require('../errors/ApiError');
const FileService = require('../service/FileService');
const {validationResult} = require('express-validator');

class TaskController {
    async attachFile(req, res, next){
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return next(ApiError.badRequest("Invalid data", errors))
            }
            const {taskId, commentId} = req.body;
            const file = req.files.file;
            const fileInfo = await FileService.attachFile(file, {
                taskId,
                commentId
            });
            res.json({file: fileInfo})
        } catch (e) {
            next(e);
        }
    }
   
    async detachFile(req, res, next){
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return next(ApiError.badRequest("Invalid data", errors))
            }
            const {fileId} = req.params;
            const isDone = await FileService.detachFile(fileId);
            res.json({deleted: isDone});
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new TaskController();