const { Project, User, ProjectUser } = require("../models/models");
const ApiError = require("../errors/ApiError");
const { Op } = require("sequelize");

class ProjectService {
    async getAllProjects(){
        const projects = await Project.findAll();
        return projects;
    }

    async createProject(title, description){
        const candidate = await Project.findOne({where: {title}});
        if(candidate){
            throw ApiError.internal(`Project with title '${title}' already exist`);
        }
        const project = await Project.create({title, description});
        return project;
    }

    async editProject(id, title, description){
        let project = await Project.findOne({where: {id}});
        if(!project){
            throw ApiError.badRequest(`Project with id '${id}' not found`);
        }
        project = await Project.findOne({where: {title, id: {[Op.ne]: [id]}}});
        if(project){
            throw ApiError.internal(`Project with title '${title}' already exist`);
        }
        const updatedProjectId = await Project.update({title, description}, {where: {id}});
        return !!updatedProjectId;
    }

    async deleteProject(id){
        let project = await Project.findOne({where: {id}});
        if(!project){
            throw ApiError.badRequest(`Project with id '${id}' not found`);
        }
        const deletedProjectId = await Project.destroy({where: {id}});
        return !!deletedProjectId;
    }

    async addUserToProject(projectId, userId){
        const project = await Project.findOne({where: {id: projectId}});
        if(!project){
            throw ApiError.badRequest(`Project with id '${id}' not found`);
        }
        const user = await User.findOne({where: {id: userId}});
        if(!user){
            throw ApiError.badRequest(`User with id ${userId} not found`)
        }
        const addedUserToProject = await ProjectUser.create({projectId, userId});
        return !!addedUserToProject;
    }
}

module.exports = new ProjectService();