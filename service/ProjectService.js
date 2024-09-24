const { Project, User, ProjectUser, Task, Status, Type, File } = require("../models/models");
const ApiError = require("../errors/ApiError");
const jwt = require('jsonwebtoken');

async function formProject(id) {
    const project = await Project.findById(id).select('-createdAt');
    if (!project) {
        throw ApiError.badRequest(`Project with id '${id}' not found`);
    }

    const tasksCount = await Task.countDocuments({ projectId: id });
    const usersInProject = await ProjectUser.find({ projectId: id });
    const userIds = usersInProject.map(user => user.userId);
    const users = await User.find({ _id: { $in: userIds } }).select('-password -createdAt -updatedAt');

    return {
        ...project.toObject(),
        tasksCount,
        users,
    };
}

async function formFullProject(id) {
    const project = await Project.findById(id).select('-createdAt');
    if (!project) {
        throw ApiError.badRequest(`Project with id '${id}' not found`);
    }

    const tasksCount = await Task.countDocuments({ projectId: id });
    const usersInProject = await ProjectUser.find({ projectId: id });
    const userIds = usersInProject.map(user => user.userId);
    const users = await User.find({ _id: { $in: userIds } }).select('-password -createdAt -updatedAt');

    const tasksInProject = await Task.find({ projectId: id });

    const tasks = await Promise.all(tasksInProject.map(async (task) => {
        const taskStatus = await Status.findById(task.statusId).select('-createdAt -updatedAt');
        const taskFiles = await File.find({ taskId: task._id }).select('-createdAt -updatedAt -path -commentId');
        const taskType = await Type.findById(task.typeId).select('-createdAt -updatedAt');
        const taskUser = await User.findById(task.userId).select('-createdAt -updatedAt -password');

        return {
            ...task.toObject(),
            status: taskStatus,
            type: taskType,
            user: taskUser,
            files: taskFiles,
        };
    }));

    return {
        ...project.toObject(),
        tasksCount,
        users,
        tasks,
    };
}

class ProjectService {
    async getAllProjects(token) {
        const user = jwt.decode(token);
        let projects;

        if (user.role === "ADMIN") {
            projects = await Project.find();
        } else {
            const userInProjects = await ProjectUser.find({ userId: user.id });
            const projectIds = userInProjects.map(up => up.projectId);
            projects = await Project.find({ _id: { $in: projectIds } });
        }

        const formedProjects = await Promise.all(projects.map(project => formProject(project._id)));
        return formedProjects;
    }

    async existsProject(title) {
        return await Project.findOne({ title: title.toString() });
    }

    async createProject(title, description) {
        const candidate = await Project.findOne({ title: title.toString() });
        if (candidate) {
            throw ApiError.internal(`Project with title '${title}' already exists`);
        }
        const project = await Project.create({ title, description });
        return await formProject(project._id);
    }

    async getFullProject(projectId) {
        const projectExists = await Project.findById(projectId);
        if (!projectExists) {
            throw ApiError.badRequest(`Project with id '${projectId}' not found`);
        }
        return await formFullProject(projectId);
    }

    async editProject(projectId, title, description) {
        let project = await Project.findById(projectId);
        if (!project) {
            throw ApiError.badRequest(`Project with id '${projectId}' not found`);
        }
        if (title) {
            const existingProject = await Project.findOne({ title: title.toString(), _id: { $ne: projectId } });
            if (existingProject) {
                throw ApiError.internal(`Project with title '${title}' already exists`);
            }
        }
        await Project.updateOne({ _id: projectId }, { title, description });
        return await formProject(projectId);
    }

    async deleteProject(projectId) {
        const project = await Project.findById(projectId);
        if (!project) {
            throw ApiError.badRequest(`Project with id '${projectId}' not found`);
        }
        const deletedProject = await Project.deleteOne({ _id: projectId });
        return deletedProject.deletedCount > 0;
    }

    async getProjectMembers(projectId, token) {
        const project = await Project.findById(projectId);
        if (!project) {
            throw ApiError.badRequest(`Project with id '${projectId}' not found`);
        }
        const user = jwt.decode(token);
        const userInProject = await ProjectUser.findOne({ projectId, userId: user.id });
        if (!userInProject && user.role !== 'ADMIN') {
            throw ApiError.forbidden('You do not have permissions to this resource');
        }
        const users = await ProjectUser.find({ projectId });
        const ids = users.map(user => user.userId);
        return await User.find({ _id: { $in: ids } }).select('-password -createdAt -updatedAt');
    }

    async addUserToProject(projectId, userId) {
        const project = await Project.findById(projectId);
        if (!project) {
            throw ApiError.badRequest(`Project with id '${projectId}' not found`);
        }
        const user = await User.findById(userId);
        if (!user) {
            throw ApiError.badRequest(`User with id '${userId}' not found`);
        }
        const userInProject = await ProjectUser.findOne({ projectId, userId });
        if (userInProject) {
            throw ApiError.badRequest(`User with id '${userId}' already added`);
        }
        const addedUserToProject = await ProjectUser.create({ projectId, userId });
        return !!addedUserToProject;
    }

    async deleteUserFromProject(projectId, userId) {
        const userInProject = await ProjectUser.findOne({ projectId, userId });
        if (!userInProject) {
            throw ApiError.badRequest(`User with id '${userId}' not found in project`);
        }
        const deletedProjectUser = await ProjectUser.deleteOne({ projectId, userId });
        return deletedProjectUser.deletedCount > 0;
    }
}

module.exports = new ProjectService();
