const { Status, Task } = require("../models/models");
const ApiError = require("../errors/ApiError");
const { Op } = require("sequelize");

async function formStatus(id){
    const status = await Status.findOne({attributes: {exclude: ['createdAt', 'updatedAt']}, where: {id}});
    return status
}

class StatusService {
    async getAllStatuses(){
        const statuses = await Status.findAll({attributes: {exclude: ['createdAt', 'updatedAt']}});
        return statuses;
    }

    async createStatus(title, color){
        const candidate = await Status.findOne({where: {title: title.toString()}});
        if(candidate){
            throw ApiError.internal(`Status with title '${title}' already exist`);
        }
        const status = await Status.create({title, color});
        const formedStatus = await formStatus(status.id);
        return formedStatus;
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
        await Status.update({title, color}, {where: {id: statusId}});
        const formedStatus = await formStatus(statusId);
        return formedStatus;
    }

    async deleteService(statusId){
        const status = await Status.findOne({where: {id: statusId}});
        if(!status){
            throw ApiError.internal(`Status with id '${statusId}' not found`);
        }
        const deletedStatusId = await Status.destroy({where: {id: statusId}});
        const l = await Task.destroy({where: {statusId}});
        return !!deletedStatusId;
    }
}

module.exports = new StatusService();