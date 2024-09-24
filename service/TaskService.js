const { Task, Project, User, ProjectUser, Status, Type, File } = require("../models/models");
const ApiError = require("../errors/ApiError");
const jwt = require('jsonwebtoken');
const FileService = require('./FileService');

async function formTask(id) {
    const task = await Task.findById(id).select('-createdAt -updatedAt');
    if (!task) {
        throw ApiError.badRequest(`Task with id '${id}' not found`);
    }
    const files = await File.find({ taskId: task._id }).select('-createdAt -updatedAt -path -commentId');
    const status = await Status.findById(task.statusId).select('-createdAt -updatedAt');
    const type = await Type.findById(task.typeId).select('-createdAt -updatedAt');
    const user = await User.findById(task.userId).select('-createdAt -updatedAt -password');

    return {
        ...task.toObject(),
        status,
        type,
        user,
        files
    };
}

async function saveFilesOfNewTask(files, taskId) {
    if (files && files.length > 0) {
        for (let i = 0; i < files.length; i++) {
            await FileService.attachFile(files[i], { taskId });
        }
    } else {
        await FileService.attachFile(files, { taskId });
    }
}

class TaskService {
    async getTasks(projectId, token) {
        const user = jwt.decode(token);
        const userInProject = await ProjectUser.findOne({ projectId, userId: user.id });
        if (!userInProject && user.role !== 'ADMIN') {
            throw ApiError.forbidden('You do not have permissions to this resource');
        }
        const tasks = await Task.find({ projectId });
        const formedTasks = await Promise.all(tasks.map(task => formTask(task._id)));
        return formedTasks;
    }

    async createTask(projectId, title, description, timeAllotted, statusId, typeId, userId, files) {
        const project = await Project.findById(projectId);
        if (!project) {
            throw ApiError.badRequest(`Project with id '${projectId}' not found`);
        }
        const userInProject = await ProjectUser.findOne({ projectId, userId });
        if (!userInProject) {
            throw ApiError.badRequest(`User with id ${userId} not found in project`);
        }
        const status = await Status.findById(statusId);
        if (!status) {
            throw ApiError.badRequest(`Status with id '${statusId}' not found`);
        }
        const type = await Type.findById(typeId);
        if (!type) {
            throw ApiError.badRequest(`Type with id '${typeId}' not found`);
        }

        const task = await Task.create({ title, description, timeTracked: null, timeAllotted, projectId, statusId, typeId, userId });
        if (files) {
            await saveFilesOfNewTask(files, task._id);
        }
        return await formTask(task._id);
    }

    async editTask(projectId, taskId, title, description, timeAllotted, timeTracked, statusId, typeId, userId, files) {
        const project = await Project.findById(projectId);
        if (!project) {
            throw ApiError.badRequest(`Project with id '${projectId}' not found`);
        }
        const task = await Task.findById(taskId);
        if (!task) {
            throw ApiError.badRequest(`Task with id '${taskId}' not found`);
        }
        if (userId) {
            const user = await User.findById(userId);
            if (!user) {
                throw ApiError.badRequest(`User with id ${userId} not found`);
            }
        }
        if (statusId) {
            const status = await Status.findById(statusId);
            if (!status) {
                throw ApiError.badRequest(`Status with id '${statusId}' not found`);
            }
        }
        if (typeId) {
            const type = await Type.findById(typeId);
            if (!type) {
                throw ApiError.badRequest(`Type with id '${typeId}' not found`);
            }
        }

        await Task.updateOne({ _id: taskId }, { title, description, timeAllotted, timeTracked, statusId, typeId, userId });
        if (files) {
            await saveFilesOfNewTask(files, task._id);
        }
        return await formTask(task._id);
    }

    async deleteTask(projectId, taskId) {
        const project = await Project.findById(projectId);
        if (!project) {
            throw ApiError.badRequest(`Project with id '${projectId}' not found`);
        }
        const task = await Task.findById(taskId);
        if (!task) {
            throw ApiError.badRequest(`Task with id '${taskId}' not found`);
        }
        const deletedTask = await Task.deleteOne({ _id: taskId });
        return deletedTask.deletedCount > 0;
    }
}

module.exports = new TaskService();
