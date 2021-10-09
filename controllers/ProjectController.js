const ApiError = require('../errors/ApiError');;
const ProjectService = require('../service/ProjectService');
const {validationResult} = require('express-validator');

class ProjectController {

    async getAllProjects(req, res, next){
        try{
            const projects = await ProjectService.getAllProjects();
            return res.json({projects})
        } catch (e) {
            next(e);
        }
    }

    async createProject(req, res, next){
        try{
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return next(ApiError.badRequest("Invalid data", errors))
            }
            const {title, description} = req.body;
            const project = await ProjectService.createProject(title, description);
            return res.json({project})
        } catch (e) {
            next(e);
        }
    }

    async editProject(req, res, next){
        try{
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return next(ApiError.badRequest("Invalid data", errors))
            }
            const {projectId} = req.params;
            const {title, description} = req.body;
            const isDone = await ProjectService.editProject(projectId, title, description);
            return res.json({updated: isDone});
        } catch (e) {
            next(e);
        }
    }

    async deleteProject(req, res, next){
        try {
            const {projectId} = req.params;
            const isDone = await ProjectService.deleteProject(projectId);
            return res.json({deleted: isDone});
        } catch (e) {
            next(e);
        }
    }

    async getProjectMembers(req, res, next){
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return next(ApiError.badRequest("Invalid data", errors))
            }
            const {projectId} = req.params;
            const token = req.headers.authorization.split(' ')[1];
            const users = await ProjectService.getProjectMembers(projectId, token);
            return res.json({users})
        } catch (e) {
            next(e);
        }
    }
    
    async addUserToProject(req, res, next){
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return next(ApiError.badRequest("Invalid data", errors))
            }
            const {projectId} = req.params;
            const {userId} = req.body;
            const isDone = await ProjectService.addUserToProject(projectId, userId);
            return res.json({added: isDone})
        } catch (e) {
            next(e);
        }
    }

    async deleteUserFromProject(req, res, next){
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return next(ApiError.badRequest("Invalid data", errors))
            }
            const {projectId} = req.params;
            const {userId} = req.body;
            const isDone = await ProjectService.deleteUserFromProject(projectId, userId);
            return res.json({deleted: isDone})
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new ProjectController();