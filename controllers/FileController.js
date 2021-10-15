const ApiError = require('../errors/ApiError');
const FileService = require('../service/FileService');
const {validationResult} = require('express-validator');

class TaskController {
    async saveFile(req, res, next){
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return next(ApiError.badRequest("Invalid data", errors))
            }
            const {taskId, commentId} = req.body;
            const {file} = req.files;
            const fileInfo = await FileService.saveFile(file, {
                taskId,
                commentId
            });
            res.json({file: fileInfo})
        } catch (e) {
            next(e);
        }
    }
   
    async deleteFile(req, res, next){
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return next(ApiError.badRequest("Invalid data", errors))
            }
            const {fileId} = req.params;
            const isDone = await FileService.deleteFile(fileId);
            res.json({deleted: isDone});
        } catch (e) {
            console.log(e)
            next(e);
        }
    }
}

module.exports = new TaskController();