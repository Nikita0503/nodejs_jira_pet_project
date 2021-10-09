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
            const statuses = await StatusService.createStatus(title, color);
            return res.json({statuses})
        } catch (e) {
            next(e);
        }
    }

   
}

module.exports = new StatusController();