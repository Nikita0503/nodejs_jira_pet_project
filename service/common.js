const { Task, Project, User, ProjectUser, Status, Type } = require("../models/models");
const ApiError = require("../errors/ApiError");

async function checkStatusExisting(id, onSucess, onFailure){
    const status = await Status.findOne({where: {id}});
    if(!status){
        throw ApiError.badRequest(`Status with id '${id}' not found`);
    }
}

async function checkTypeExisting(id){
    const type = await Type.findOne({where: {id}});
    if(!type){
        throw ApiError.badRequest(`Type with id '${id}' not found`);
    }
}

module.exports = {
    checkStatusExisting,
    checkTypeExisting
}