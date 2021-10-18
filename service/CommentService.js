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
    const user = jwt.decode(token);
    const userInProject = await ProjectUser.findOne({where: {projectId, userId: user.id}});
    if(!userInProject && user.role != 'ADMIN'){
        throw ApiError.forbidden('you do not have permissions to this resource')
    }
    const task = await Task.findOne({where: {id: taskId}});
    if(!task){
        throw ApiError.badRequest(`Task with id '${taskId}' not found`);
    }
    if(task.projectId != projectId){
        throw ApiError.badRequest(`Project with id '${projectId}' do not has task with id '${taskId}'`);
    }
}

async function formComment(id){
    const comment = await Comment.findOne({attributes: {exclude: ['createdAt', 'updatedAt']}, where: {id}})
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
            await FileService.attachFile(files[0], {commentId});
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

    async editComment(projectId, taskId, commentId, token, message, files){ //test creating and editing comments and task with additing 1 and several files
        await validateUser(projectId, taskId, token);
        const comment = await Comment.findOne({where: {id: commentId}});
        if(!comment){
            throw ApiError.badRequest(`Comment with id '${commentId}' not found`);
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
        const deletedCommentId = await Comment.destroy({where: {id: commentId}});
        return !!deletedCommentId;
    }
}

module.exports = new CommentService();