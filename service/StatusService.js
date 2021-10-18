const { Status } = require("../models/models");
const ApiError = require("../errors/ApiError");
const { Op } = require("sequelize");

class StatusService {
    async getAllStatuses(){//TODO: refactor: update should return instance;
        const statuses = await Status.findAll({attributes: {exclude: ['createdAt', 'updatedAt']}});
        return statuses;
    }

    async createStatus(title, color){
        const candidate = await Status.findOne({where: {title: title.toString()}});
        if(candidate){
            throw ApiError.internal(`Status with title '${title}' already exist`);
        }
        const status = await Status.create({title, color});
        return status;
    }

    async editStatus(statusId, title, color){
        let status = await Status.findOne({where: {id: statusId}});
        if(!status){
            throw ApiError.internal(`Status with id '${statusId}' not found`);
        }
        if(title){
            status = await Status.findOne({where: {title: title.toString(), id: {[Op.ne]: [statusId]}}});
            if(status){
                throw ApiError.internal(`Status with title '${title}' already exist`);
            }
        }
        const updatedStatusId = await Status.update({title, color}, {where: {id: statusId}});
        return !!updatedStatusId;
    }

    async deleteService(statusId){
        const status = await Status.findOne({where: {id: statusId}});
        if(!status){
            throw ApiError.internal(`Status with id '${statusId}' not found`);
        }
        const deletedStatusId = await Status.destroy({where: {id: statusId}});
        return !!deletedStatusId;
    }
}

module.exports = new StatusService();