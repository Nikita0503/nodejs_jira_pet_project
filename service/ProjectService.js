const { Project, User, ProjectUser, Task } = require("../models/models");
const ApiError = require("../errors/ApiError");
const { Op } = require("sequelize");
const jwt = require('jsonwebtoken');

async function formProject(id){
    const project = await Project.findOne({attributes: {exclude: ['createdAt']}, where: {id}});
    let formedProject = {...project.dataValues};
    const tasksCount = await Task.count({where: {projectId: id}});
    const usersInProject = await ProjectUser.findAll({where: {projectId: id}}); 
    const userIds = usersInProject.map(user => user.dataValues.userId);
    const users = await User.findAll({attributes: {exclude: ['password', 'createdAt', 'updatedAt']}, where: {id: [...userIds]}});
    return {
        ...formedProject,
        tasksCount,
        users,
    }
}

class ProjectService {
    async getAllProjects(){
        const projects = await Project.findAll();
        const formedProjects = [];
        for(let i = 0; i < projects.length; i++){
            const formedProject = await formProject(projects[i].id);
            formedProjects.push(formedProject);
        }
        return formedProjects;
    }

    async existsProject(title){
        const project = await Project.findOne({where: {title: title.toString()}});
        return project;
    }

    async createProject(title, description){
        const candidate = await Project.findOne({where: {title: title.toString()}});
        if(candidate){
            throw ApiError.internal(`Project with title '${title}' already exist`);
        }
        const project = await Project.create({title, description});
        const formedProject = await formProject(project.id);
        return formedProject;
    }

    async editProject(projectId, title, description){
        let project = await Project.findOne({where: {id: projectId}});
        if(!project){
            throw ApiError.badRequest(`Project with id '${projectId}' not found`);
        }
        if(title){
            project = await Project.findOne({where: {title: title.toString(), id: {[Op.ne]: [projectId]}}});
            if(project){
                throw ApiError.internal(`Project with title '${title}' already exist`);
            }
        }
        await Project.update({title, description}, {where: {id: projectId}});
        const formedProject = await formProject(projectId);
        return formedProject;
    }

    async deleteProject(projectId){
        const project = await Project.findOne({where: {id: projectId}});
        if(!project){
            throw ApiError.badRequest(`Project with id '${projectId}' not found`);
        }
        const deletedProjectId = await Project.destroy({where: {id: projectId}});
        return !!deletedProjectId;
    }

    async getProjectMembers(projectId, token){
        const project = await Project.findOne({where: {id: projectId}});
        if(!project){
            throw ApiError.badRequest(`Project with id '${projectId}' not found`);
        }
        const user = jwt.decode(token);
        const userInProject = await ProjectUser.findOne({where: {projectId, userId: user.id}});
        if(!userInProject && user.role != 'ADMIN'){
            throw ApiError.forbidden('you do not have permissions to this resource')
        }
        const users = await ProjectUser.findAll({where: {projectId}});
        const ids = users.map(user => user.userId)
        const projectMembers = await User.findAll({attributes: {exclude: ['password', 'createdAt', 'updatedAt']},  where: {id: [...ids]}})
        return projectMembers;
    }

    async addUserToProject(projectId, userId){
        const project = await Project.findOne({where: {id: projectId}});
        if(!project){
            throw ApiError.badRequest(`Project with id '${id}' not found`);
        }
        const user = await User.findOne({where: {id: userId}});
        if(!user){
            throw ApiError.badRequest(`User with id ${userId} not found`);
        }
        const userInProject = await ProjectUser.findOne({where: {projectId, userId}});
        if(userInProject){
            throw ApiError.badRequest(`User with id ${userId} already added`);
        }
        const addedUserToProject = await ProjectUser.create({projectId, userId});
        return !!addedUserToProject;
    }

    async deleteUserFromProject(projectId, userId){
        const userInProject = await ProjectUser.findAll({where: {projectId, userId}});
        if(userInProject.length == 0){
            throw ApiError.badRequest(`User with id '${userId}' not found into project`);
        }
        const deletedProjectUserId = ProjectUser.destroy({where: {projectId, userId}});
        return !!deletedProjectUserId;
    }
}

module.exports = new ProjectService();