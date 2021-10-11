const ApiError = require('../errors/ApiError');
const TypeService = require('../service/TypeService');
const {validationResult} = require('express-validator');

class StatusController {

    async getAllTypes(req, res, next){
        try{
            const types = await TypeService.getAllTypes();
            return res.json({types})
        } catch (e) {
            next(e);
        }
    }

    async createType(req, res, next){
        try{
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return next(ApiError.badRequest("Invalid data", errors))
            }
            const {title, color} = req.body;
            const types = await TypeService.createType(title, color);
            return res.json({types})
        } catch (e) {
            next(e);
        }
    }

    async editType(req, res, next){
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return next(ApiError.badRequest("Invalid data", errors))
            }
            const {typeId} = req.params;
            const {title, color} = req.body;
            const isDone = await TypeService.editType(typeId, title, color);
            return res.json({updated: isDone})
        } catch (e) {
            next(e);
        }
    }

    async deleteType(req, res, next){
        try{
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return next(ApiError.badRequest("Invalid data", errors))
            }
            const {typeId} = req.params;
            const isDone = await TypeService.deleteType(typeId);
            return res.json({deleted: isDone})
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new StatusController();