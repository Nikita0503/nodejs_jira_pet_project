const { Project } = require("../models/models");
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
            throw ApiError.badRequest(`Project with id '${title}' not found`);
        }
        project = await Project.findOne({where: {title, id: {[Op.ne]: [id]}}});
        if(project){
            throw ApiError.internal(`Project with title '${title}' already exist`);
        }
        const updatedProjectId = await Project.update({title, description}, {where: {id}});
        return !!updatedProjectId;
    }
}

module.exports = new ProjectService();