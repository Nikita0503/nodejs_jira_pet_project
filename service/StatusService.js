const { Status } = require("../models/models");
const ApiError = require("../errors/ApiError");

class StatusService {
    async getAllStatuses(){
        const projects = await Status.findAll();
        return projects;
    }

    async createStatus(title, color){
        const candidate = await Status.findOne({where: {title}});
        if(candidate){
            throw ApiError.internal(`Status with title '${title}' already exist`);
        }
        const status = await Status.create({title, color});
        return status;
    }
}

module.exports = new StatusService();