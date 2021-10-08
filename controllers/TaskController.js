const ApiError = require('../errors/ApiError');;
const TaskService = require('../service/TaskService');
const {validationResult} = require('express-validator');

class TaskController {

    async getTasks(req, res, next){
        try{
            const {projectId} = req.params;
            const tasks = await TaskService.getTasks(projectId);
            return res.json({tasks})
        } catch (e) {
            next(e);
        }
    }

    async createTask(req, res, next){
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return next(ApiError.badRequest("Invalid data", errors))
            }
            const {projectId} = req.params;
            const {title, description, timeAllotted, statusId, typeId, userId} = req.body;
            const task = await TaskService.createTask(projectId, title, description, timeAllotted, statusId, typeId, userId);
            return res.json({task})
        } catch (e) {
            next(e);
        }
    }

    async editTask(req, res, next){
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return next(ApiError.badRequest("Invalid data", errors))
            }
            const {projectId, taskId} = req.params;
            const {title, description, timeAllotted, timeTracked, statusId, typeId, userId} = req.body;
            const isDone = await TaskService.editTask(projectId, taskId, title, description, timeAllotted, timeTracked, statusId, typeId, userId);
            return res.json({updated: isDone})
        } catch (e) {
            console.log("ERROR", e)
            next(e);
        }
    }

    async deleteTask(req, res, next){
        try {
            const {projectId, taskId} = req.params;
            const isDone = await TaskService.deleteTask(projectId, taskId);
            return res.json({deleted: isDone})
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new TaskController();