const { Task, Project, User, ProjectUser, Status, Type, File } = require("../models/models");
const ApiError = require("../errors/ApiError");
const jwt = require('jsonwebtoken');
const FileService = require('./FileService');

async function formTask(id){
    const task = await Task.findOne({attributes: {exclude: ['createdAt', 'updatedAt']}, where: {id}});
    let formedTask = {...task.dataValues};
    delete formedTask.typeId;
    delete formedTask.statusId;
    delete formedTask.projectId;
    delete formedTask.userId;
    const files = await File.findAll({attributes: {exclude: ['createdAt', 'updatedAt', 'path', 'commentId', 'taskId']}, where: {taskId: task.id}});
    const status = await Status.findOne({attributes: {exclude: ['createdAt', 'updatedAt']}, where: {id: task.statusId}});
    const type = await Type.findOne({attributes: {exclude: ['createdAt', 'updatedAt']}, where: {id: task.typeId}});
    const user = await User.findOne({attributes: {exclude: ['createdAt', 'updatedAt', 'password']}, where: {id: task.userId}})
    return {
        ...formedTask,
        status,
        type,
        user,
        files
    }
}

async function saveFilesOfNewTask(files, taskId){
    if(files.length > 0){
        for(let i = 0; i < files.length; i++){
            await FileService.attachFile(files[0], {taskId});
        }
    }else{
        await FileService.attachFile(files, {taskId});
    }
}

class TaskService {
    async getTasks(projectId, token){
        const user = jwt.decode(token);
        const userInProject = await ProjectUser.findOne({where: {projectId, userId: user.id}});
        if(!userInProject && user.role != 'ADMIN'){
            throw ApiError.forbidden('you do not have permissions to this resource')
        }
        const tasks = await Task.findAll({where: {projectId}});
        const formedTasks = [];
        for(let i = 0; i < tasks.length; i++){
            const formedTask = await formTask(tasks[i].id);
            formedTasks.push(formedTask);
        }
        return formedTasks;
    }

    async createTask(projectId, title, description, timeAllotted, statusId, typeId, userId, files){
        const project = await Project.findOne({where: {id: projectId}});
        if(!project){
            throw ApiError.badRequest(`Project with id '${projectId}' not found`);
        }
        const user = await User.findOne({where: {id: userId}});
        if(!user){
            throw ApiError.badRequest(`User with id ${userId} not found`)
        }
        const status = await Status.findOne({where: {id: statusId}});
        if(!status){
            throw ApiError.badRequest(`Status with id '${statusId}' not found`);
        }
        const type = await Type.findOne({where: {id: typeId}});
        if(!type){
            throw ApiError.badRequest(`Type with id '${typeId}' not found`);
        }
        const task = await Task.create({title, description, timeTracked: null, timeAllotted, projectId, statusId, typeId, userId});
        if(files){
            await saveFilesOfNewTask(files, task.id);
        }
        const formedTask = await formTask(task.id);
        return formedTask;
    }

    async editTask(projectId, taskId, title, description, timeAllotted, timeTracked, statusId, typeId, userId, files){
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
        if(statusId){
            const status = await Status.findOne({where: {id: statusId}});
            if(!status){
                throw ApiError.badRequest(`Status with id '${statusId}' not found`);
            }
        }
        if(typeId){
            const type = await Type.findOne({where: {id: typeId}});
            if(!type){
                throw ApiError.badRequest(`Type with id '${typeId}' not found`);
            }
        }
        await Task.update({title, description, timeAllotted, timeTracked, statusId, typeId, userId}, {where: {id: taskId}});
        if(files){
            await saveFilesOfNewTask(files, task.id);
        }
        const formedTask = await formTask(task.id);
        return formedTask;
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