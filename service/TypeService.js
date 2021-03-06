const { Type } = require("../models/models");
const ApiError = require("../errors/ApiError");
const { Op } = require("sequelize");

async function formType(id){
    const type = await Type.findOne({attributes: {exclude: ['createdAt', 'updatedAt']}, where: {id}});
    return type
}

class TypeService {
    async getAllTypes(){
        const types = await Type.findAll({attributes: {exclude: ['createdAt', 'updatedAt']}});
        return types;
    }

    async createType(title, color){
        const candidate = await Type.findOne({where: {title: title.toString()}});
        if(candidate){
            throw ApiError.internal(`Type with title '${title}' already exist`);
        }
        const type = await Type.create({title, color});
        const formedType = await formType(type.id);
        return formedType;
    }

    async editType(typeId, title, color){
        let type = await Type.findOne({where: {id: typeId}});
        if(!type){
            throw ApiError.internal(`Type with id '${typeId}' not found`);
        }
        if(title){
            type = await Type.findOne({where: {title: title.toString(), id: {[Op.ne]: [typeId]}}});
            if(type){
                throw ApiError.internal(`Type with title '${title}' already exist`);
            }
        }
        await Type.update({title, color}, {where: {id: typeId}});
        const formedType = await formType(typeId);
        return formedType;
    }

    async deleteType(typeId){
        const type = await Type.findOne({where: {id: typeId}});
        if(!type){
            throw ApiError.internal(`Type with id '${typeId}' not found`);
        }
        const deletedTypeId = await Type.destroy({where: {id: typeId}});
        return !!deletedTypeId;
    }
}

module.exports = new TypeService();