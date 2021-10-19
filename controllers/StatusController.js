const ApiError = require('../errors/ApiError');
const StatusService = require('../service/StatusService');
const {validationResult} = require('express-validator');

class StatusController {

    async getAllStatuses(req, res, next){
        try{
            const statuses = await StatusService.getAllStatuses();
            return res.json({statuses})
        } catch (e) {
            next(e);
        }
    }

    async createStatus(req, res, next){
        try{
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return next(ApiError.badRequest("Invalid data", errors))
            }
            const {title, color} = req.body;
            const status = await StatusService.createStatus(title, color);
            return res.json({status})
        } catch (e) {
            next(e);
        }
    }

    async editStatus(req, res, next){
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return next(ApiError.badRequest("Invalid data", errors))
            }
            const {statusId} = req.params;
            const {title, color} = req.body;
            const status = await StatusService.editStatus(statusId, title, color);
            return res.json({status})
        } catch (e) {
            next(e);
        }
    }

    async deleteStatus(req, res, next){
        try{
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return next(ApiError.badRequest("Invalid data", errors))
            }
            const {statusId} = req.params;
            const isDone = await StatusService.deleteService(statusId);
            return res.json({deleted: isDone})
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new StatusController();