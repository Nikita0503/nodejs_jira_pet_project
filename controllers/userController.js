const ApiError = require("../errors/ApiError");
const {validationResult} = require('express-validator');

class UserController {
    async login(req, res){
        return res.json({'message': 'login'})
    }

    async registration(req, res, next){
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return next(ApiError.badRequest("Invalid data", errors))
        }
        
        const {email, password} = req.body;
        
        return res.json({'message': 'registration'})
    }
}

module.exports = new UserController();