const { Comment, Task, ProjectUser, Project, File, User } = require("../models/models");
const ApiError = require("../errors/ApiError");
const { Op } = require("sequelize");
const jwt = require('jsonwebtoken');
const FileService = require('./FileService');

async function validateUser(projectId, taskId, token){
    const project = await Project.findOne({where: {id: projectId}});
    if(!project){
        throw ApiError.badRequest(`Project with id '${projectId}' not found`);
    }
    const task = await Task.findOne({where: {id: taskId}});
    if(!task){
        throw ApiError.badRequest(`Task with id '${taskId}' not found`);
    }
    const taskInProject = await Task.findOne({where: {id: taskId, projectId: projectId}});
    if(!taskInProject){
        throw ApiError.badRequest(`Task with id '${taskId}' in project with id '${projectId}' not found`);
    }
    const user = jwt.decode(token);
    const userInProject = await ProjectUser.findOne({where: {projectId, userId: user.id}});
    if(!userInProject && user.role != 'ADMIN'){
        throw ApiError.forbidden('You do not have permissions to this resource')
    }
}

async function formComment(id){
    const comment = await Comment.findOne({attributes: {exclude: ['updatedAt']}, where: {id}})
    let formedComment = {...comment.dataValues};
    delete formedComment.taskId;
    delete formedComment.userId;
    const files = await File.findAll({attributes: {exclude: ['createdAt', 'updatedAt', 'path', 'commentId', 'taskId']}, where: {commentId: comment.id}});
    const user = await User.findOne({attributes: {exclude: ['createdAt', 'updatedAt', 'password']}, where: {id: comment.userId}})
    return {
        ...formedComment,
        user,
        files
    }
}

async function saveFilesOfNewComment(files, commentId){
    if(files.length > 0){
        for(let i = 0; i < files.length; i++){
            await FileService.attachFile(files[i], {commentId});
        }
    }else{
        await FileService.attachFile(files, {commentId});
    }
}

class CommentService {
    async getComments(projectId, taskId, token){
        await validateUser(projectId, taskId, token);
        const comments = await Comment.findAll({where: {taskId}});
        const formedComments = [];
        for(let i = 0; i < comments.length; i++){
            const formedComment = await formComment(comments[i].id);
            formedComments.push(formedComment);
        }
        return formedComments;
    }

    async createComment(projectId, taskId, token, message, files){
        await validateUser(projectId, taskId, token);
        const user = jwt.decode(token);
        const comment = await Comment.create({message, taskId, userId: user.id});
        if(files){
            await saveFilesOfNewComment(files, comment.id);
        }
        const formedComment = await formComment(comment.id);
        return formedComment;
    }

    async editComment(projectId, taskId, commentId, token, message, files){
        await validateUser(projectId, taskId, token);
        const comment = await Comment.findOne({where: {id: commentId}});
        if(!comment){
            throw ApiError.badRequest(`Comment with id '${commentId}' not found`);
        }
        const commentInTask = await Comment.findOne({where: {id: commentId, taskId: taskId}});
        if(!commentInTask){
            throw ApiError.badRequest(`Comment with id '${commentId}' in task with id '${taskId}' not found`);
        }
        const user = jwt.decode(token);
        if(comment.dataValues.userId != user.id){
            throw ApiError.badRequest(`You can't edit comment with id '${commentId}', it is not your`);
        }
        await Comment.update({message}, {where: {id: commentId}});
        if(files){
            await saveFilesOfNewComment(files, comment.id);
        }
        const formedComment = await formComment(comment.id);
        return formedComment;
    }

    async deleteComment(projectId, taskId, commentId, token){
        await validateUser(projectId, taskId, token);
        const comment = await Comment.findOne({where: {id: commentId}});
        if(!comment){
            throw ApiError.badRequest(`Comment with id '${commentId}' not found`);
        }
        const commentInTask = await Comment.findOne({where: {id: commentId, taskId: taskId}});
        if(!commentInTask){
            throw ApiError.badRequest(`Comment with id '${commentId}' in task with id '${taskId}' not found`);
        }
        const user = jwt.decode(token);
        if(comment.dataValues.userId != user.id && user.role != 'ADMIN'){
            throw ApiError.badRequest(`You can't delete comment with id '${commentId}', it is not your`);
        }
        const deletedCommentId = await Comment.destroy({where: {id: commentId}});
        return !!deletedCommentId;
    }
}

module.exports = new CommentService();