const { Comment, Task, ProjectUser, Project, File, User } = require("../models/models");
const ApiError = require("../errors/ApiError");
const jwt = require('jsonwebtoken');
const FileService = require('./FileService');

async function validateUser(projectId, taskId, token) {
    const project = await Project.findById(projectId);
    if (!project) {
        throw ApiError.badRequest(`Project with id '${projectId}' not found`);
    }
    const user = jwt.decode(token);
    const userInProject = await ProjectUser.findOne({ project: projectId, user: user.id });
    if (!userInProject && user.role != 'ADMIN') {
        throw ApiError.forbidden('You do not have permissions to this resource');
    }
    const task = await Task.findById(taskId);
    if (!task) {
        throw ApiError.badRequest(`Task with id '${taskId}' not found`);
    }
    if (task.projectId.toString() !== projectId) {
        throw ApiError.badRequest(`Project with id '${projectId}' does not have a task with id '${taskId}'`);
    }
}

async function formComment(id) {
    const comment = await Comment.findById(id).select('-updatedAt -taskId -userId');
    if (!comment) {
        throw ApiError.badRequest(`Comment with id '${id}' not found`);
    }
    const files = await File.find({ comment: comment._id }).select('-createdAt -updatedAt -path -commentId -taskId');
    const user = await User.findById(comment.user).select('-createdAt -updatedAt -password');
    return {
        ...comment.toObject(),
        user,
        files
    };
}

async function saveFilesOfNewComment(files, commentId) {
    if (files.length > 0) {
        for (let i = 0; i < files.length; i++) {
            await FileService.attachFile(files[i], { comment: commentId });
        }
    } else {
        await FileService.attachFile(files, { comment: commentId });
    }
}

class CommentService {
    async getComments(projectId, taskId, token) {
        await validateUser(projectId, taskId, token);
        const comments = await Comment.find({ task: taskId });
        const formedComments = [];
        for (let i = 0; i < comments.length; i++) {
            const formedComment = await formComment(comments[i]._id);
            formedComments.push(formedComment);
        }
        return formedComments;
    }

    async createComment(projectId, taskId, token, message, files) {
        await validateUser(projectId, taskId, token);
        const user = jwt.decode(token);
        const comment = await Comment.create({ message, task: taskId, user: user.id });
        if (files) {
            await saveFilesOfNewComment(files, comment._id);
        }
        const formedComment = await formComment(comment._id);
        return formedComment;
    }

    async editComment(projectId, taskId, commentId, token, message, files) {
        await validateUser(projectId, taskId, token);
        const comment = await Comment.findById(commentId);
        if (!comment) {
            throw ApiError.badRequest(`Comment with id '${commentId}' not found`);
        }
        await Comment.updateOne({ _id: commentId }, { message });
        if (files) {
            await saveFilesOfNewComment(files, comment._id);
        }
        const formedComment = await formComment(comment._id);
        return formedComment;
    }

    async deleteComment(projectId, taskId, commentId, token) {
        await validateUser(projectId, taskId, token);
        const comment = await Comment.findById(commentId);
        if (!comment) {
            throw ApiError.badRequest(`Comment with id '${commentId}' not found`);
        }
        const deletedComment = await Comment.deleteOne({ _id: commentId });
        return deletedComment.deletedCount > 0;
    }
}

module.exports = new CommentService();
