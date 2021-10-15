const { Comment, Task, ProjectUser, Project } = require("../models/models");
const ApiError = require("../errors/ApiError");
const { Op } = require("sequelize");
const jwt = require('jsonwebtoken');

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

class CommentService {
    async getComments(projectId, taskId, token){
        await validateUser(projectId, taskId, token);
        const comments = await Comment.findAll({where: {taskId}});
        return comments;
    }

    async createComment(projectId, taskId, token, message){
        await validateUser(projectId, taskId, token);
        const user = jwt.decode(token);
        const comment = await Comment.create({message, taskId, userId: user.id});
        return comment;
    }

    async editComment(){
        
    }

    async deleteComment(){
        
    }
}

module.exports = new CommentService();