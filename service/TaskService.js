const { Task, Project, User, ProjectUser } = require("../models/models");
const ApiError = require("../errors/ApiError");
const { Op } = require("sequelize");
const jwt = require('jsonwebtoken');

class TaskService {
    async getTasks(projectId, token){
        const user = jwt.decode(token);
        const userInProject = await ProjectUser.findOne({where: {projectId, userId: user.id}});
        if(!userInProject && user.role != 'ADMIN'){
            throw ApiError.forbidden('you do not have permissions to this resource')
        }
        const tasks = await Task.findAll({where: {projectId}});
        return tasks;
    }

    async createTask(projectId, title, description, timeAllotted, statusId, typeId, userId){
        const project = await Project.findOne({where: {id: projectId}});
        if(!project){
            throw ApiError.badRequest(`Project with id '${projectId}' not found`);
        }
        const user = await User.findOne({where: {id: userId}});
        if(!user){
            throw ApiError.badRequest(`User with id ${userId} not found`)
        }
        //TODO: check statusId
        //TODO: check typeId
        const task = await Task.create({title, description, timeTracked: null, timeAllotted, projectId, statusId, typeId, userId});
        return task;
    }

    async editTask(projectId, taskId, title, description, timeAllotted, timeTracked, statusId, typeId, userId){
        const project = await Project.findOne({where: {id: projectId}});
        if(!project){
            throw ApiError.badRequest(`Project with id '${projectId}' not found`);
        }
        const task = await Task.findOne({where: {id: taskId}});
        if(!task){
            throw ApiError.badRequest(`Task with id '${taskId}' not found`);
        }
        if(userId){
            const user = await User.findOne({where: {id: userId}});
            if(!user){
                throw ApiError.badRequest(`User with id ${userId} not found`)
            }
        }
        //TODO: check statusId
        //TODO: check typeId
        const updatedTaskId = await Task.update({title, description, timeAllotted, timeTracked, statusId, typeId, userId}, {where: {id: taskId}});
        return !!updatedTaskId;
    }

    async deleteTask(projectId, taskId){
        const project = await Project.findOne({where: {id: projectId}});
        if(!project){
            throw ApiError.badRequest(`Project with id '${projectId}' not found`);
        }
        const task = await Task.findOne({where: {id: taskId}});
        if(!task){
            throw ApiError.badRequest(`Task with id '${taskId}' not found`);
        }
        const deletedTaskId = await Task.destroy({where: {id: taskId}});
        return !!deletedTaskId;
    }
}

module.exports = new TaskService();