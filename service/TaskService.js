const { Task, Project, User } = require("../models/models");
const ApiError = require("../errors/ApiError");
const { Op } = require("sequelize");

class TaskService {
    async getTasks(projectId){
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

    async deleteTask(id){
        let task = await Task.findOne({where: {id}});
        if(!task){
            throw ApiError.badRequest(`Task with id '${id}' not found`);
        }
        const deletedTaskId = await Task.destroy({where: {id}});
        return !!deletedTaskId;
    }
}

module.exports = new TaskService();